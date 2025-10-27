// src/pages/Callback/Callback.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { callApi } from "@/utils/api";
import { message, Spin } from "antd";
import { useTranslation } from "react-i18next";

export default function Callback() {
  const { provider } = useParams(); // /auth/:provider/callback
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();

  // ✅ 通用安全提示函数
  const safeMessage = (type, text, delay = 1500) => {
    setTimeout(() => messageApi[type](text), 100);
    setTimeout(() => setLoading(false), delay);
  };

  // ✅ 清理 Cookie
  const clearAllCookies = () => {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    }
    console.log("✅ All cookies cleared (client-side)");
  };

  useEffect(() => {
    const runLoginFlow = async () => {
      try {
        const hash = location.hash.substring(1);
        const search = location.search.substring(1);
        const params = new URLSearchParams(hash || search);

        // ✅ 打印所有参数
        const allParams = {};
        for (const [key, value] of params.entries()) allParams[key] = value;
        console.log("📦 OAuth 回调全部参数:", allParams);

        const accessToken = params.get("access_token");
        const idToken = params.get("id_token");
        const code = params.get("code");
        const state = decodeURIComponent(params.get("state") || "/");

        const providerMap = { gg: "google", fb: "facebook", apple: "apple" };
        const normProvider = providerMap[(provider || "").toLowerCase()];
        if (!normProvider) {
          safeMessage("error", t("login.invalid_provider"));
          return;
        }

        const TokenId = idToken || accessToken || code;
        if (!TokenId) {
          safeMessage("error", t("login.no_token"));
          return;
        }

        clearAllCookies();

        // ✅ 构建请求体
        const savedGame = localStorage.getItem("selectedGame");
        const game = savedGame ? JSON.parse(savedGame) : null;
        const GameId = game?.game_id || 2; // fallback

        let apiUrl = "";
        if (normProvider === "google") apiUrl = "/api/APILogin/GgLogin";
        else if (normProvider === "facebook") apiUrl = "/api/APILogin/FbLogin";
        else if (normProvider === "apple") apiUrl = "/api/APILogin/ApLogin";

        const payload = { TokenId, GameId };
        console.log(`🚀 发起 ${normProvider} 登录:`, payload);

        const res = await callApi(apiUrl, "POST", payload);
        console.log("🌍 回调登录结果:", res);

        if (!res?.success || !res?.data?.PlayerId) {
          safeMessage("error", res?.message || t("login.login_fail"));
          return;
        }

        // ✅ 登录成功：保存信息
        localStorage.setItem("user", JSON.stringify(res.data));
        messageApi.success(t("login.login_success"));

        // ✅ 跳转 & 结束
        setTimeout(() => {
          setLoading(false);
          navigate(state || "/", { replace: true });
        }, 1200);
      } catch (err) {
        console.error("❌ 登录流程异常:", err);
        safeMessage("error", t("login.exception"));
      } finally {
        setTimeout(() => setLoading(false), 1500);
      }
    };

    runLoginFlow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider, location]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        color: "#666",
        fontSize: 16,
      }}
    >
      {contextHolder}
      <Spin spinning={loading} size="large" />
      <div style={{ marginTop: 12 }}>
        {t("login.processing")}
      </div>
    </div>
  );
}
