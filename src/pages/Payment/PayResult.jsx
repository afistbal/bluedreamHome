// src/pages/Payment/PayResult.jsx
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

  // ✅ 判断来源与结果类型
  const isFromOrders =
    new URLSearchParams(location.search).get("from") === "orders";
  const routeIsSuccess = location.pathname.includes("/success");

  // ✅ 用户与游戏映射
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const orderGameMap = JSON.parse(localStorage.getItem("orderGameMap") || "{}");
  const selectedGame = JSON.parse(localStorage.getItem("selectedGame") || "{}");

  // ✅ 优先顺序：orderGameMap → selectedGame → 否则跳首页
  const gameIdFromMap = orderGameMap[orderId] || selectedGame?.game_id || null;

  // ✅ 拉取订单详情 + 自动补全字段
  const fetchOrder = async () => {
    try {
      const res = await callApi(`/api/Sepay/getsepayorder?id=${orderId}`, "GET");

      if (res && res?.data && res?.data?.data) {
        const orderData = res.data.data;

        // 从本地缓存取上下文补充字段
        const selectedGame = JSON.parse(localStorage.getItem("selectedGame") || "{}");
        const savedCharacter = JSON.parse(localStorage.getItem("selectedCharacter") || "{}");

        const merged = {
          ...orderData,
          game_name: selectedGame?.name_vi || selectedGame?.name_zh || "—",
          server_name: savedCharacter?.serverName || "—",
          role_id: savedCharacter?.roleId || "—",
          role_name: savedCharacter?.roleName || "—",
        };

        setOrder(merged);
      } else {
        messageApi.warning(t("orders_result.title_fail"));
      }
    } catch (err) {
      console.error("❌ Error fetching order:", err);
      messageApi.error(t("msg.server_error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  // ✅ 登录与映射检查逻辑
  useEffect(() => {
    if (loading) return;

    // 未登录
    if (!user) {
      messageApi.warning(t("login.please_select_game"));
      setTimeout(() => navigate("/"), 2000);
      return;
    }

    // 无映射 + 无 selectedGame → 回首页
    if (!gameIdFromMap) {
      messageApi.warning(t("orders_result.title_fail"));
      setTimeout(() => navigate("/"), 2000);
      return;
    }
  }, [loading, user, gameIdFromMap, navigate, t]);

  // ✅ 自动跳转逻辑（仅非 orders 页来源）
  useEffect(() => {
    if (!isFromOrders && !loading && user && gameIdFromMap) {
      const timer = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            clearInterval(timer);
            navigate(`/payment/${gameIdFromMap}`);
          }
          return s - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isFromOrders, loading, user, gameIdFromMap, navigate]);

  if (loading) {
    return (
      <div className={styles.container}>
        {contextHolder}
        <Spin size="large" />
      </div>
    );
  }

  // ✅ 展示字段准备
  const invoice = order?.order_invoice_number || orderId || "—";
  const payMethod =
    order?.method_text ||
    (/sepay/i.test(order?.order_description || "") ? "SePay"
      : /momo/i.test(order?.order_description || "") ? "MoMo"
      : /zalo/i.test(order?.order_description || "") ? "ZaloPay"
      : order?.order_currency ? "VietQR"
      : "—");

  const timeText = order?.created_at
    ? dayjs(order.created_at).format("HH:mm DD/MM/YYYY")
    : "—";

  const amountText = `${Number(order?.order_amount || 0).toLocaleString("vi-VN")} ${
    order?.order_currency || "VND"
  }`;

  const gameName = order?.game_name || "—";
  const serverName = order?.server_name || "—";
  const roleId = order?.role_id || "—";
  const roleName = order?.role_name || "—";

  return (
    <div className={styles.page}>
      {contextHolder}
      <div className={styles.hero} />
      <div className={styles.container}>
        <div className={styles.card}>
          {/* ✅ 标题 */}
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

          {/* ✅ 游戏信息 */}
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

          <div className={styles.divider} />

          {/* ✅ 订单信息 */}
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
              <span className={styles.label}>
                {t("orders_result.field.time")}
              </span>
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
                  {t("orders_result.title_fail")}
                </span>
              </div>
            )}
          </div>

          {/* ✅ 底部 */}
          <div className={styles.bottomArea}>
            {!isFromOrders && (
              <p className={styles.timer}>
                {t("orders_result.auto_redirect", { seconds })}
              </p>
            )}
            <Button
              type="primary"
              className={styles.actionBtn}
              onClick={() => navigate(`/payment/${gameIdFromMap}`)}
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
