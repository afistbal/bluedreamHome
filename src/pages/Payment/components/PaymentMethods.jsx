import React from "react";
import { Radio, Button, Alert, message } from "antd";
import "../styles/PaymentMethods.css";
import { formatVND } from "@/utils/games.js";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function PaymentMethods({
  selected = [],
  onAdd,
  onReduce,
  onRemove,
  payMethods = [],
  totalVnd = 0,
  overTotalLimit = false,
  payDisabled = false,
  compact = false,
}) {
  const { t } = useTranslation();
  const [method, setMethod] = React.useState(payMethods?.[0]?.code || "");
  const navigate = useNavigate();

  const handlePay = () => {
    if (payDisabled || totalVnd <= 0 || selected.length === 0) {
      message.warning("Không có đơn hàng hợp lệ!");
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
  };

  return (
    <div className="method-card">
      <h2 className="section-title">{t("orders.title")}</h2>

      {overTotalLimit && (
        <Alert
          type="error"
          message={t("errors.over_total_limit")}
          style={{ marginBottom: 12 }}
          showIcon
        />
      )}

      {/* 商品清单 */}
      <div className="order-list">
        {selected.length === 0 ? (
          <div className="order-item" style={{ justifyContent: "center" }}>
            {t("orders.empty")}
          </div>
        ) : (
          selected.map((item) => (
            <div className="order-item" key={item.id}>
              <img src={item.image} alt={item.name} />
              <div style={{ flex: 1, marginRight: 8 }}>
                <p>{item.name}</p>
                <span>{formatVND(item.price)}</span>
              </div>

              <div className="qty">
                <Button size="small" onClick={() => onReduce(item.id)}>
                  -
                </Button>
                <span style={{ margin: "0 6px" }}>x{item.qty}</span>
                <Button size="small" onClick={() => onAdd(item)}>
                  +
                </Button>
              </div>

              <Button
                size="small"
                type="text"
                onClick={() => onRemove(item.id)}
              >
                {t("orders.remove")}
              </Button>
            </div>
          ))
        )}
      </div>

      {/* 支付方式 */}
      <h3 className="section-title" style={{ marginTop: 12 }}>
        {t("payments.title")}
      </h3>

      {!!payMethods?.length && (
        <div className="method-group">
          <Radio.Group
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            {payMethods.map((m) => (
              <Radio key={m.code} value={m.code} className="method-item">
                {m.icon && <img src={m.icon} alt={m.name} />}
                {m.name}
              </Radio>
            ))}
          </Radio.Group>
        </div>
      )}

      {/* 订单汇总 */}
      <div className="summary-box" style={{ marginTop: 12 }}>
        <span>{t("orders.total")}</span>
        <strong>{formatVND(totalVnd)}</strong>
      </div>

      <Button
        type="primary"
        block
        size="large"
        className="pay-button"
        disabled={payDisabled}
        style={
          compact ? { position: "sticky", bottom: 0, marginTop: 12 } : undefined
        }
        onClick={handlePay}
      >
        {t("payments.pay_now")}
      </Button>
    </div>
  );
}
