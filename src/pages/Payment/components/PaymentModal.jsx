import React, { useEffect, useState } from "react";
import { Modal, Spin, Result, Button, message } from "antd";
import { callApi } from "@/utils/api";
import "../styles/PaymentModal.css";

export default function PaymentModal({
  visible,
  onClose,
  selected = [],
  totalVnd = 0,
}) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | creating | ready | failed
  const [formHtml, setFormHtml] = useState("");

  useEffect(() => {
    if (!visible) return;

    const createOrder = async () => {
      try {
        setLoading(true);
        setStatus("creating");

        const res = await callApi("/api/Sepay/MulPurchase", "POST", {
          uuid: "tk1",
          gameID: 2,
          serverID: 1,
          productIDs: ["earth_diamond_1"],
          quantities: [1],
          methodID: 0,
        });

        // ✅ 返回 HTML form（SePay 官方模式）
        if (typeof res === "string" && res.includes("<form")) {
          setFormHtml(res);
          setStatus("ready");
        }
        // ✅ 返回 JSON redirect
        else if (res?.data?.redirect_url) {
          window.open(res.data.redirect_url, "_blank");
          setStatus("ready");
        } else {
          message.error("Máy chủ không trả về form hợp lệ!");
          setStatus("failed");
        }
      } catch (err) {
        console.error("💥 Error creating order:", err);
        message.error("Không thể khởi tạo đơn hàng!");
        setStatus("failed");
      } finally {
        setLoading(false);
      }
    };

    createOrder();
  }, [visible]);

  const handleClose = () => {
    setFormHtml("");
    setStatus("idle");
    onClose?.();
  };

  const handleSubmit = () => {
    try {
      if (!formHtml) return message.warning("Không có form hợp lệ!");
      const wrapper = document.createElement("div");
      wrapper.innerHTML = formHtml;
      const form = wrapper.querySelector("form");
      if (form) {
        document.body.appendChild(form);
        form.submit(); // ✅ 真正跳转
      } else {
        message.error("Không tìm thấy form hợp lệ để submit!");
      }
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi gửi form!");
    }
  };

  const renderContent = () => {
    if (loading || status === "creating")
      return (
        <div className="loading-box">
          <Spin size="large" />
          <p>Đang tạo đơn hàng...</p>
        </div>
      );

    if (status === "failed")
      return (
        <Result
          status="error"
          title="Thanh toán thất bại!"
          subTitle="Không thể khởi tạo đơn hàng hoặc nhận phản hồi không hợp lệ."
          extra={[<Button onClick={handleClose}>Đóng</Button>]}
        />
      );

    if (status === "ready" && formHtml)
      return (
        <div className="form-preview">
          <p style={{ marginBottom: 12, fontWeight: 600 }}>
            ✅ Đơn hàng đã được tạo thành công!
          </p>
          <p style={{ marginBottom: 16 }}>
            Bạn có thể xem nội dung form bên dưới hoặc nhấn “Thanh toán ngay”
            để mở cổng SePay.
          </p>

          {/* ⚠️ 展示返回的 form HTML */}
          <div
            dangerouslySetInnerHTML={{ __html: formHtml }}
            style={{
              padding: 12,
              border: "1px solid #eee",
              borderRadius: 6,
              background: "#fafafa",
              marginBottom: 20,
              maxHeight: 250,
              overflow: "auto",
            }}
          />

          <div style={{ textAlign: "center" }}>
            <Button type="primary" onClick={handleSubmit}>
              👉 Thanh toán ngay
            </Button>
          </div>
        </div>
      );

    return (
      <Result
        status="info"
        title="Đang tạo đơn hàng..."
        subTitle="Vui lòng chờ trong giây lát."
      />
    );
  };

  return (
    <Modal
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={650}
      centered
      title="Thanh toán đơn hàng"
      destroyOnClose
    >
      {renderContent()}
    </Modal>
  );
}
