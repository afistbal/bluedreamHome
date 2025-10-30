# 🌐 Blue-Home 前端项目文档 | Tài liệu Frontend - Blue-Home

## 🧩 项目概述 | Tổng quan dự án

本项目为 **海外官网（Blue-Home）** 的前端部分，使用 **React + Vite + Ant Design (antd)** 构建。  
支持多语言（i18n），并内置 **登录授权（Google / Facebook / Apple）**、**支付流程（SePay）**、**动态环境配置** 等功能。

Dự án này là phần **frontend của trang web Blue-Home**, được xây dựng bằng **React + Vite + Ant Design (antd)**.  
Hỗ trợ đa ngôn ngữ (i18n) và tích hợp **đăng nhập (Google / Facebook / Apple)**, **thanh toán (SePay)**, cùng cấu hình môi trường động.

---

## 📁 目录结构 | Cấu trúc thư mục

```
blue-home/
├── dist/                         # 构建输出目录 | Thư mục build đầu ra
├── public/                       # 公共资源 | Tài nguyên tĩnh
│   └── logo-icon.jpg
├── src/
│   ├── assets/                   # 静态资源（图片、字体等）| Ảnh, font, media
│   ├── components/               # 公共组件 | Thành phần dùng chung
│   │   └── GlobalMessage/
│   │   └── LoginModal/
│   ├── pages/                    # 页面模块 | Trang giao diện
│   │   ├── Callback/             # 登录回调页 | Trang callback đăng nhập
│   │   ├── Home/                 # 官网首页 | Trang chủ
│   │   ├── Payment/              # 支付模块 | Thanh toán
│   ├── services/                 # 接口服务层 | Dịch vụ API
│   │   └── loginService.js
│   ├── utils/                    # 工具函数 | Tiện ích
│   │   └── api.js
│   ├── App.jsx                   # 应用主入口 | Entry chính của app
│   ├── main.jsx                  # 挂载 React 应用 | Mount ứng dụng React
│   ├── i18n.js                   # 多语言配置 | Cấu hình i18n
│   └── index.css                 # 全局样式 | CSS tổng thể
├── index.html                    # 入口 HTML 模板 | File HTML chính
├── vite.config.js                # Vite 配置 | Cấu hình Vite
├── package.json                  # 项目依赖 | Cấu hình npm
├── .env.development              # 开发环境变量 | Biến môi trường dev
├── .env.production               # 生产环境变量 | Biến môi trường production
└── README_frontend.md            # 当前文档 | Tài liệu này
```

---

## ⚙️ 核心依赖 | Thư viện chính

| 名称 | 版本 | 用途 | Giải thích |
|------|------|------|-------------|
| `react` | ^19.1.1 | 前端框架 | Thư viện React |
| `vite` | ^7.1.7 | 构建工具 | Công cụ build siêu nhanh |
| `antd` | ^5.27.4 | UI 组件库 | Bộ giao diện Ant Design |
| `react-router-dom` | ^7.9.3 | 路由控制 | Điều hướng trang |
| `i18next` / `react-i18next` | ^25.6.0 | 多语言支持 | Đa ngôn ngữ |
| `axios` | ^1.12.2 | HTTP 请求库 | Gửi yêu cầu HTTP |
| `framer-motion` | ^12.23.24 | 动画 | Hiệu ứng animation |
| `vite-plugin-mkcert` | ^1.17.9 | 本地 HTTPS 证书 | Tạo chứng chỉ HTTPS nội bộ |

---

## 🧠 项目说明 | Giải thích dự án

### 1️⃣ App.jsx（主应用入口）

- 集成路由：`react-router-dom`  
- 控制 Layout 显隐（如 `/auth/callback` 隐藏导航栏和页脚）  
- 管理全局登录弹窗状态  
- 注册 `window.openLoginModal()` 全局方法供页面调用  

→ Chứa các route chính, kiểm soát ẩn/hiện layout và modal đăng nhập.

**主要路由 | Các route chính：**

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | Home | 官网首页 |
| `/payment/:id` | Payment | 支付详情页 |
| `/auth/:provider/callback` | Callback | 登录授权回调页 |
| `/payment/process` | PaymentProcess | 支付创建页 |
| `/payment/order/success/:orderId` | PayResult | 成功页 |
| `/payment/order/cancel/:orderId` | PayResult | 取消页 |

---

### 2️⃣ utils/api.js（接口封装）

