import React, { useState } from "react";
import { Radio, Button } from "antd";
import "../styles/PaymentMethods.css";

const methods = [
  {
    code: "zalopay",
    name: "ZaloPay",
    icon: "https://scdn-stc-billing.vnggames.com/payment/static/group/1-zalopay.png",
  },
  {
    code: "visa",
    name: "Visa / Mastercard",
    icon: "https://scdn-stc-billing.vnggames.com/payment/static/1-1-52-52.png",
  },
];


export default function PaymentMethods() {
  const [method, setMethod] = useState("vietqr");

  return (
    <div className="method-card">
      <h2 className="section-title">3. Thông tin đơn hàng</h2>

      <div className="order-list">
        <div className="order-item">
          <img
            src="https://stc-sot.vcdn.vn/ws-content/uploads//GTAPPTEST-ZINGPAY-1-LIVE/image/product/1429910654359678976.png"
            alt="item"
          />
          <div>
            <p>Gói 335 Huyền Tinh</p>
            <span>129,000 VND</span>
          </div>
          <span className="qty">×1</span>
        </div>
        <div className="order-item">
          <img
            src="https://stc-sot.vcdn.vn/ws-content/uploads//GTAPPTEST-ZINGPAY-1-LIVE/image/product/1429910654359678976.png"
            alt="item"
          />
          <div>
            <p>Gói 65 Huyền Tinh</p>
            <span>25,000 VND</span>
          </div>
          <span className="qty">×2</span>
        </div>
      </div>

      <div className="method-group">
        <Radio.Group value={method} onChange={(e) => setMethod(e.target.value)}>
          {methods.map((m) => (
            <Radio key={m.code} value={m.code} className="method-item">
              <img src={m.icon} alt={m.name} />
              {m.name}
            </Radio>
          ))}
        </Radio.Group>
      </div>

      <div className="summary-box">
        <span>Tổng thanh toán</span>
        <strong>194,000 VND</strong>
      </div>

      <Button type="primary" block size="large" className="pay-button">
        Thanh toán ngay
      </Button>
    </div>
  );
}
