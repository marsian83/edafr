import { defineConfig } from "vite";
import devServer from "@hono/vite-dev-server";
import bunAdapter from "@hono/vite-dev-server/bun";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const port = Bun.env["PORT"] ? Number(Bun.env["PORT"]) : 5173;
export default defineConfig({
  server: {
    port: port,
    hmr: {
      overlay: true,
      clientPort: port,
      protocol: "ws",
    },
    watch: {
      usePolling: true,
    },
  },
  build: {
    rollupOptions: {
      input: ["./template.html", "./app/main.tsx"],
      output: {
        entryFileNames: "static/client.js",
        chunkFileNames: "static/assets/[name]-[hash].js",
        assetFileNames: "static/assets/[name].[ext]",
      },
    },
    emptyOutDir: false,
    copyPublicDir: true,
  },
  publicDir: "public",
  plugins: [
    tailwindcss(),
    devServer({
      entry: "server.ts",
      adapter: bunAdapter(),
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./app"),
    },
  },
});