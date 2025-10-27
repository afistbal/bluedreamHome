import React, { useEffect, useState } from "react";
import { Button, Modal, Spin, message } from "antd";
import { callApi } from "@/utils/api";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function PaymentProcess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [reason, setReason] = useState("");
  const [subFormSubmit, setSubFormSubmit] = useState(null);

  useEffect(() => {
    const createOrder = async () => {
      try {
        const payload = {
          uuid: params.get("uuid"),
          gameID: Number(params.get("gameID")),
          serverID: Number(params.get("serverID")),
          methodID: Number(params.get("methodID")),
          productIDs: JSON.parse(params.get("productIDs") || "[]"),
          quantities: JSON.parse(params.get("quantities") || "[]"),
        };

        const res = await callApi("/api/Sepay/MulPurchase", "POST", payload);

        // ✅ 检查返回是否包含表单
        if (typeof res === "string" && res.includes("<form")) {
          const wrapper = document.createElement("div");
          wrapper.innerHTML = res;
          const form = wrapper.querySelector("form");

          if (!form) throw new Error("Form not found in response");

          // ✅ 提取 <input name="order_invoice_number"> 的值
          const input = form.querySelector(
            'input[name="order_invoice_number"]'
          );
          const invoiceNumber = input?.value || null;

          if (invoiceNumber) {
            const gameID = Number(params.get("gameID"));
            // 读取现有映射，不破坏其他 localStorage 数据
            const orderMap = JSON.parse(
              localStorage.getItem("orderGameMap") || "{}"
            );
            orderMap[invoiceNumber] = gameID;
            localStorage.setItem("orderGameMap", JSON.stringify(orderMap));

            console.log("💾 Saved mapping:", invoiceNumber, "→", gameID);
          } else {
            console.warn("⚠️ No order_invoice_number found in form");
          }

          // ✅ 插入 DOM & 准备提交
          document.body.appendChild(form);
          setSubFormSubmit(form);
          form.submit(); // 可以自动提交，也可以保留按钮控制
          return;
        }

        throw new Error("Invalid form response from server");
      } catch (err) {
        console.error("💥 Error creating order:", err);
        message.error(t("payments.create_failed"));
        setReason(err.message || "Server error");
        setVisible(true);
        setLoading(false);
      }
    };

    createOrder();
  }, [params, t]);

  // ✅ 倒计时逻辑
  useEffect(() => {
    if (!visible) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setVisible(false);
          const gameId = params.get("gameID");
          navigate(`/payment/${gameId}`);
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [visible, navigate]);

  return (
    <>
      {/* ✅ 全屏加载遮罩 */}
      {loading && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(255,255,255,0.9)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
        >
          <Spin size="large" />
          <p style={{ marginTop: 16, fontSize: 15, color: "#555" }}>
            {t("payments.initializing")}
          </p>
        </div>
      )}

      {/* ❌ 接口失败弹窗 */}
      <Modal
        open={visible}
        footer={null}
        closable={false}
        centered
        maskClosable={false}
      >
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ fontSize: 40, color: "#ef4444" }}>❌</div>
          <h3 style={{ color: "#ef4444", marginTop: 12 }}>
            {t("payments.failed")}
          </h3>
          <p style={{ color: "#666", margin: "8px 0" }}>{reason}</p>
          <p style={{ color: "#888", fontSize: 14, marginTop: 8 }}>
            {t("payments.redirecting", { sec: countdown })}
          </p>
        </div>
      </Modal>
    </>
  );
}
