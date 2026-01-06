import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/payment/xendit-payment")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { email, amount, currency, clerkId, orderData } =
            await request.json();
          const itemsToProcess = orderData?.order_items || [];

          const strapiBase = process.env.VITE_STRAPI_URL;
          const strapiToken = process.env.VITE_STRAPI_API_TOKEN;

          // 1. Generate the ID once so it's the same for Strapi AND Xendit
          const externalId = `order-${Date.now()}`;

          // 2. RESOLVE CLERK ID TO STRAPI NUMERIC ID
          // (Strapi needs the numeric database ID to link the relation)
          const userLookup = await fetch(
            `${strapiBase}/users?filters[clerkId][$eq]=${clerkId}`,
            {
              headers: { Authorization: `Bearer ${strapiToken}` },
            },
          );
          const users = await userLookup.json();
          const strapiUserId = users.length > 0 ? users[0].id : null;

          // 3. SAVE TO STRAPI FIRST (The missing step!)
          const strapiSave = await fetch(`${strapiBase}/orders`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${strapiToken}`,
            },
            // Inside xendit-payment.ts
            body: JSON.stringify({
              data: {
                transactionId: externalId,
                orderStatus: "pending",
                user: strapiUserId,
                orderAmount: amount,
              },
            }),
          });

          const orderResult = await strapiSave.json();

          if (!strapiSave.ok) {
            console.error("Strapi Order Error:", orderResult);
            throw new Error("Could not initialize order in database.");
          }

          const newOrderId = orderResult.data.id; // THE GENERATED STRAPI ID
          console.log("orderResult", orderResult);
          console.log("itemsToProcess", itemsToProcess);
          // 4. CREATE INDIVIDUAL ORDER ITEMS
          await Promise.all(
            itemsToProcess.map(async (item: any) => {
              const res = await fetch(`${strapiBase}/order-items`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${strapiToken}`,
                },
                // Inside your itemsToProcess.map function
                body: JSON.stringify({
                  data: {
                    // productId: item.product_id, // to be removed
                    product: item.id,
                    order: newOrderId,
                    priceAtPurchase: Number(item.price),
                    quantity: Number(item.quantity),
                  },
                }),
              });

              if (!res.ok) {
                const errorData = await res.json();
                console.error(
                  `Error details for ${item.name}:`,
                  JSON.stringify(errorData),
                );
              }
              return res;
            }),
          );
          // 4. NOW CREATE XENDIT INVOICE
          const secretKey = process.env.VITE_XENDIT_SECRET_KEY;
          const authHeader = `Basic ${btoa(secretKey + `:`)}`;

          const xenditResponse = await fetch(
            "https://api.xendit.co/v2/invoices",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: authHeader,
              },
              body: JSON.stringify({
                external_id: externalId, // MUST match the orderId in Strapi
                amount: Math.round(amount),
                payer_email: email,
                currency: currency,
                description: `Purchase by user ${clerkId || "Guest"}`,
                success_redirect_url: `${process.env.VITE_BASE_URL}/payment-success`,
                failure_redirect_url: `${process.env.VITE_BASE_URL}/checkout`,
                items: itemsToProcess.map((item: any) => ({
                  name: item.name,
                  quantity: item.quantity,
                  price: Math.round(item.price),
                  // Combine: [Drive ID]:[Strapi ID]
                  category: `${item.product_id}:${item.id}`,
                })),
              }),
            },
          );

          const data = await xenditResponse.json();

          return new Response(
            JSON.stringify({ invoice_url: data.invoice_url }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            },
          );
        } catch (error: any) {
          console.error("Xendit Handler Error:", error);
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