- 自动识别环境变量：`VITE_API_BASE`  
- 统一异常处理（401 Token 失效、网络错误、JSON解析失败）  
- 支持 SePay 特殊返回（HTML Form）  
- 内置多语言提示  

Ví dụ:

```js
const BASE_URL =
  import.meta.env.VITE_API_BASE || "https://underanged-unequine-ignacia.ngrok-free.dev";

export async function callApi(endpoint, method = "GET", body = null, options = {}) {
  const token = localStorage.getItem("auth_token");
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  // ...
}
```

✅ 支持：`GET`, `POST`, `PUT`, `DELETE`  
✅ 处理登录过期自动清除 Token  
✅ 与 antd 全局 `message` 组件联动提示  

---

### 3️⃣ vite.config.js（构建配置）

- 使用 `loadEnv` 自动加载 `.env.development` / `.env.production`  
- 打包分析：`rollup-plugin-visualizer` → 输出 `stats.html`  
- 代码分块优化：`react`、`antd`、`vendor` 模块独立打包  
- 自动跨域（`cors: true`）  
- 支持多 Host（本地 / ngrok / 内网）  

```js
server: {
  host: "0.0.0.0",
  port: 5173,
  https: false,
  cors: true,
  historyApiFallback: true,
  allowedHosts: [
    "localhost",
    "192.168.8.254",
    "underanged-unequine-ignacia.ngrok-free.dev",
    "api.bluegame.vn"
  ]
}
```

---

## 🌍 环境变量 | Biến môi trường

| 文件 | 用途 | Ví dụ |
|------|------|--------|
| `.env.development` | 本地开发 | `VITE_API_BASE=http://localhost:5022` |
| `.env.production` | 线上环境 | `VITE_API_BASE=https://api.bluegame.vn` |

在代码中通过 `import.meta.env.VITE_API_BASE` 调用。  
→ Sử dụng `import.meta.env.VITE_API_BASE` để gọi trong code.

---

## 🚀 启动与构建 | Chạy và build dự án

### 1️⃣ 安装依赖 | Cài đặt thư viện
```bash
npm install
```

### 2️⃣ 本地开发启动 | Chạy dev
```bash
npm run dev
```
访问: <http://localhost:5173>

### 3️⃣ 构建生产包 | Build production
```bash
npm run build
```
打包文件输出至 `/dist` 目录。

### 4️⃣ 预览构建结果 | Xem bản build
```bash
npm run preview
```

---

## 🔑 登录模块 | Đăng nhập

支持多种方式：  
✅ Google 登录（`@react-oauth/google`）  
✅ Facebook 登录  
✅ Apple 登录（通过 `AppleID.auth`）  
✅ 自定义 BD 登录（BlueDream ID）

授权成功后返回 token，存储于 `localStorage`。

---

## 💳 支付模块 | Thanh toán (SePay)

- 支持调用 `/api/Sepay/CreateOrder` 接口  
- 自动识别返回类型（HTML Form 或 JSON）  
- 包含流程：  
  1. 选择支付方式  
  2. 跳转支付  
  3. 成功/失败回调 (`PayResult.jsx`)

---

## 🌐 国际化 (i18n)

- 默认支持：`zh`（中文）和 `vi`（越南语）  
- 可在 `/src/i18n.js` 中扩展语言包  
- 页面组件通过 `useTranslation()` 调用  

```js
import { useTranslation } from "react-i18next";
const { t } = useTranslation();
<p>{t("home.title")}</p>;
```

---

## 🧩 常见命令 | Lệnh thường dùng

| 命令 | 说明 | Giải thích |
|------|------|------------|
| `npm run dev` | 启动开发服务器 | Chạy server dev |
| `npm run build` | 打包生产代码 | Build bản chính thức |
| `npm run preview` | 本地预览构建结果 | Xem trước bản build |
| `npm run lint` | 执行 ESLint 检查 | Kiểm tra code ESLint |

---

## 🛠️ 推荐开发环境 | Môi trường phát triển đề xuất

| 工具 | 版本建议 |
|------|-----------|
| Node.js | ≥ 18.x |
| npm | ≥ 9.x |
| VS Code 插件 | ESLint, Prettier, i18n Ally, React Developer Tools |

---

## 🧾 作者与维护 | Tác giả & Bảo trì

**BlueDream Frontend Team**  
负责海外官网（War2 / Pirate / 时空）前端项目开发与维护。  

---

_最后更新 / Cập nhật lần cuối_: **2025-10-30**
