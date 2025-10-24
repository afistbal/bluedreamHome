import React from "react";
import { Radio, Button, Alert, message } from "antd";
import { formatVND } from "@/utils/games.js";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styles from "../styles/PaymentMethods.module.css";

export default function PaymentMethods({
  selected = [],
  onAdd,
  onReduce,
  onRemove,
  payMethods = [],
  totalVnd = 0,
  overTotalLimit = false,
  payDisabled = false,
  compact = false, // ✅ H5 Drawer 内传入 compact
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  // ✅ 默认支付方式
  const methods = React.useMemo(() => {
    if (Array.isArray(payMethods) && payMethods.length > 0) return payMethods;
    return [
      { code: "sepay", name: "SePay", icon: "" },
      { code: "zalopay", name: "ZaloPay", icon: "" },
    ];
  }, [payMethods]);

  const [method, setMethod] = React.useState(methods?.[0]?.code || "sepay");

  // ✅ 展开/收起逻辑（仅 PC）
  const [showAll, setShowAll] = React.useState(false);
  const isMobileCompact = compact;
  const visibleItems =
    !isMobileCompact && !showAll ? selected.slice(0, 2) : selected;

  const handlePay = () => {
    if (payDisabled || totalVnd <= 0 || selected.length === 0) {
      messageApi.warning({ key: "login", content: t("msg.please_choose_game") });
      return;
    }

    // ✅ 拼接支付参数
    const query = new URLSearchParams({
      uuid: "tk1",
      gameID: 2,
      serverID: 1,
      productIDs: JSON.stringify(["earth_diamond_1"]),
      quantities: JSON.stringify([1]),
      methodID: 0,
    });

    // ✅ 跳转到支付页面
    navigate(`/payment/process?${query.toString()}`);
    // 留给父层逻辑处理支付
  };

  return (
    <div className={`${styles.methodCard} ${compact ? styles.compact : ""}`}>
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
      {contextHolder}

      {/* ===== 展开/收起 ===== */}
      {!isMobileCompact && selected.length > 2 && (
        <div className={styles.moreWrap}>
          {!showAll ? (
            <Button
              className={styles.moreBtn}
              onClick={() => setShowAll(true)}
              size="small"
            >
              {t("orders.show_more") || "Xem thêm"} ({selected.length - 2})
            </Button>
          ) : (
            <Button
              className={styles.moreBtn}
              onClick={() => setShowAll(false)}
              size="small"
            >
              {t("orders.collapse") || "Rút gọn"}
            </Button>
          )}
        </div>
      )}

      {/* ===== 支付方式 ===== */}
      <div className={styles.sectionBlock}>
        <h3 className={styles.blockTitle}>
          {t("payments.title") || "Phương thức thanh toán"}
        </h3>

        <div className={styles.methodGroup}>
          <Radio.Group
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className={styles.methodRadios}
          >
            {methods.map((m) => (
              <Radio
                key={m.code}
                value={m.code}
                className={`${styles.methodItem} ${
                  method === m.code ? styles.methodActive : ""
                }`}
              >
                {m.icon ? (
                  <img
                    src={m.icon}
                    alt={m.name}
                    className={styles.methodIcon}
                  />
                ) : null}
                <span>{m.name}</span>
              </Radio>
            ))}
          </Radio.Group>
        </div>
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
