import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { devtools } from "@tanstack/devtools-vite";
import netlify from "@netlify/vite-plugin-tanstack-start";
import neon from "./neon-vite-plugin.ts";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    // Standard Vite server options work perfectly here
    allowedHosts: [
      "https://edcommerceapp.netlify.app", // current client
      "https://authentic-virtue-ebbd26e6cd.strapiapp.com", // current strapi
      ".trycloudflare.com", // cloudflare for dev
    ],
  },
  plugins: [
    tanstackStart(),
    react(), // React plugin here
    devtools(),
    netlify(),
    neon,
    tsconfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
  ],
});
