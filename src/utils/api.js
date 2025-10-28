// src/utils/api.js
import { message } from "antd";
import { globalMessageApi } from "@/components/GlobalMessage/GlobalMessage";
import i18n from "@/i18n";

/**
 * 🌐 API 封装：支持国际化 + 全局 message 提示 + SePay 特殊处理
 * 自动从 .env 文件加载 BASE_URL
 */
const BASE_URL =
  import.meta.env.VITE_API_BASE ||
  "https://underanged-unequine-ignacia.ngrok-free.dev";

console.log("🌍 当前环境:", import.meta.env.MODE, "| BASE_URL:", BASE_URL);

/**
 * 🧩 获取安全 message 实例（确保在 GlobalMessage 未挂载时也能提示）
 */
function getMessageInstance() {
  if (globalMessageApi && typeof globalMessageApi.open === "function") {
    return globalMessageApi;
  }
  return message; // fallback：antd 全局 message
}

/**
 * 🌍 国际化安全取值
 */
function tSafe(key, fallback) {
  try {
    const res = i18n.t(key);
    return typeof res === "string" ? res : fallback;
  } catch {
    return fallback;
  }
}

/**
 * 🚀 主函数：统一请求封装
 */
export async function callApi(endpoint, method = "GET", body = null) {
  const msg = getMessageInstance();
  const key = `api_${endpoint}`;

  const url = `${BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  console.log("🌐 [API 调用]:", { url, method, body });

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });

    // 🚫 网络层异常
    if (!res) {
      msg.open({
        key,
        type: "error",
        content: `❌ ${tSafe("msg.connect_error", "无法连接服务器")}`,
        duration: 3,
      });
      return { success: false, message: "No response" };
    }

    // 🚫 非200状态
    if (res.status !== 200) {
      const text = await res.text();
      console.error("❌ [HTTP错误]", res.status, text);
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

    // 🚦 业务层错误
    if (data?.success === false || data?.code >= 400 || data?.error) {
      const errMsg = data.message || data.msg || tSafe("msg.server_error", "服务器返回错误");
      msg.open({
        key,
        type: "error",
        content: errMsg,
        duration: 3,
      });
      return { success: false, message: errMsg, data };
    }

    // ✅ 成功
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
