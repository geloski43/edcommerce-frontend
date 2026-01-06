import { createFileRoute } from "@tanstack/react-router";
import { google } from "googleapis";

export const Route = createFileRoute("/api/sync/subcategories")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const incomingSecret = request.headers.get("x-sync-secret");
        const localSecret = process.env.VITE_SYNC_SECRET;

        // if (!incomingSecret || incomingSecret !== localSecret) {
        //   return new Response(JSON.stringify({ error: "Unauthorized" }), {
        //     status: 401,
        //   });
        // }

        try {
          const STRAPI_URL = process.env.VITE_STRAPI_URL;
          const STRAPI_TOKEN = process.env.VITE_STRAPI_API_TOKEN;

          const auth = new google.auth.OAuth2(
            process.env.VITE_GOOGLE_CLIENT_ID,
            process.env.VITE_GOOGLE_CLIENT_SECRET,
          );
          auth.setCredentials({
            refresh_token: process.env.VITE_GOOGLE_REFRESH_TOKEN,
          });
          const drive = google.drive({ version: "v3", auth });

          const rootSearch = await drive.files.list({
            q: "name = 'Ed-Commerce' and mimeType = 'application/vnd.google-apps.folder' and trashed = false",
            fields: "files(id)",
          });
          const rootId = rootSearch.data.files?.[0]?.id;

          const catRes = await drive.files.list({
            q: `'${rootId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
            fields: "files(id, name)",
          });

          const finalResults = [];

          for (const catFolder of catRes.data.files || []) {
            // Find parent ID in Strapi
            const strapiCatRes = await fetch(
              `${STRAPI_URL}/categories?filters[categoryId][$eq]=${catFolder.id}&status=draft`,
              {
                headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
              },
            );
            const strapiCatData = await strapiCatRes.json();
            const parentId = strapiCatData.data?.[0]?.id;

            if (!parentId) continue;

            const subRes = await drive.files.list({
              q: `'${catFolder.id}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
              fields: "files(id, name)",
            });

            const subSync = await Promise.all(
              (subRes.data.files || []).map(async (sub) => {
                try {
                  const check = await fetch(
                    `${STRAPI_URL}/sub-categories?filters[subCategoryId][$eq]=${sub.id}&status=draft`,
                    {
                      headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
                    },
                  );
                  const existing = await check.json();

                  // Ensure data exists and has length before skipping
                  if (existing.data && existing.data.length > 0) {
                    return { name: sub.name, status: "skipped" };
                  }

                  // IMPORTANT: Added ?status=draft to the POST URL to match the check criteria
                  const create = await fetch(
                    `${STRAPI_URL}/sub-categories?status=draft`,
                    {
                      method: "POST",
                      headers: {
                        Authorization: `Bearer ${STRAPI_TOKEN}`,
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        data: {
                          name: sub.name,
                          subCategoryId: sub.id,
                          category: parentId,
                        },
                      }),
                    },
                  );

                  return create.ok
                    ? { name: sub.name, status: "created" }
                    : { name: sub.name, status: "error" };
                } catch (err) {
                  return { name: sub.name, status: "failed" };
                }
              }),
            );

            finalResults.push({
              category: catFolder.name,
              subCategories: subSync,
            });
          }

          return new Response(JSON.stringify(finalResults), { status: 200 });
        } catch (error: any) {
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
          });
        }
      },
    },
  },
});
