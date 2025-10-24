import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Spin, message } from "antd";
import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import styles from "./PayCallback.module.css";
import { callApi } from "@/utils/api";

export default function PayCallback({ success = true }) {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);

  const fetchOrder = async () => {
    try {
      const res = await callApi(`/api/Sepay/OrderInfo?id=${orderId}`, "GET");
      console.log("🔍 OrderInfo response:", res);

      if (res && res.success) {
        setOrder(res.data);
        localStorage.setItem("lastOrder", JSON.stringify(res.data));
      } else {
        message.warning("Không tìm thấy thông tin đơn hàng");
      }
    } catch (err) {
      console.error("❌ Lỗi khi tải thông tin đơn hàng:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) fetchOrder();
  }, [orderId]);

  const handleBack = () => {
    const cachedOrder = JSON.parse(localStorage.getItem("lastOrder") || "{}");
    const gameId = cachedOrder?.game_id || cachedOrder?.GameId;

    if (gameId) {
      navigate(`/payment/${gameId}`);
    } else {
      navigate("/");
    }
  };

  return (
    <div
      className={`${styles.container} ${
        success ? styles.success : styles.cancel
      }`}
    >
      {loading ? (
        <Spin size="large" />
      ) : (
        <>
          {success ? (
            <CheckCircleFilled className={`${styles.icon} ${styles.success}`} />
          ) : (
            <CloseCircleFilled className={`${styles.icon} ${styles.cancel}`} />
          )}

          <h2 className={styles.title}>
            {success ? "THANH TOÁN THÀNH CÔNG" : "THANH TOÁN THẤT BẠI"}
          </h2>

          <p className={styles.desc}>
            {success
              ? "Giao dịch của bạn đã hoàn tất, vui lòng kiểm tra trong trò chơi."
              : "Thanh toán không thành công, vui lòng thử lại sau."}
          </p>

          {order && (
            <div className={styles.orderInfo}>
              <p>
                <strong>Mã giao dịch:</strong> {order.transactionId || order.id}
              </p>
              <p>
                <strong>Tổng thanh toán:</strong>{" "}
                {order.amount
                  ? order.amount.toLocaleString("vi-VN") + " VND"
                  : "—"}
              </p>
              <p>
                <strong>Phương thức:</strong> {order.method || "—"}
              </p>
              <p>
                <strong>Thời gian:</strong>{" "}
                {order.time || new Date().toLocaleString("vi-VN")}
              </p>
            </div>
          )}

          <Button
            type="primary"
            className={styles.button}
            onClick={handleBack}
          >
            {success ? "Quay lại" : "Thử lại"}
          </Button>
        </>
      )}
    </div>
  );
}
