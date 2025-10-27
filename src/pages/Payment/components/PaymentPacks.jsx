import React from "react";
import { Button, Tooltip, Switch } from "antd";
import { useTranslation } from "react-i18next";
import { mockPacks } from '@/utils/games.js';
import styles from "../styles/PaymentPacks.module.css";

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
              {pack.sale && <div className={styles.saleTag}>ƯU ĐÃI</div>}
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
