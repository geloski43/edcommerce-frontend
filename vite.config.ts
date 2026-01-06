import { defineConfig } from "vite"; // Import from 'vite' directly
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { devtools } from "@tanstack/devtools-vite";
import netlify from "@netlify/vite-plugin-tanstack-start";
import neon from "./neon-vite-plugin.ts";
import react from "@vitejs/plugin-react"; // Add this import

export default defineConfig({
  server: {
    // Standard Vite server options work perfectly here
    allowedHosts: [
      "https://695cba001d16434c299703be--edcommerceapp.netlify.app",
      ".ngrok-free.app",
      ".tunn.dev",
      ".trycloudflare.com",
    ],
  },
  plugins: [
    // tanstackStart() now replaces the old app.config.ts wrapper
    tanstackStart(),
    react(), // Add the React plugin here
    devtools(),
    netlify(),
    neon,
    tsconfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
  ],
});
