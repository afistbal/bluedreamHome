// src/pages/Payment/Payment.jsx
import React, { useEffect, useMemo, useState } from "react";
import PaymentLogin from "./components/PaymentLogin";
import PaymentPacks from "./components/PaymentPacks";
import PaymentMethods from "./components/PaymentMethods";
import { callApi } from "@/utils/api";
import { message, Spin, Drawer, Button, Badge } from "antd";
import { formatVND } from "@/utils/games.js";
import "./styles/PaymentLayout.css";
import { useTranslation } from "react-i18next";

const MAX_QTY_PER_ITEM = 8;               // 单品最大数量
const MAX_TOTAL_VND = 85_000_000;         // 订单最大金额（含所有项）

export default function Payment() {
  const { t } = useTranslation();

  const [payMethods, setPayMethods] = useState([]);
  const [loading, setLoading] = useState(false);

  // 全站购物车（由左侧选择维护）
  const [selectedPacks, setSelectedPacks] = useState([]); // [{id,name,price,image,qty}]
  const [mobileOpen, setMobileOpen] = useState(false);

  // 从 URL 拿 gameId（保持你原逻辑）:contentReference[oaicite:4]{index=4}
  const [gameId] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("gameid") || 2;
  });

  // useEffect(() => {
  //   async function fetchPayMethods() {
  //     setLoading(true);
  //     try {
  //       const res = await callApi("/api/ApiPurchase/PayMethod/?gameid=2", "GET");
  //       if (res === -1) {
  //         message.error(t("errors.invalid_gameid"));
  //         setPayMethods([]);
  //       } else if (Array.isArray(res)) {
  //         setPayMethods(res);
  //       } else if (res?.data) {
  //         setPayMethods(res.data);
  //       } else {
  //         message.warning(t("errors.no_paymethods"));
  //       }
  //     } catch (err) {
  //       message.error(t("errors.load_paymethods_fail"));
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //   fetchPayMethods();
  // }, [gameId, t]);

  // 计算总价/总数
  const { totalQty, totalVnd } = useMemo(() => {
    let qty = 0, sum = 0;
    selectedPacks.forEach(p => { qty += p.qty; sum += p.price * p.qty; });
    return { totalQty: qty, totalVnd: sum };
  }, [selectedPacks]);

  // 业务限制
  const overItemLimit = (qty) => qty >= MAX_QTY_PER_ITEM;
  const overTotalLimit = totalVnd > MAX_TOTAL_VND;

  // —— 购物车操作 —— //
  const addPack = (pack) => {
    setSelectedPacks(prev => {
      const exist = prev.find(p => p.id === pack.id);
      if (exist) {
        if (overItemLimit(exist.qty)) {
          message.warning(t("tips.reach_item_limit"));
          return prev;
        }
        return prev.map(p => p.id === pack.id ? { ...p, qty: p.qty + 1 } : p);
      }
      return [...prev, { ...pack, qty: 1 }];
    });
  };

  const reducePack = (id) => {
    setSelectedPacks(prev =>
      prev
        .map(p => (p.id === id ? { ...p, qty: Math.max(0, p.qty - 1) } : p))
        .filter(p => p.qty > 0)
    );
  };

  const removePack = (id) => {
    setSelectedPacks(prev => prev.filter(p => p.id !== id));
  };

  // 移动端：底部“继续”按钮打开订单抽屉
  const openMobileSheet = () => setMobileOpen(true);
  const closeMobileSheet = () => setMobileOpen(false);

  // 支付按钮是否可点
  const payDisabled = false;// overTotalLimit || totalVnd <= 0 || payMethods.length === 0

  return (
    <main className="payment-page">
      <div className="payment-container">
        {/* 左：登录 + 选包（保持你的结构）:contentReference[oaicite:5]{index=5} */}
        <div className="left-column">
          <section className="section-box">
            <PaymentLogin />
          </section>
          <section className="section-box">
            <PaymentPacks
              selected={selectedPacks}
              onAdd={addPack}
              onReduce={reducePack}
              maxQtyPerItem={MAX_QTY_PER_ITEM}
            />
          </section>
        </div>

        {/* 右：订单 + 支付（PC 固定、H5 由 Drawer 展示） */}
        <div className="right-column">
          <section className="section-sticky">
            {loading ? (
              <div className="loading-center"><Spin tip={t("common.loading")} /></div>
            ) : (
              <PaymentMethods
                selected={selectedPacks}
                onAdd={addPack}
                onReduce={reducePack}
                onRemove={removePack}
                payMethods={payMethods}
                totalVnd={totalVnd}
                overTotalLimit={overTotalLimit}
                payDisabled={payDisabled}
              />
            )}
          </section>
        </div>
      </div>

      {/* —— H5 底部结算条 —— */}
      <div className="mobile-bottom-bar">
        <div className="mobile-bottom-left">
          <Badge count={totalQty} size="small">
            <span className="mobile-total-label">{t("cart.total")}</span>
          </Badge>
          <span className="mobile-total-amount">{formatVND(totalVnd)}</span>
        </div>
        <Button
          type="primary"
          className="mobile-continue-btn"
          onClick={openMobileSheet}
          disabled={totalVnd <= 0}
        >
          {t("cart.continue")}
        </Button>
      </div>

      {/* —— H5 订单抽屉 —— */}
      <Drawer
        title={t("cart.order_info")}
        placement="bottom"
        height="78vh"
        onClose={closeMobileSheet}
        open={mobileOpen}
        className="mobile-drawer"
      >
        <PaymentMethods
          selected={selectedPacks}
          onAdd={addPack}
          onReduce={reducePack}
          onRemove={removePack}
          payMethods={payMethods}
          totalVnd={totalVnd}
          overTotalLimit={overTotalLimit}
          payDisabled={payDisabled}
          compact
        />
      </Drawer>
    </main>
  );
}
