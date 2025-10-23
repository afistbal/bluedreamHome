import React from "react";
import { Button, Tooltip, Switch } from "antd";
import { useTranslation } from "react-i18next";
import styles from "../styles/PaymentPacks.module.css";

const mockPacks = [
  {
    id: "pirate.pack.diamond.1",
    name: "Gói 60 Kim Cương",
    desc: "Gói 60 Kim Cương",
    price: 20000,
    image: "/src/assets/57c81556-52b0-4640-b272-f9441b7e9394.png",
  },
  {
    id: "pirate.pack.diamond.2",
    name: "Gói 150 Kim Cương",
    desc: "Gói 150 Kim Cương",
    price: 50000,
    sale: true,
    image: "/src/assets/57c81556-52b0-4640-b272-f9441b7e9394.png",
  },
  {
    id: "pirate.pack.diamond.4",
    name: "Gói 300 Kim Cương",
    desc: "Gói 300 Kim Cương",
    price: 100000,
    image: "/src/assets/57c81556-52b0-4640-b272-f9441b7e9394.png",
  },
  {
    id: "pirate.pack.diamond.20",
    name: "Gói 1582 Kim Cương",
    desc: "Gói 1502 Kim Cương + Bonus 81 Kim Cương",
    price: 500000,
    sale: true,
    image: "/src/assets/57c81556-52b0-4640-b272-f9441b7e9394.png",
  },
  {
    id: "pirate.pack.diamond.50",
    name: "Gói 3226 Kim Cương",
    desc: "Gói 3003 Kim Cương + Bonus 223 Kim Cương",
    price: 1000000,
    image: "/src/assets/57c81556-52b0-4640-b272-f9441b7e9394.png",
  },
  {
    id: "pirate.pack.diamond.100",
    name: "Gói 16667 Kim Cương",
    desc: "Gói 15015 Kim Cương + Bonus 1652 Kim Cương",
    price: 5000000,
    sale: true,
    image: "/src/assets/57c81556-52b0-4640-b272-f9441b7e9394.png",
  },
];

export default function PaymentPacks({
  selected = [],
  onAdd,
  onReduce,
  multiBuy = false,
  onToggleMultiBuy,
  maxQtyPerItem = 8,
}) {
  const { t } = useTranslation();
  const getQty = (id) => selected.find((p) => p.id === id)?.qty || 0;

  return (
    <section className={styles.section}>
      <div className={styles.headerRow}>
        <div className={styles.headerLeft}>
          <h2 className={styles.title}>📜 Chọn gói</h2>
          <span className={styles.hot}>🔥 Danh sách gói</span>
        </div>
        {/* <div className={styles.headerRight}>
          <span className={styles.switchLabel}>Mua nhiều Gói nạp</span>
          <Switch
            checked={multiBuy}
            onChange={onToggleMultiBuy}
            size="small"
            className={styles.switchBtn}
          />
        </div> */}
      </div>

      <div className={styles.grid}>
        {mockPacks.map((pack) => {
          const qty = getQty(pack.id);
          const maxed = qty >= maxQtyPerItem;
          return (
            <article
              key={pack.id}
              className={`${styles.card} ${qty > 0 ? styles.active : ""}`}
            >
              {pack.sale && <div className={styles.saleTag}>ƯU ĐÃI 50%</div>}
              <div className={styles.imageWrap}>
                <img src={pack.image} alt={pack.name} />
              </div>

              <div className={styles.info}>
                <h4>{pack.name}</h4>
                <p>{pack.desc}</p>
                <div className={styles.bottom}>
                  <span className={styles.price}>
                    {pack.price.toLocaleString()} VND
                  </span>
                  <div className={styles.qtyBtns}>
                    {qty > 0 ? (
                      <>
                        <Button
                          size="small"
                          className={styles.qtyBtn}
                          onClick={() => onReduce(pack.id)}
                        >
                          -
                        </Button>
                        <span className={styles.priceNum}>{qty}</span>
                        <Tooltip title={maxed ? t("tips.reach_item_limit") : ""}>
                          <Button
                            size="small"
                            className={styles.qtyBtn}
                            onClick={() => onAdd(pack)}
                          >
                            +
                          </Button>
                        </Tooltip>
                      </>
                    ) : (
                      <Button
                        size="small"
                        className={styles.addBtn}
                        onClick={() => onAdd(pack)}
                      >
                        +
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
