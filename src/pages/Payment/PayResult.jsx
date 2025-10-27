import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import { Button, Spin, message } from "antd";
import { callApi } from "@/utils/api";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import styles from "./styles/PayResult.module.css";

export default function PayResult() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { orderId } = useParams();
  const location = useLocation();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seconds, setSeconds] = useState(3);
  const [messageApi, contextHolder] = message.useMessage();

  // 从订单列表进入时带上 ?from=orders；带上就不做 3s 自动跳回
  const isFromOrders =
    new URLSearchParams(location.search).get("from") === "orders";

  // 成功/失败严格由路由决定
  const routeIsSuccess = location.pathname.includes("/success");

  // —— 当服务异常时使用的 Mock —— //
  const mockData = {
    id: "9a3c7c96-b31e-11f0-b21a-a6006ab65aca",
    customer_id: "CUST_001",
    order_id: "PAY8768FF477E9D815",
    order_invoice_number: "INV_SEPAY_1761560442",
    order_status: "CAPTURED",
    order_amount: "5000.00",
    order_currency: "VND",
    order_description: "Payment for order tk1 for INV_SEPAY_1761560442",
    authentication_status: null,
    created_at: "2025-10-27 17:20:46",
    updated_at: "2025-10-27 17:21:03",
    transactions: [],
    // 可选补充（若你的接口后续补齐会自动覆盖）
    game_name: "Hải Tặc Loạn Đấu",
    server_name: "S1",
    role_id: "30000001004293",
    role_name: "Sun",
    method_text: "VietQR",
  };

  const fetchOrder = async () => {
    try {
      const res = await callApi(
        `/api/Sepay/getsepayorder?id=${orderId}`,
        "GET"
      );
      if (res && res.data) {
        setOrder(res.data);
      } else {
        messageApi.warning(
          "Không tìm thấy thông tin đơn hàng / 未找到订单信息"
        );
        setOrder(mockData);
      }
    } catch (err) {
      console.error("❌ Error fetching order:", err);
      messageApi.info(
        "🧩 Đang hiển thị dữ liệu mẫu / 使用模拟订单数据"
      );
      setOrder(mockData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  // 自动跳回 /payment/:gameId（仅当不是从“订单列表”来）
  useEffect(() => {
    if (!isFromOrders && !loading) {
      const timer = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            clearInterval(timer);
            const gameId =
              order?.customer_id || JSON.parse(localStorage.getItem("lastOrder") || "{}")?.game_id || "1";
            navigate(`/payment/${gameId}`);
          }
          return s - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isFromOrders, loading, order, navigate]);

  if (loading) {
    return (
      <div className={styles.container}>
        {contextHolder}
        <Spin size="large" />
      </div>
    );
  }

  // 展示字段准备
  const invoice = order?.order_invoice_number || orderId || "—";
  const payMethod =
    order?.method_text ||
    (order?.order_description || "")
      .toLowerCase()
      .includes("sepay")
      ? "SePay"
      : (order?.order_description || "")
          .toLowerCase()
          .includes("momo")
      ? "MoMo"
      : order?.order_description?.toLowerCase().includes("zalo")
      ? "ZaloPay"
      : order?.order_currency
      ? "VietQR"
      : "—";

  const timeText = order?.created_at
    ? dayjs(order.created_at).format("HH:mm DD/MM/YYYY")
    : "—";
  const amountText = `${Number(order?.order_amount || 0).toLocaleString(
    "vi-VN"
  )} ${order?.order_currency || "VND"}`;

  // 游戏/角色信息（可为空则显示“—”）
  const gameName =
    order?.game_name ||
    JSON.parse(localStorage.getItem("selectedGame") || "{}")?.name ||
    "—";
  const serverName =
    order?.server_name ||
    JSON.parse(localStorage.getItem("selectedCharacter") || "{}")?.serverName ||
    "—";
  const roleId = order?.role_id || "—";
  const roleName = order?.role_name || "—";

  return (
    <div className={styles.page}>
      {contextHolder}
      {/* 顶部渐变背景 */}
      <div className={styles.hero} />

      <div className={styles.container}>
        <div className={styles.card}>
          {/* 图标 + 标题 */}
          <div className={styles.headline}>
            {routeIsSuccess ? (
              <CheckCircleFilled className={`${styles.icon} ${styles.success}`} />
            ) : (
              <CloseCircleFilled className={`${styles.icon} ${styles.fail}`} />
            )}
            <h2
              className={`${styles.title} ${
                routeIsSuccess ? styles.textSuccess : styles.textFail
              }`}
            >
              {routeIsSuccess
                ? t("orders_result.title_success")
                : t("orders_result.title_fail")}
            </h2>
          </div>

          {/* 上半区：游戏信息 */}
          <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Game</span>
              <span className={styles.metaValue}>{gameName}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>{t("character.server")}</span>
              <span className={styles.metaValue}>{serverName}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>{t("character.id")}</span>
              <span className={styles.metaValue}>{roleId}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>{t("character.name")}</span>
              <span className={styles.metaValue}>{roleName}</span>
            </div>
          </div>

          {/* 分割线 */}
          <div className={styles.divider} />

          {/* 下半区：订单信息 */}
          <div className={styles.infoBox}>
            <div className={styles.row}>
              <span className={styles.label}>
                {t("orders_result.field.invoice")}
              </span>
              <span className={styles.value}>{invoice}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>
                {t("orders_result.field.method")}
              </span>
              <span className={styles.value}>{payMethod}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>{t("orders_result.field.time")}</span>
              <span className={styles.value}>{timeText} GMT+7</span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>
                {t("orders_result.field.amount")}
              </span>
              <b
                className={`${styles.value} ${
                  routeIsSuccess ? styles.green : styles.red
                }`}
              >
                {amountText}
              </b>
            </div>

            {!routeIsSuccess && (
              <div className={styles.row}>
                <span className={styles.label}>
                  {t("orders_result.field.reason")}
                </span>
                <span className={styles.value}>
                  Giao dịch thất bại / Transaction failed
                </span>
              </div>
            )}
          </div>

          {/* 底部区域：倒计时 + 按钮 */}
          <div className={styles.bottomArea}>
            {!isFromOrders && (
              <p className={styles.timer}>
                {t("orders_result.auto_redirect", { seconds })}
              </p>
            )}
            <Button
              type="primary"
              className={styles.actionBtn}
              onClick={() =>
                navigate(`/payment/${order?.customer_id || "1"}`)
              }
            >
              {routeIsSuccess
                ? t("orders_result.back_btn")
                : t("orders_result.retry_btn")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
