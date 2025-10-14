import React, { useEffect, useState } from "react";
import PaymentLogin from "./components/PaymentLogin";
import PaymentPacks from "./components/PaymentPacks";
import PaymentMethods from "./components/PaymentMethods";
import { callApi } from "@/utils/api"; // 之前写的通用 API 封装
import { message, Spin } from "antd";
import "./styles/PaymentLayout.css";

export default function Payment() {
  const [payMethods, setPayMethods] = useState([]); // 存支付方式列表
  const [loading, setLoading] = useState(false);

  // 这里模拟从 URL 或 props 里拿到 gameid，例如 ?gameid=1
  const [gameId] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("gameid") || 2; // 默认1
  });

  // 初始化加载支付方式
  useEffect(() => {
    async function fetchPayMethods() {
      setLoading(true);
      try {
        const res = await callApi('/api/ApiPurchase/PayMethod/?gameid=2', 'GET')
        console.log(111111111111111, res)
        if (res === -1) {
          message.error("Game ID không hợp lệ / 游戏ID无效");
          setPayMethods([]);
        } else if (Array.isArray(res)) {
          setPayMethods(res);
        } else if (res?.data) {
          setPayMethods(res.data);
        } else {
          message.warning("Không có dữ liệu thanh toán / 无支付方式数据");
        }
      } catch (err) {
        console.error(err);
        message.error("Lỗi khi tải phương thức thanh toán / 加载支付方式失败");
      } finally {
        setLoading(false);
      }
    }

    fetchPayMethods();
  }, [gameId]);

  return (
    <main className="payment-page">
      <div className="payment-container">
        {/* 左半部分：登录 + 礼包选择 */}
        <div className="left-column">
          <section className="section-box">
            <PaymentLogin />
          </section>

          <section className="section-box">
            <PaymentPacks />
          </section>
        </div>

        {/* 右半部分：订单信息 + 支付 */}
        <div className="right-column">
          <section className="section-sticky">
            {loading ? (
              <div className="loading-center">
                <Spin tip="Đang tải / 加载中..." />
              </div>
            ) : (
              <PaymentMethods payMethods={payMethods} />
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
