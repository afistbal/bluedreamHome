// vite.config.js
import fs from "fs";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: "./",
    plugins: [
      react(),
      visualizer({
        open: false,
        gzipSize: true,
        brotliSize: true,
      }),
    ],

    build: {
      outDir: "dist",
      sourcemap: false,
      minify: "terser",
      terserOptions: {
        compress: { drop_console: true, drop_debugger: true },
        format: { comments: false },
      },
      rollupOptions: {
        output: {
          entryFileNames: "assets/[name]-[hash].js",
          chunkFileNames: "assets/[name]-[hash].js",
          assetFileNames: "assets/[name]-[hash][extname]",
        },
      },
    },

    server: {
      host: "0.0.0.0",
      port: 5173,
      https: false,
      cors: true,
      strictPort: true,
      // https: {
      //   key: fs.readFileSync(path.resolve(__dirname, "localhost+2-key.pem")),
      //   cert: fs.readFileSync(path.resolve(__dirname, "localhost+2.pem")),
      // },
      // historyApiFallback: true, // ✅ 所有未知路由都回到 index.html

      // ✅ 允许直接访问 ngrok 域名
      allowedHosts: [
        "localhost",
        "127.0.0.1",
        "192.168.8.254",
        "noncultivatable-nonhedonistically-eleanore.ngrok-free.dev",
        "underanged-unequine-ignacia.ngrok-free.dev",
      ],

      // ❌ 删除 proxy，全部直连远程
    },

    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  };
});
