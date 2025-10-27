import React, { useEffect, useMemo, useState } from "react";
import PaymentLogin from "./components/PaymentLogin";
import PaymentPacks from "./components/PaymentPacks";
import PaymentMethods from "./components/PaymentMethods";
import { callApi } from "@/utils/api";
import { useNavigate } from "react-router-dom";
import { message, Spin, Drawer, Button, Badge } from "antd";
import { formatVND } from "@/utils/games.js";
import "./styles/PaymentLayout.css";
import styles from "./Payment.module.css";
import { useTranslation } from "react-i18next";

const MAX_QTY_PER_ITEM = 8;
const MAX_TOTAL_VND = 85_000_000;

export default function Payment() {
  const [messageApi, contextHolder] = message.useMessage();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [payMethods, setPayMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPacks, setSelectedPacks] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false); // ✅ 移动端抽屉状态

  const [gameId] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("gameid") || 2;
  });

  // ✅ 获取登录信息
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      messageApi.warning({
        key: "login",
        content: t("msg.please_choono_tokense_game"),
      });
      navigate(`/`);
      return null;
    }
  }, []);

  // ✅ 页面加载时获取支付方式
  useEffect(() => {
    if (!user?.UuId) return;
    const fetchMethods = async () => {
      setLoading(true);
      try {
        const res = await callApi(
          `/api/ApiPurchase/PayMethod?gameid=${gameId}`,
          "GET"
        );
        if (res?.success && Array.isArray(res?.data)) {
          setPayMethods(res.data);
        } else {
          messageApi.warning({
            key: "errors",
            content: t("errors.load_paymethods_fail"),
          });
        }
      } catch (err) {
        console.error("❌ 获取支付方式失败：", err);
        messageApi.error({
          key: "errors",
          content: t("errors.network"),
        });
      } finally {
        setLoading(false);
      }
    };
    fetchMethods();
  }, [gameId, user?.UuId]);

  // ✅ 计算总价/总数
  const { totalQty, totalVnd } = useMemo(() => {
    let qty = 0,
      sum = 0;
    selectedPacks.forEach((p) => {
      qty += p.qty;
      sum += p.price * p.qty;
    });
    return { totalQty: qty, totalVnd: sum };
  }, [selectedPacks]);

  // ✅ 限制条件
  const overItemLimit = (qty) => qty >= MAX_QTY_PER_ITEM;
  const overTotalLimit = totalVnd > MAX_TOTAL_VND;

  // ✅ 加减购物车逻辑
  const addPack = (pack) => {
    setSelectedPacks((prev) => {
      const exist = prev.find((p) => p.id === pack.id);
      if (exist) {
        if (overItemLimit(exist.qty)) {
          messageApi.warning({
            key: "tips",
            content: t("tips.reach_item_limit"),
          });
          return prev;
        }
        return prev.map((p) =>
          p.id === pack.id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { ...pack, qty: 1 }];
    });
  };

  const reducePack = (id) => {
    setSelectedPacks((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, qty: Math.max(0, p.qty - 1) } : p))
        .filter((p) => p.qty > 0)
    );
  };

  const removePack = (id) => {
    setSelectedPacks((prev) => prev.filter((p) => p.id !== id));
  };

  const payDisabled = false;

  // ✅ 移动端抽屉控制
  const openMobileSheet = () => setMobileOpen(true);
  const closeMobileSheet = () => setMobileOpen(false);

  return (
    <main className={styles["payment-page"]}>
      {contextHolder}
      <div className={styles["payment-container"]}>
        {/* 左：登录 + 选包 */}
        <div className={styles["left-column"]}>
          <section className={styles["section-box"]}>
            <PaymentLogin />
          </section>
          <section className={styles["section-box"]}>
            <PaymentPacks
              selected={selectedPacks}
              onAdd={addPack}
              onReduce={reducePack}
              maxQtyPerItem={MAX_QTY_PER_ITEM}
            />
          </section>
        </div>

        {/* 右：订单 + 支付（PC 固定区） */}
        <div className={styles["right-column"]}>
          <section className={styles["section-sticky"]}>
            {loading ? (
              <div className={styles["loading-center"]}>
                <Spin tip={t("common.loading")} />
              </div>
            ) : (
              <PaymentMethods
                gameId={gameId}
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

      {/* ✅ H5 底部结算条（PC隐藏） */}
      <div className={styles["mobile-bottom-bar"]}>
        <div className={styles["mobile-bottom-left"]}>
          <Badge count={totalQty} size="small">
            <span className={styles["mobile-total-label"]}>
              {t("cart.total")}
            </span>
          </Badge>
          <span className={styles["mobile-total-amount"]}>
            {formatVND(totalVnd)}
          </span>
        </div>
        <Button
          type="primary"
          className={styles["mobile-continue-btn"]}
          onClick={openMobileSheet}
          disabled={totalVnd <= 0}
        >
          {t("cart.continue")}
        </Button>
      </div>

      {/* ✅ H5 订单抽屉（带遮罩） */}
      <Drawer
        title={t("cart.order_info")}
        placement="bottom"
        height="78vh"
        onClose={closeMobileSheet}
        open={mobileOpen}
        className={styles["mobile-drawer"]}
        maskClosable
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
          gameId={gameId}
          compact // ✅ 紧凑模式（移动端）
        />
      </Drawer>
    </main>
  );
}
