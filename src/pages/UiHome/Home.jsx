import React from "react";
import Banner from "./Banner";
import GameGrid from "./GameGrid";
import Benefits from "./Benefits";
import Footer from "./Footer";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <main className={styles.page}>
      {/* 背景（柔和淡化） */}
      <div
        className={styles.bg}
        style={{
          backgroundImage:
            "url('https://scdn-img.vnggames.com/mainsite/images/NBM-homepage-1650x928-v4.png?qlty=100&size=828&iswebp=1')",
        }}
      />

      <div className={styles.container}>
        <section className={styles.hero}>
          <Banner />
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>DÀNH CHO BẠN</h2>
          </div>
          <GameGrid />
        </section>

        <section className={styles.section}>
          <Benefits />
        </section>
      </div>

      {/* 暂时不接入 NavBar / Header，等你给代码再挂 */}
      <Footer />
    </main>
  );
}
