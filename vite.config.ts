import { defineConfig } from "vite"; // Import from 'vite' directly
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { devtools } from "@tanstack/devtools-vite";
import netlify from "@netlify/vite-plugin-tanstack-start";
import neon from "./neon-vite-plugin.ts";

export default defineConfig({
  server: {
    // Standard Vite server options work perfectly here
    allowedHosts: [
      "https://doing-namespace-resist-mai.trycloudflare.com",
      ".ngrok-free.app",
      ".tunn.dev",
      ".trycloudflare.com",
    ],
  },
  plugins: [
    // tanstackStart() now replaces the old app.config.ts wrapper
    tanstackStart(),
    devtools(),
    netlify(),
    neon,
    tsconfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
  ],
});
