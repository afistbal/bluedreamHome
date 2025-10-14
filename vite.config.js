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
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
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
      cors: true,
      open: true,
      strictPort: true,
      proxy: {
        "/api": {
          target: "http://192.168.8.254:5022", // ✅ 你的后端服务
          changeOrigin: true,
          // ❌ 如果后端路径本身包含 /api，不要 rewrite
          // ✅ 如果不含 /api，请取消注释下一行
          // rewrite: (path) => path.replace(/^\/api/, ""),
          secure: false,
        },
      },
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  };
});
