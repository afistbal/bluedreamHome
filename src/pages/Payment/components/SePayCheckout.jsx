import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Spin, Alert, Button, Result, message } from "antd";
import { callApi } from "@/utils/api";
import "../styles/SePayCheckout.css";

export default function SePayCheckout() {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("waiting");

  // ✅ 优先用上页传来的 state 数据
  useEffect(() => {
    const stateOrder = location.state?.orderData;
    if (stateOrder) {
      setOrder(stateOrder);
      setLoading(false);
      localStorage.setItem("lastOrder", JSON.stringify(stateOrder));
    } else {
      // 尝试从本地恢复
      const saved = localStorage.getItem("lastOrder");
      if (saved) {
        setOrder(JSON.parse(saved));
        setLoading(false);
      } else {
        fetchOrder();
      }
    }
  }, [location.state]);

  // ✅ 从后端重新拉取订单详情
  const fetchOrder = async () => {
    try {
      const res = await callApi(`/api/Sepay/OrderInfo?id=${orderId}`, "GET");
      if (res && res.success) {
        setOrder(res.data);
        localStorage.setItem("lastOrder", JSON.stringify(res.data));
      } else {
        message.warning("Không tìm thấy thông tin đơn hàng");
      }
    } catch (err) {
      console.error("Lỗi khi tải thông tin đơn hàng:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ 轮询支付状态
  useEffect(() => {
    if (!orderId) return;
    const timer = setInterval(async () => {
      const res = await callApi(`/api/Sepay/CheckStatus?id=${orderId}`, "GET");
      if (res?.status === "Paid") {
        setStatus("success");
        clearInterval(timer);
        localStorage.removeItem("lastOrder");
      }
    }, 4000);
    return () => clearInterval(timer);
  }, [orderId]);

  if (loading)
    return (
      <div className="sepay-loading">
        <Spin size="large" tip="Đang tải thông tin đơn hàng..." />
      </div>
    );

  if (status === "success")
    return (
      <Result
        status="success"
        title="Thanh toán thành công!"
        subTitle={`Đơn hàng #${orderId} đã được xác nhận`}
        extra={[
          <Button type="primary" key="home" onClick={() => navigate("/")}>
            Quay lại trang chủ
          </Button>,
        ]}
      />
    );

  // ✅ 生成 QR 链接
  const qrUrl = order
    ? `https://qr.sepay.vn/img?bank=${order.bank_code || "MBBank"}&acc=${
        order.acc_number
      }&template=compact&amount=${order.amount}&des=DH${orderId}`
    : null;

  return (
    <div className="sepay-checkout-page">
      <h2>Thanh toán đơn hàng</h2>
      <p>
        Mã đơn hàng: <b>#{orderId}</b>
      </p>

      <div className="qr-section">
        <h3>1️⃣ Quét mã QR để thanh toán</h3>
        {qrUrl ? (
          <img src={qrUrl} alt="SePay QR" className="qr-image" />
        ) : (
          <p>Không thể tạo mã QR</p>
        )}
        <p className="note">Trạng thái: Chờ thanh toán...</p>
      </div>

      <div className="manual-section">
        <h3>2️⃣ Thông tin chuyển khoản thủ công</h3>
        <p>
          <b>Ngân hàng:</b> {order?.bank_name || "MB Bank"}
        </p>
        <p>
          <b>Chủ tài khoản:</b> {order?.acc_name || "—"}
        </p>
        <p>
          <b>Số tài khoản:</b> {order?.acc_number || "—"}
        </p>
        <p>
          <b>Số tiền:</b>{" "}
          {order?.amount
            ? parseInt(order.amount).toLocaleString("vi-VN") + " ₫"
            : "—"}
        </p>
        <p>
          <b>Nội dung CK:</b> DH{orderId}
        </p>

        <Alert
          message="⚠️ Vui lòng giữ nguyên nội dung chuyển khoản để hệ thống tự động xác nhận thanh toán."
          type="info"
          showIcon
        />
      </div>

      <div className="sepay-footer">
        <Button onClick={() => navigate(-1)}>⬅ Quay lại</Button>
      </div>
    </div>
  );
}
