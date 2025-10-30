import { message } from "antd";
import { globalMessageApi } from "@/components/GlobalMessage/GlobalMessage";
import i18n from "@/i18n";


// 🌍 环境自动识别 BASE_URL
const BASE_URL =
  import.meta.env.VITE_API_BASE ||
  "https://underanged-unequine-ignacia.ngrok-free.dev";

console.log("🌍 当前环境:", import.meta.env.MODE, "| BASE_URL:", BASE_URL);

// 🧩 获取安全 message 实例
function getMessageInstance() {
  if (globalMessageApi && typeof globalMessageApi.open === "function") {
    return globalMessageApi;
  }
  return message;
}

// 🌐 安全取国际化文本
function tSafe(key, fallback) {
  try {
    const res = i18n.t(key);
    return typeof res === "string" ? res : fallback;
  } catch {
    return fallback;
  }
}

/**
 * 🚀 主函数：统一请求封装 + Token 管理
 * @param {string} endpoint 接口路径（如 "/api/Login"）
 * @param {string} method HTTP 方法
 * @param {object} body 请求体（POST/PUT 时）
 * @param {object} options 可选项 { noAuth: true, customToken: "xxx" }
 */
export async function callApi(endpoint, method = "GET", body = null, options = {}) {
  const msg = getMessageInstance();
  const key = `api_${endpoint}`;
  const url = `${BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const token =
    options.customToken ||
    JSON.parse(localStorage.getItem("user") || "null")?.AccessToken;

  const headers = {
    "Content-Type": "application/json",
  };
  if (!options.noAuth && token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  console.log("🌐 [API 调用]:", { url, method, token, body });

  try {
    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    // 🚫 网络错误
    if (!res) {
      msg.open({
        key,
        type: "error",
        content: `❌ ${tSafe("msg.connect_error", "无法连接服务器")}`,
        duration: 3,
      });
      return { success: false, message: "No response" };
    }

    // 🚫 HTTP 非 200
    if (res.status !== 200) {
      const text = await res.text();
      console.error("❌ [HTTP错误]", res.status, text);

      // 401 → Token 失效处理
      if (res.status === 401) {
        msg.open({
          key,
          type: "warning",
          content: "⚠️ 登录已过期，请重新登录",
          duration: 3,
        });
        localStorage.removeItem("auth_token");
        sessionStorage.removeItem("auth_token");
        // setTimeout(() => {
        //   window.location.href = "/";
        // }, 1000);
      }

      msg.open({
        key,
        type: "error",
        content: `HTTP ${res.status}：${res.statusText || tSafe("msg.connect_error", "无法连接服务器")}`,
        duration: 3,
      });

      return {
        success: false,
        code: res.status,
        message: res.statusText || "Network Error",
      };
    }

    // ✅ SePay 特殊处理
    if (endpoint.toLowerCase().includes("/sepay/")) {
      const text = await res.text();
      if (text.trim().startsWith("<form")) return text;
      try {
        const data = JSON.parse(text);
        return { success: true, data };
      } catch {
        console.warn("⚠️ [SePay 返回既不是 JSON 也不是 form]:", text);
        return { success: false, message: "Invalid SePay response" };
      }
    }

    // ✅ 普通接口按 JSON 解析
    let data;
    try {
      data = await res.json();
    } catch (err) {
      console.error("⚠️ [JSON解析失败]:", err);
      msg.open({
        key,
        type: "error",
        content: tSafe("msg.invalid_json", "服务器返回数据格式错误"),
        duration: 3,
      });
      return { success: false, message: "Invalid JSON" };
    }

    console.log("✅ [API 响应数据]:", data);

    // 🚦 业务错误处理
    if (data?.success === false || data?.code >= 400 || data?.error) {
      const errMsg = data.message || data.msg || tSafe("msg.server_error", "服务器返回错误");
      msg.open({
        key,
        type: "error",
        content: errMsg,
        duration: 3,
      });

      // 如果后端返回 token 过期
      if (String(errMsg).includes("token") && String(errMsg).includes("过期")) {
        localStorage.removeItem("auth_token");
        sessionStorage.removeItem("auth_token");
        // setTimeout(() => (window.location.href = "/"), 800);
      }

      return { success: false, message: errMsg, data };
    }

    // ✅ 请求成功
    return { success: true, data };
  } catch (err) {
    console.error("💥 [API 调用异常]:", err);
    const isNetwork =
      err.message.includes("Failed to fetch") ||
      err.message.includes("ERR_CONNECTION_REFUSED") ||
      err.message.includes("NetworkError");

    msg.open({
      key,
      type: "error",
      content: isNetwork
        ? `❌ ${tSafe("msg.connect_error", "无法连接服务器，请检查后端服务或网络")}`
        : err.message || tSafe("msg.server_error", "服务器错误"),
      duration: 3,
    });

    return { success: false, message: err.message || "Network Error" };
  }
}
