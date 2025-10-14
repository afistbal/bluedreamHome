import React from "react";
import styles from "../styles/Benefits.module.css";

const benefits = [
  { icon: "🎁", title: "Ưu đãi hấp dẫn" },
  { icon: "🏆", title: "Vật phẩm độc quyền" },
  { icon: "💳", title: "Thanh toán trực tiếp" },
  { icon: "💰", title: "Giá tốt nhất" },
];

export default function Benefits() {
  return (
    <div className={styles.wrap}>
      <h2 className={styles.title}>LỢI ÍCH KHI NẠP TẠI VNGGAMES</h2>
      <div className={styles.grid}>
        {benefits.map((b, i) => (
          <div key={i} className={styles.card}>
            <div className={styles.icon}>{b.icon}</div>
            <div className={styles.text}>{b.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
