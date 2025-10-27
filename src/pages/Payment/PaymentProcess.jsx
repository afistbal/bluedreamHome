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
  const [subGormSubmit, setSubGormSubmit] = useState(null);
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

        if (typeof res === "string" && res.includes("<form")) {
          const wrapper = document.createElement("div");
          wrapper.innerHTML = res;
          const form = wrapper.querySelector("form");

          if (form) {
            // ✅ 解析出订单号（例如 INV_SEPAY_1761560442）
            const invoiceMatch = res.match(/INV_SEPAY_\d+/);
            const invoiceNumber = invoiceMatch ? invoiceMatch[0] : null;

            // ✅ 写入 localStorage map，不影响其他字段
            if (invoiceNumber) {
              const gameID = Number(params.get("gameID"));
              const orderMap = JSON.parse(
                localStorage.getItem("orderGameMap") || "{}"
              );
              orderMap[invoiceNumber] = gameID;
              localStorage.setItem("orderGameMap", JSON.stringify(orderMap));
            }

            // ✅ 提交表单
            document.body.appendChild(form);
            setSubGormSubmit(form);
            // form.submit();
            return;
          }
          throw new Error("Form not found");
        }
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
          navigate(`/payment/${gameId}`); // ✅ 正确回跳路径
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [visible, navigate]);

  return (
    <>
      {/* ✅ 全屏遮罩层 */}
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
          <Button
            onClick={() => {
              console.log(subGormSubmit);
              debugger;
              subGormSubmit.submit();
            }}
          >
            click me
          </Button>
        </div>
      )}

      {/* ❌ 接口失败时提示 */}
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
