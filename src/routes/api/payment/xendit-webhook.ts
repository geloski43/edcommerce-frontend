import { createFileRoute } from "@tanstack/react-router";
import { Resend } from "resend";
import { google } from "googleapis";

const resend = new Resend(process.env.VITE_RESEND_API_KEY);

export const Route = createFileRoute("/api/payment/xendit-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const xenditToken = request.headers.get("x-callback-token");

          // 1. Verify Security
          if (xenditToken !== process.env.VITE_XENDIT_CALLBACK_TOKEN) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
              status: 401,
            });
          }

          if (body.status === "PAID") {
            const externalId = body.external_id;
            const strapiBase = process.env.VITE_STRAPI_URL;
            const strapiToken = process.env.VITE_STRAPI_API_TOKEN;
            const xenditPaymentId = body.id || body.payment_id;

            // 2. Update Order Status in Strapi
            const findResponse = await fetch(
              `${strapiBase}/orders?filters[transactionId][$eq]=${externalId}`,
              { headers: { Authorization: `Bearer ${strapiToken}` } },
            );
            const searchData = await findResponse.json();

            if (searchData.data && searchData.data.length > 0) {
              const strapiDocumentId = searchData.data[0].documentId;
              await fetch(`${strapiBase}/orders/${strapiDocumentId}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${strapiToken}`,
                },
                body: JSON.stringify({
                  data: {
                    transactionId: xenditPaymentId,
                    orderStatus: "completed",
                    paidAt: body.paid_at,
                    paymentMethod: body.payment_channel || body.payment_method,
                  },
                }),
              });
            }

            // 3. Digital Delivery Logic (Sharing & Email)
            try {
              const xenditItems = body.items || [];
              const customerEmail =
                body.payer_email || searchData.data[0]?.email;

              // --- NEW: Update User Purchased List in Strapi ---
              try {
                if (customerEmail) {
                  console.log("xenditItems", xenditItems);

                  // 1. Find the user and their CURRENT purchases
                  const userSearch = await fetch(
                    `${strapiBase}/users?filters[email][$eq]=${customerEmail}&populate=purchased`,
                    { headers: { Authorization: `Bearer ${strapiToken}` } },
                  );
                  const userData = await userSearch.json();
                  const targetUser = userData[0]; // Strapi /users returns an array directly

                  if (targetUser) {
                    // 2. Extract existing product IDs
                    const existingPurchasedIds =
                      targetUser.purchased?.map((p: any) => p.id) || [];

                    // 3. Extract new product IDs from current transaction
                    // xenditItems 'metadata.strapi_id' is used as the product document ID here
                    const newProductIds = xenditItems
                      .map((item: any) => {
                        // category format: "1wY44az...:35"
                        if (item.category && item.category.includes(":")) {
                          const parts = item.category.split(":");
                          const strapiId = parts[1]; // The second part is the Strapi ID
                          return strapiId ? Number(strapiId) : null;
                        }
                        return null;
                      })
                      .filter((id): id is number => id !== null && !isNaN(id));

                    // 4. Merge and Remove Duplicates
                    const updatedPurchasedList = Array.from(
                      new Set([...existingPurchasedIds, ...newProductIds]),
                    );
                    console.log(
                      "Strapi Product IDs to add to user:",
                      updatedPurchasedList,
                    );
                    // 5. Update the User record
                    await fetch(`${strapiBase}/users/${targetUser.id}`, {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${strapiToken}`,
                      },
                      body: JSON.stringify({
                        purchased: updatedPurchasedList,
                      }),
                    });

                    console.log(`✅ User ${customerEmail} purchases updated.`);
                  }
                }
              } catch (uErr: any) {
                console.error(
                  "❌ Failed to update user purchases:",
                  uErr.message,
                );
              }

              if (xenditItems.length > 0 && customerEmail) {
                // 1. Clean the private key string
                // This handles cases where the key has literal '\n' or is wrapped in extra quotes
                const rawKey = process.env.VITE_GOOGLE_PRIVATE_KEY || "";
                const formattedKey = rawKey
                  .replace(/\\n/g, "\n") // Convert literal \n to real newlines
                  .replace(/"/g, "") // Remove any accidental double quotes
                  .trim();

                // Initialize Google Drive Auth
                const auth = new google.auth.JWT({
                  email: process.env.VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL,
                  key: formattedKey,
                  scopes: ["https://www.googleapis.com/auth/drive"],
                });
                const drive = google.drive({ version: "v3", auth });

                const downloadLinks = [];

                // Loop through items to grant permissions
                for (const item of xenditItems) {
                  // Unpack: fileId is the first part, strapiId is the second part
                  const [fileId] = item.category.split(":");

                  if (!fileId) {
                    console.error(
                      `❌ No File ID found in category for item: ${item.name}`,
                    );
                    continue;
                  }

                  try {
                    // Grant 'reader' access to the customer's email
                    await drive.permissions.create({
                      fileId: fileId,
                      sendNotificationEmail: false,
                      requestBody: {
                        role: "reader",
                        type: "user",
                        emailAddress: customerEmail,
                      },
                    });

                    downloadLinks.push({
                      name: item.name,
                      link: `https://drive.google.com/file/d/${fileId}/view?usp=sharing`,
                    });

                    console.log(
                      `✅ Permission granted for: ${item.name} (${fileId})`,
                    );
                  } catch (pErr: any) {
                    console.error(
                      `⚠️ Permission failed for ${fileId}:`,
                      pErr.message,
                    );

                    // Still add the link as a fallback
                    downloadLinks.push({
                      name: item.name,
                      link: `https://drive.google.com/file/d/${fileId}/view?usp=sharing`,
                    });
                  }
                }

                console.log("downloadLinks with granted access", downloadLinks);

                if (downloadLinks.length > 0) {
                  // 4. Send Email via Resend
                  await resend.emails.send({
                    from: "onboarding@resend.dev",
                    to: customerEmail,
                    subject: "📦 Your Digital Downloads are Ready!",
                    html: `
                      <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
                        <h2>Thanks for your purchase!</h2>
                        <p>Order ID: <strong>${externalId}</strong></p>
                        <p>Access has been granted to: <strong>${customerEmail}</strong></p>
                        <p>You can view and download your files here:</p>
                        <ul>
                          ${downloadLinks
                            .map(
                              (dl: any) =>
                                `<li style="margin-bottom: 10px;">
                                  <strong>${dl.name}</strong>: <br>
                                  <a href="${dl.link}" style="color: #007bff;">Download/View File</a>
                                </li>`,
                            )
                            .join("")}
                        </ul>
                        <p style="font-size: 12px; color: #777;">Note: Please make sure you are logged into your Google account (${customerEmail}) to access the links.</p>
                      </div>
                    `,
                  });
                  console.log(
                    `✅ Email sent & permissions granted to ${customerEmail}`,
                  );
                }
              }
            } catch (err: any) {
              console.error("❌ Delivery Error:", err.message);
            }
          }

          return new Response(JSON.stringify({ status: "success" }), {
            status: 200,
          });
        } catch (err: any) {
          console.error("Webhook Error:", err.message);
          return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
          });
        }
      },
    },
  },
});
