import { createFileRoute } from "@tanstack/react-router";
import { Webhook } from "svix";

export const Route = createFileRoute("/api/webhooks/clerk")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const WEBHOOK_SECRET = process.env.VITE_CLERK_WEBHOOK_KEY;

        if (!WEBHOOK_SECRET) {
          return new Response("Missing secret", { status: 500 });
        }

        // 1. Get headers and raw body for verification
        const svix_id = request.headers.get("svix-id");
        const svix_timestamp = request.headers.get("svix-timestamp");
        const svix_signature = request.headers.get("svix-signature");

        const payload = await request.json();
        const body = JSON.stringify(payload);

        const wh = new Webhook(WEBHOOK_SECRET);
        let evt: any;

        try {
          evt = wh.verify(body, {
            "svix-id": svix_id!,
            "svix-timestamp": svix_timestamp!,
            "svix-signature": svix_signature!,
          });
        } catch (err) {
          console.error("Webhook verification failed");
          return new Response("Invalid signature", { status: 400 });
        }

        // 2. Handle User Creation
        if (evt.type === "user.created") {
          const { id, email_addresses, username, first_name, last_name } =
            evt.data;

          // Fallback: If username is null (common with Google OAuth), use the email
          const email = email_addresses[0].email_address;
          const strapiUsername = username || email.split("@")[0] + id.slice(-4);

          const STRAPI_URL = process.env.VITE_STRAPI_URL;
          const STRAPI_TOKEN = process.env.VITE_STRAPI_API_TOKEN;

          try {
            const res = await fetch(`${STRAPI_URL}/users`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${STRAPI_TOKEN}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                username: strapiUsername,
                email: email,
                password: Math.random().toString(36).slice(-12), // Placeholder
                clerkId: id, // ENSURE THIS FIELD EXISTS IN STRAPI
                confirmed: true,
                role: 1, // Default Authenticated Role ID
              }),
            });

            if (!res.ok) {
              const errorData = await res.json();
              console.error("Strapi Error Details:", errorData);
              return new Response(JSON.stringify(errorData), {
                status: res.status,
              });
            }
          } catch (error) {
            console.error("Network error to Strapi:", error);
            return new Response("Internal Server Error", { status: 500 });
          }
        }

        return new Response("Webhook processed", { status: 200 });
      },
    },
  },
});
