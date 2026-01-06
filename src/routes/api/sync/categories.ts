import { createFileRoute } from "@tanstack/react-router";
import { google } from "googleapis";

export const Route = createFileRoute("/api/sync/categories")({
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

          const folderSearch = await drive.files.list({
            q: "name = 'Ed-Commerce' and mimeType = 'application/vnd.google-apps.folder' and trashed = false",
            fields: "files(id)",
          });

          const rootId = folderSearch.data.files?.[0]?.id;
          if (!rootId) throw new Error("Root folder 'Ed-Commerce' not found");

          const driveRes = await drive.files.list({
            q: `'${rootId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
            fields: "files(id, name)",
          });
          const driveFolders = driveRes.data.files || [];

          const results = await Promise.all(
            driveFolders.map(async (folder) => {
              try {
                const searchUrl = `${STRAPI_URL}/categories?filters[categoryId][$eq]=${folder.id}&status=draft`;
                const checkRes = await fetch(searchUrl, {
                  headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
                });
                const existing = await checkRes.json();

                if (existing.data?.length > 0)
                  return { name: folder.name, status: "skipped" };

                const createRes = await fetch(
                  `${STRAPI_URL}/categories?status=draft`,
                  {
                    method: "POST",
                    headers: {
                      Authorization: `Bearer ${STRAPI_TOKEN}`,
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      data: { name: folder.name, categoryId: folder.id },
                    }),
                  },
                );

                return createRes.ok
                  ? { name: folder.name, status: "created" }
                  : { name: folder.name, status: "error" };
              } catch (err) {
                return { name: folder.name, status: "failed" };
              }
            }),
          );

          return new Response(JSON.stringify(results), { status: 200 });
        } catch (error: any) {
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
          });
        }
      },
    },
  },
});
