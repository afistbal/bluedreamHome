import React, { useMemo, useState } from "react";
import { Radio, Button, Alert, message } from "antd";
import { formatVND } from "@/utils/games.js";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styles from "../styles/PaymentMethods.module.css";

export default function PaymentMethods({
  selected = [],
  onAdd,
  onReduce,
  gameId,
  payMethods = [], // 🔹传进来的可能是 [0,1,2]
  totalVnd = 0,
  overTotalLimit = false,
  payDisabled = false,
  compact = false,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  // ✅ 枚举映射
  const PAYMENT_METHOD_MAP = {
    0: { id: 0, name: "SePay", icon: "/icons/sepay.png" },
    1: { id: 1, name: "MoMo", icon: "/icons/momo.png" },
    2: { id: 2, name: "ZaloPay", icon: "/icons/zalopay.png" },
  };

  // ✅ 映射后的支付方式数组
  const methods = useMemo(() => {
    if (!Array.isArray(payMethods)) return [];
    return payMethods.map((id) => PAYMENT_METHOD_MAP[id]).filter(Boolean);
  }, [payMethods]);

  const [method, setMethod] = useState(methods?.[0]?.id ?? 0); // ✅ 数字型值

  // ✅ 展开/收起逻辑
  const [showAll, setShowAll] = useState(false);
  const visibleItems = !compact && !showAll ? selected.slice(0, 2) : selected;

  function safeCalculate(expr) {
    if (!/^[0-9+\-*/ ().]+$/.test(expr)) return NaN; // ✅ 防止注入
    return Function(`"use strict"; return (${expr})`)();
  }

  const handlePay = () => {
    if (payDisabled || totalVnd <= 0 || selected.length === 0) {
      messageApi.warning({
        key: "login",
        content: t("msg.please_choose_game"),
      });
      return;
    }

    console.log("selected");
    // ✅ 从 selected 中提取出 id 和数量
    const productIDs = selected.map((item) => item.id);
    const quantities = selected.map((item) => item.qty);
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const uuid = user?.UuId || user?.uuid || ""; // 兼容字段名不同的情况

    // ✅ 拼接支付参数
    const query = new URLSearchParams({
      uuid,
      gameID: gameId,
      serverID: safeCalculate(user?.ServerId),
      productIDs: JSON.stringify(productIDs),
      quantities: JSON.stringify(quantities),
      methodID: method, // ✅ 直接传 0 / 1 / 2
    });

    navigate(`/payment/process?${query.toString()}`);
  };

  return (
    <div className={`${styles.methodCard} ${compact ? styles.compact : ""}`}>
      {contextHolder}

      {/* ===== 标题 ===== */}
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>
          3. {t("orders.title") || "Thông tin đơn hàng"}
        </h2>
      </div>

      {/* 超额提示 */}
      {overTotalLimit && (
        <Alert
          type="error"
          message={t("errors.over_total_limit")}
          className={styles.alert}
          showIcon
        />
      )}

      {/* ===== 订单清单 ===== */}
      <div className={styles.orderList}>
        {selected.length === 0 ? (
          <div className={styles.orderEmpty}>{t("orders.empty")}</div>
        ) : (
          visibleItems.map((item) => (
            <div key={item.id} className={styles.orderItem}>
              <img src={item.image} alt={item.name} className={styles.thumb} />
              <div className={styles.itemInfo}>
                <p className={styles.itemName}>{item.name}</p>
                <span className={styles.itemPrice}>
                  {formatVND(item.price)}
                </span>
              </div>

              <div className={styles.qtyWrap}>
                <Button
                  size="small"
                  className={styles.qtyBtn}
                  onClick={() => onReduce?.(item.id)}
                >
                  -
                </Button>
                <span className={styles.priceNum}>{item.qty}</span>
                <Button
                  size="small"
                  className={styles.qtyBtn}
                  onClick={() => onAdd?.(item)}
                >
                  +
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ===== 展开/收起 ===== */}
      {!compact && selected.length > 2 && (
        <div className={styles.moreWrap}>
          <Button
            className={styles.moreBtn}
            onClick={() => setShowAll(!showAll)}
            size="small"
          >
            {showAll
              ? t("orders.collapse") || "Rút gọn"
              : `${t("orders.show_more") || "Xem thêm"} (${
                  selected.length - 2
                })`}
          </Button>
        </div>
      )}

      {/* ===== 支付方式 ===== */}
      <div className={styles.sectionBlock}>
        <h3 className={styles.blockTitle}>
          {t("payments.title") || "Phương thức thanh toán"}
        </h3>

        {methods.length === 0 ? (
          <div className={styles.empty}>
            {t("payments.no_methods") || "暂无可用支付方式"}
          </div>
        ) : (
          <div className={styles.methodGroup}>
            <Radio.Group
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className={styles.methodRadios}
            >
              {methods.map((m) => (
                <Radio
                  key={m.id}
                  value={m.id}
                  className={`${styles.methodItem} ${
                    method === m.id ? styles.methodActive : ""
                  }`}
                >
                  <span>{m.name}</span>
                </Radio>
              ))}
            </Radio.Group>
          </div>
        )}
      </div>

      {/* ===== 合计 ===== */}
      <div className={styles.summaryBox}>
        <span className={styles.summaryLabel}>
          {t("orders.total") || "Tổng thanh toán"}
        </span>
        <strong className={styles.summaryAmount}>{formatVND(totalVnd)}</strong>
      </div>

      {/* ===== 支付按钮 ===== */}
      <Button
        type="primary"
        block
        size="large"
        className={styles.payButton}
        disabled={payDisabled || totalVnd <= 0 || selected.length === 0}
        onClick={handlePay}
      >
        {t("payments.pay_now") || "Thanh toán ngay"}
      </Button>
    </div>
  );
}
