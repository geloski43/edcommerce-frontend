// vite.config.ts
import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import viteTsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import netlify from "@netlify/vite-plugin-tanstack-start";

// neon-vite-plugin.ts
import postgresPlugin from "@neondatabase/vite-plugin-postgres";
var neon_vite_plugin_default = postgresPlugin({
  seed: {
    type: "sql-script",
    path: "db/init.sql"
  },
  referrer: "create-tanstack",
  dotEnvKey: "VITE_DATABASE_URL"
});

// vite.config.ts
var config = defineConfig({
  server: {
    allowedHosts: [
      "https://doing-namespace-resist-mai.trycloudflare.com",
      // Your current ngrok host
      ".ngrok-free.app",
      // Wildcard to allow all future ngrok tunnels
      ".tunn.dev",
      // tunnelto
      ".trycloudflare.com"
      // cloudflared
    ]
  },
  plugins: [
    devtools(),
    netlify(),
    neon_vite_plugin_default,
    viteTsConfigPaths({
      projects: ["./tsconfig.json"]
    }),
    tanstackStart(),
    viteReact(),
    tailwindcss()
  ]
});
var vite_config_default = config;
export {
  vite_config_default as default
};
