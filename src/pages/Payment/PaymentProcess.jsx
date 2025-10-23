import React, { useEffect, useState } from "react";
import { Spin, Result, Button, message } from "antd";
import { callApi } from "@/utils/api";
import { useSearchParams } from "react-router-dom";

export default function PaymentProcess() {
  const [params] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("creating");
  const [formHtml, setFormHtml] = useState("");

  useEffect(() => {
    const createOrder = async () => {
      try {
        setLoading(true);
        setStatus("creating");

        const payload = {
          uuid: params.get("uuid"),
          gameID: Number(params.get("gameID")),
          serverID: Number(params.get("serverID")),
          methodID: Number(params.get("methodID")),
          productIDs: JSON.parse(params.get("productIDs") || "[]"),
          quantities: JSON.parse(params.get("quantities") || "[]"),
        };

        // 🚀 请求后端创建订单
        const res = await callApi("/api/Sepay/MulPurchase", "POST", payload);

        if (typeof res === "string" && res.includes("<form")) {
          // ✅ 返回 HTML form
          console.log('form11111--------------', res);
          debugger
          setFormHtml(res);
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
  }, []);

  const handleSubmit = () => {
    try {
      if (!formHtml) return message.warning("Không có form hợp lệ!");

      const wrapper = document.createElement("div");
      wrapper.innerHTML = formHtml;
      const form = wrapper.querySelector("form");

      if (form) {
        document.body.appendChild(form);
        console.log('form--------------', form);
        debugger
        form.submit(); // ✅ 手动提交跳转 SePay
      } else {
        message.error("Không tìm thấy form hợp lệ!");
      }
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi gửi form!");
    }
  };

  // 🌀 加载中状态
  if (loading || status === "creating") {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: 100,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spin size="large" />
        <p style={{ marginTop: 16 }}>Đang khởi tạo thanh toán...</p>
      </div>
    );
  }

  // ❌ 失败状态
  if (status === "failed") {
    return (
      <Result
        status="error"
        title="Thanh toán thất bại!"
        subTitle="Không thể khởi tạo đơn hàng hoặc phản hồi không hợp lệ."
      />
    );
  }

  // ✅ 成功状态：展示 form，用户点击提交
  if (status === "ready") {
    return (
      <div
        style={{
          maxWidth: 600,
          margin: "40px auto",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <h2>Đơn hàng đã được tạo thành công!</h2>
        <p style={{ marginBottom: 16 }}>
          Kiểm tra nội dung thanh toán bên dưới, sau đó nhấn nút để mở SePay.
        </p>

        <div
          style={{
            background: "#fafafa",
            padding: 16,
            borderRadius: 8,
            border: "1px solid #eee",
            textAlign: "left",
            overflowX: "auto",
          }}
        >
          <div
            dangerouslySetInnerHTML={{ __html: formHtml }}
            style={{ fontSize: 13, color: "#555" }}
          />
        </div>

        <Button
          type="primary"
          size="large"
          onClick={handleSubmit}
          style={{
            marginTop: 24,
            width: "80%",
            maxWidth: 300,
          }}
        >
          💳 Thanh toán ngay
        </Button>

        <p style={{ marginTop: 12, color: "#888", fontSize: 13 }}>
          Hỗ trợ tốt trên Web & H5 (Mobile)
        </p>
      </div>
    );
  }

  return null;
}
