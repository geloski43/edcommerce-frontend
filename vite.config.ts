import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import viteTsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import netlify from "@netlify/vite-plugin-tanstack-start";
import neon from "./neon-vite-plugin.ts";

const config = defineConfig({
  server: {
    allowedHosts: [
      "https://doing-namespace-resist-mai.trycloudflare.com", // Your current ngrok host
      ".ngrok-free.app", // Wildcard to allow all future ngrok tunnels
      ".tunn.dev", // tunnelto
      ".trycloudflare.com", // cloudflared
    ],
  },
  plugins: [
    devtools(),
    netlify(),
    neon,
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tanstackStart(),
    viteReact(),
    tailwindcss(),
  ],
});

export default config;
