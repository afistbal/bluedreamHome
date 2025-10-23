import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { callApi } from "@/utils/api";
import { message, Spin } from "antd";

export default function Callback() {
  const { provider } = useParams(); // /auth/:provider/callback
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  // ✅ 通用安全提示函数
  const safeMessage = (fn, text, delay = 1500) => {
    setTimeout(() => fn(text), 100);
    setTimeout(() => setLoading(false), delay);
  };

  function clearAllCookies() {
    const cookies = document.cookie.split(";");

    for (let cookie of cookies) {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();

      // 让每个 cookie 立即过期
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    }

    console.log("✅ All cookies cleared (client-side)");
  }

  useEffect(() => {
    const runLoginFlow = async () => {
      try {
        const hash = location.hash.substring(1);
        const search = location.search.substring(1);
        const params = new URLSearchParams(hash || search);

        // ✅ 把所有参数打印成对象形式，方便调试
        const allParams = {};
        for (const [key, value] of params.entries()) {
          allParams[key] = value;
        }
        console.log("📦 OAuth 回调全部参数:", allParams);

        // ✅ 各种可能的 token 字段
        const accessToken = params.get("access_token");
        const idToken = params.get("id_token");
        const code = params.get("code");
        const state = decodeURIComponent(params.get("state") || "/");

        console.log("🌐 登录回调参数:", {
          provider,
          accessToken,
          idToken,
          code,
          state,
        });
        const providerMap = { gg: "google", fb: "facebook", apple: "apple" };
        const normProvider = providerMap[(provider || "").toLowerCase()];
        if (!normProvider) {
          safeMessage(message.error, "无法识别登录来源！");
          // navigate("/", { replace: true });
          return;
        }

        // const savedGame = localStorage.getItem("selectedGame");
        // if (!savedGame) {
        //   safeMessage(message.warning, "❌ 游戏选中已失效，请重新选择游戏！");
        //   // navigate("/", { replace: true });
        //   return;
        // }

        // const { game_id: GameId } = JSON.parse(savedGame);
        // if (!GameId) {
        //   safeMessage(message.warning, "❌ 游戏选中已失效，请重新选择游戏！");
        //   // navigate("/", { replace: true });
        //   return;
        // }

        document.cookie = null;

        const TokenId = idToken || accessToken || code;
        if (!TokenId) {
          safeMessage(message.error, "未检测到有效登录凭证！");
          // navigate("/", { replace: true });
          return;
        }

        // ✅ Google 登录
        if (normProvider === "google") {
          clearAllCookies();
          const payload = { TokenId, GameId: 2 };
          console.log("🚀 发起 Google 登录:", payload);

          const res = await callApi("/api/APILogin/GgLogin", "POST", payload);

          if (res && res.success !== false) {
            message.success("✅ 登录成功！");
            localStorage.setItem("user", JSON.stringify(res));
            // navigate(state || "/", { replace: true });
          } else {
            safeMessage(message.error, res.message || "登录失败，请重试！");
            // navigate("/", { replace: true });
          }
        } else if (normProvider === "facebook") {
          clearAllCookies();
          // ⚠️ Facebook 通常返回 access_token，如果你的后端要 long_lived_token，可以让后端用这个换取长效 token
          const payload = { TokenId: accessToken, GameId: 2 };
          console.log("🚀 发起 Facebook 登录:", payload);

          const res = await callApi("/api/APILogin/FbLogin", "POST", payload);

          if (res && res.success !== false) {
            message.success("✅ Facebook 登录成功！");
            localStorage.setItem("user", JSON.stringify(res));
          } else {
            safeMessage(message.error, res.message || "Facebook 登录失败，请重试！");
          }
        }
      } catch (err) {
        console.error("❌ 登录流程异常:", err);
        safeMessage(message.error, "登录流程异常，请重试！");
        // navigate("/", { replace: true });
      } finally {
        setTimeout(() => setLoading(false), 1200);
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
      <Spin spinning={loading} size="large" />
      <div style={{ marginTop: 12 }}>Đang xử lý đăng nhập... Vui lòng đợi.</div>
    </div>
  );
}
