import { createFileRoute } from "@tanstack/react-router";
import { google } from "googleapis";

export const Route = createFileRoute("/api/sync/products")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const incomingSecret = request.headers.get("x-sync-secret");
        const localSecret = process.env.VITE_SYNC_SECRET;

        if (!incomingSecret || incomingSecret !== localSecret) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
          });
        }

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
          console.log("rootSearch files", rootSearch.data.files);

          // Get Categories
          const catRes = await drive.files.list({
            q: `'${rootId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
            fields: "files(id, name)",
          });
          console.log("catRes files", catRes.data.files);

          const syncSummary = [];

          for (const catFolder of catRes.data.files || []) {
            // Get Sub-categories inside this Category
            const subRes = await drive.files.list({
              q: `'${catFolder.id}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
              fields: "files(id, name)",
            });

            for (const subFolder of subRes.data.files || []) {
              // Find the Sub-category ID in Strapi
              const strapiSubRes = await fetch(
                `${STRAPI_URL}/sub-categories?filters[subCategoryId][$eq]=${subFolder.id}&status=draft`,
                {
                  headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
                },
              );
              const strapiSubData = await strapiSubRes.json();
              const strapiSubId = strapiSubData.data?.[0]?.id;

              if (!strapiSubId) continue;

              // Get Products (Files)
              const fileRes = await drive.files.list({
                q: `'${subFolder.id}' in parents and mimeType != 'application/vnd.google-apps.folder' and trashed = false`,
                fields: "files(id, name)",
              });

              const productResults = await Promise.all(
                (fileRes.data.files || []).map(async (file) => {
                  const check = await fetch(
                    `${STRAPI_URL}/products?filters[productId][$eq]=${file.id}&status=draft`,
                    {
                      headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
                    },
                  );
                  const existing = await check.json();
                  if (existing.data?.length > 0) return { status: "skipped" };

                  const create = await fetch(
                    `${STRAPI_URL}/products?status=draft`,
                    {
                      method: "POST",
                      headers: {
                        Authorization: `Bearer ${STRAPI_TOKEN}`,
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        data: {
                          name: file.name,
                          productId: file.id,
                          sub_category: strapiSubId,
                          isDigital: true,
                        },
                      }),
                    },
                  );
                  return create.ok
                    ? { status: "created" }
                    : { status: "error" };
                }),
              );

              syncSummary.push({
                subCategory: subFolder.name,
                created: productResults.filter((r) => r.status === "created")
                  .length,
                skipped: productResults.filter((r) => r.status === "skipped")
                  .length,
              });
            }
          }

          return new Response(
            JSON.stringify({ success: true, summary: syncSummary }),
            { status: 200 },
          );
        } catch (error: any) {
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
          });
        }
      },
    },
  },
});
