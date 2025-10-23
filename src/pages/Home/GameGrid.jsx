import React from "react";
import styles from "../styles/GameGrid.module.css";

const games = [
  {
    id: 1,
    name: "Tam Quốc Huyền Tướng VNG",
    img: "https://scdn-img.vnggames.com/mainsite/images/lol-icon.jpg?qlty=75&size=256&iswebp=1",
  },
  {
    id: 2,
    name: "Play Together VNG",
    img: "https://scdn-img.vnggames.com/mainsite/images/lol-icon.jpg?qlty=75&size=256&iswebp=1",
  },
  {
    id: 3,
    name: "Roblox VN",
    img: "https://scdn-img.vnggames.com/mainsite/images/lol-icon.jpg?qlty=75&size=256&iswebp=1",
  },
  {
    id: 4,
    name: "Liên Minh Huyền Thoại",
    img: "https://scdn-img.vnggames.com/mainsite/images/lol-icon.jpg?qlty=75&size=256&iswebp=1",
  },
];

export default function GameGrid() {
  return (
    <div className={styles.grid}>
      {games.map((g) => (
        <a key={g.id} className={styles.card} href="#" aria-label={g.name}>
          <div className={styles.thumbWrap}>
            <img className={styles.thumb} src={g.img} alt={g.name} />
          </div>
          <div className={styles.meta}>
            <h3 className={styles.name}>{g.name}</h3>
            <button className={styles.btn}>Nạp ngay</button>
          </div>
        </a>
      ))}
    </div>
  );
}
