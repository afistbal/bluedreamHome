// src/services/loginService.js
import { message } from "antd";

let googleInitialized = false;
let googleLoginInProgress = false;

// -----------------------------
// ✅ Google 登录
// -----------------------------

const GOOGLE_CLIENT_ID =
  "988240540369-g3g3pcfh6rhrirt1im9s0043tpdnqaj4.apps.googleusercontent.com";

// 🧩 根据环境自动选择 Redirect URI
const GOOGLE_REDIRECT_URI = (() => {
  const origin = window.location.origin;
  // ✅ 本地开发（vite 默认端口）
  if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
    return "http://192.168.8.254:5022/auth/gg/callback";
  }
  // ✅ ngrok 测试环境
  if (origin.includes("ngrok-free.dev")) {
    return `${origin}/auth/gg/callback`;
  }
  // ✅ 生产环境（正式域名）
  if (origin.includes("yourdomain.com")) {
    return "https://yourdomain.com/auth/gg/callback";
  }
  // ✅ 默认
  return `${origin}/auth/gg/callback`;
})();

console.log("🔗 当前 Google Redirect URI:", GOOGLE_REDIRECT_URI);

export const loginWithGoogle = () => {
  return new Promise((resolve, reject) => {
    const isLocal =
      location.hostname === "localhost" ||
      location.hostname.startsWith("192.168.")

    // 🧩 模式 1: 本地/测试环境 → 整页跳转 OAuth 模式
    if (isLocal) {
      console.log("🌍 本地或测试环境：使用整页跳转模式");

      const currentUrl = window.location.href;
      const oauthUrl =
        "https://accounts.google.com/o/oauth2/v2/auth?" +
        "response_type=id_token token" + // ✅ 获取 id_token + access_token
        "&client_id=" + encodeURIComponent(GOOGLE_CLIENT_ID) +
        "&redirect_uri=" + encodeURIComponent(GOOGLE_REDIRECT_URI) +
        "&scope=" + encodeURIComponent("openid email profile") +
        "&nonce=" + encodeURIComponent(Math.random().toString(36).substring(2)) +
        "&state=" + encodeURIComponent(currentUrl) +
        "&prompt=" + encodeURIComponent("select_account consent");

      window.location.href = oauthUrl;
      return;
    }

    // 🧩 模式 2: 正式环境 → GSI 弹窗（FedCM）
    if (googleLoginInProgress) {
      console.warn("⏳ Google 登录正在进行中，忽略重复调用");
      return;
    }

    if (!window.google || !window.google.accounts?.id) {
      return reject("❌ Google SDK 尚未加载完成");
    }

    if (!googleInitialized) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (res) => {
          googleLoginInProgress = false;
          if (res.credential) {
            console.log("✅ Google 登录成功:", res);
            resolve({
              provider: "google",
              credential: res.credential,
            });
          } else {
            reject("❌ 未获取到 credential");
          }
        },
        ux_mode: "popup",
        auto_select: false,
        context: "signin",
        state_cookie_domain: window.location.hostname,
      });
      googleInitialized = true;
    }

    googleLoginInProgress = true;
    try {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
          googleLoginInProgress = false;
          console.warn("⚠️ 弹窗未显示（可能被 FedCM 禁用）", notification);
        } else if (notification.isSkippedMoment()) {
          googleLoginInProgress = false;
          console.warn("⚠️ 用户跳过登录", notification);
        }
      });
    } catch (err) {
      googleLoginInProgress = false;
      reject(err);
    }
  });
};

// -----------------------------
// ✅ Facebook 登录（纯 OAuth 跳转）
// -----------------------------

const isNgrok = window.location.origin.includes("ngrok-free.dev");
const isLocal =
  window.location.origin.includes("localhost") ||
  window.location.origin.includes("192.168.");
const isProd = !isLocal && !isNgrok;

const FACEBOOK_APP_ID = "1092599382863103";
const FACEBOOK_REDIRECT_URI = isNgrok
  ? "https://noncultivatable-nonhedonistically-eleanore.ngrok-free.dev/auth/fb/callback"
  : isProd
  ? "https://your-production-domain.com/auth/fb/callback"
  : "http://192.168.8.254:5022/auth/fb/callback";

export const loginWithFacebook = () => {
  const currentUrl = window.location.href;

  const oauthUrl =
    "https://www.facebook.com/v19.0/dialog/oauth?" +
    "client_id=" + encodeURIComponent(FACEBOOK_APP_ID) +
    "&redirect_uri=" + encodeURIComponent(FACEBOOK_REDIRECT_URI) +
    "&response_type=token" +
    "&scope=" + encodeURIComponent("public_profile") +
    "&state=" + encodeURIComponent(currentUrl);

  console.log("🌍 Facebook OAuth 跳转 →", oauthUrl);
  window.location.href = oauthUrl;
};

// -----------------------------
// ✅ Apple 登录（前端直接拿 token 并调用后端）
// -----------------------------

export const loginWithApple = async () => {
  if (!window.AppleID) {
    message.error("❌ Apple SDK chưa sẵn sàng");
    throw new Error("❌ Apple SDK chưa sẵn sàng");
  }

  // ✅ 初始化 Apple 登录
  window.AppleID.auth.init({
    clientId: "com.bd.bdpirate-webpay",
    scope: "name email",
    redirectURI: `${window.location.origin}/auth/apple/callback`,
    usePopup: true, // ✅ Popup 模式直接返回 token
  });

  try {
    // ✅ Apple 登录弹窗
    const res = await window.AppleID.auth.signIn();
    console.log("🍎 Apple 返回:", res);

    const token = res?.authorization?.id_token;

    if (!token) {
      message.error("❌ 未获取到 Apple token，请检查配置");
      throw new Error("Apple 登录返回空 token");
    }

    // ✅ 获取游戏信息
    const selectedGame = JSON.parse(localStorage.getItem("selectedGame") || "{}");
    const GameId = selectedGame?.game_id;

    const payload = { TokenId: token, GameId };
    return payload;
  } catch (err) {
    console.error("❌ Apple 登录异常:", err);
    message.error("Apple 登录失败！");
    throw err;
  }
};
