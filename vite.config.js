// vite.config.js
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig(({ mode }) => {
  // 🔹 加载环境变量（会自动读取 .env.development 或 .env.production）
  const env = loadEnv(mode, process.cwd(), "");
  const isProd = mode === "production";

  console.log("===============================================");
  console.log(`🚀 当前构建模式: ${isProd ? "生产环境" : "开发环境"}`);
  console.log(`🌐 API 地址: ${env.VITE_API_BASE || "(未设置 VITE_API_BASE)"}`);
  console.log("===============================================");

  return {
    base: "/",
    plugins: [
      react(),
      // 📊 构建体积分析（输出 stats.html）
      visualizer({
        filename: "stats.html",
        gzipSize: true,
        brotliSize: true,
        open: false,
      }),
    ],

    build: {
      outDir: "dist",
      sourcemap: !isProd, // 生产关闭 map，加快构建
      minify: "terser", // 使用 terser 压缩
      chunkSizeWarningLimit: 1500, // 提高体积警告阈值
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
          manualChunks: {
            react: ["react", "react-dom", "react-router-dom"],
            antd: ["antd", "@ant-design/icons"],
            vendor: ["i18next", "react-i18next", "framer-motion"],
          },
        },
      },
    },

    server: {
      host: "0.0.0.0",
      port: 5173,
      https: false, // ❌ 不启用 https
      cors: true,
      strictPort: true,
      allowedHosts: [
        "localhost",
        "127.0.0.1",
        "192.168.8.254",
        "underanged-unequine-ignacia.ngrok-free.dev",
        "noncultivatable-nonhedonistically-eleanore.ngrok-free.dev",
        "api.bluegame.vn",
      ],
      // ✅ 让 history 模式路由在刷新时也能回到 index.html
      historyApiFallback: true,
    },

    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  };
});
