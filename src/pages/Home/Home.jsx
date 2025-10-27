import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./Home.module.css";
import { allGames } from "@/utils/games";
import banner from "@/assets/war2-banner1.jpg";
import banner2 from "@/assets/war2-banner2.jpg";
import banner3 from "@/assets/banner3.png";

export default function Home() {
  const { t } = useTranslation();
  const slides = [banner, banner2, banner3];
  const [current, setCurrent] = useState(0);
  const [selectedGame, setSelectedGame] = useState(null);

  // ✅ 点击游戏卡
  const handleSelect = (game) => {
    const saved = localStorage.getItem("selectedGame");
    const savedGame = saved ? JSON.parse(saved) : null;

    // ✅ 若游戏不同 → 打开登录弹窗（Step 2）
    if (!savedGame || savedGame.game_id !== game.game_id) {
      if (window.openLoginModal) {
        window.openLoginModal(false, game.game_id); // 第二个参数是 gameId
      } else {
        console.warn("⚠️ openLoginModal 未定义，请检查 App.jsx");
      }
    }
  };

  // 自动轮播
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((p) => (p + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // 滚动透明逻辑
  useEffect(() => {
    let ticking = false;
    const saved = localStorage.getItem("selectedGame");
    if (saved) setSelectedGame(JSON.parse(saved));

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        document.body.classList.toggle("scrolled", window.scrollY > 20);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={styles.homePage}>
      {/* Nav */}
      <nav className={styles.siteNav}>
        <div className={`${styles.container} ${styles.siteNavInner}`}>
          <Link to="/" className={styles.siteNavLink}>
            {t("nav_home")}
          </Link>
          <a href="#" className={styles.siteNavLink}>
            {t("nav_products")}
          </a>
          <a href="#" className={styles.siteNavLink}>
            {t("nav_news")}
          </a>
          <a href="#" className={styles.siteNavLink}>
            {t("nav_download")}
          </a>
          <a href="#" className={styles.siteNavLink}>
            {t("nav_support")}
          </a>
          <a href="#" className={styles.siteNavLink}>
            {t("nav_about")}
          </a>
        </div>
      </nav>

      {/* Banner */}
      <section className={styles.hero}>
        <div className={styles.heroBanner}>
          <div className={styles.heroSlides}>
            <img className={styles.heroSizer} src={slides[0]} alt="sizer" />
            <div key={current} className={styles.heroSlide}>
              <img
                className={styles.heroBannerImg}
                src={slides[current]}
                alt={`banner-${current + 1}`}
              />
            </div>
          </div>
          <div className={styles.heroBannerDots}>
            {slides.map((_, idx) => (
              <span
                key={idx}
                className={`${styles.heroBannerDot} ${
                  idx === current ? styles.heroBannerDotActive : ""
                }`}
                onClick={() => setCurrent(idx)}
              ></span>
            ))}
          </div>
        </div>
      </section>

      {/* Game Cards */}
      <main className={styles.container}>
        {/* 推荐游戏 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t("recommended_for_you")}</h2>
          <div className={styles.grid}>
            {allGames.map((game) => (
              <div
                key={game.game_id}
                className={`${styles.card} ${styles.gridCard} ${
                  selectedGame?.game_id === game.game_id
                    ? styles.cardActive
                    : ""
                }`}
                onClick={() => handleSelect(game)}
              >
                <div className={styles.gridThumb}>
                  <img src={game.icon_url} alt={game.name} />
                </div>
                <div className={styles.gridTitle}>{game.name}</div>
                <button className={`${styles.btn} ${styles.btnPrimary}`}>
                  {t("top_up_now")}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ✅ Lợi ích khi nạp tại BlueDream */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t("benefits_title")}</h2>
          <div className={styles.benefits}>
            {/* 1️⃣ 优惠 */}
            <div className={`${styles.card} ${styles.benefitsItem}`}>
              <img
                src="/src/assets/icon_offers.png"
                alt="Offers"
                className={styles.benefitsIcon}
              />
              <div className={styles.benefitsTitle}>
                {t("attractive_offers")}
              </div>
            </div>

            {/* 2️⃣ 道具 */}
            <div className={`${styles.card} ${styles.benefitsItem}`}>
              <img
                src="/src/assets/icon_items.png"
                alt="Items"
                className={styles.benefitsIcon}
              />
              <div className={styles.benefitsTitle}>{t("exclusive_items")}</div>
            </div>

            {/* 3️⃣ 支付 */}
            <div className={`${styles.card} ${styles.benefitsItem}`}>
              <img
                src="/src/assets/icon_payment.png"
                alt="Payment"
                className={styles.benefitsIcon}
              />
              <div className={styles.benefitsTitle}>{t("direct_payment")}</div>
            </div>

            {/* 4️⃣ 价格 */}
            <div className={`${styles.card} ${styles.benefitsItem}`}>
              <img
                src="/src/assets/icon_price.png"
                alt="Price"
                className={styles.benefitsIcon}
              />
              <div className={styles.benefitsTitle}>{t("best_price")}</div>
            </div>
          </div>
        </section>
      </main>

      <div className={styles.dazzlingGradientSection}></div>

      <div className="dazzling-gradient-section"></div>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            <div>
              <div className={styles.footerTitle}>{t("quick_links")}</div>
              <ul className={styles.footerList}>
                <li>
                  <Link to="/">{t("nav_home")}</Link>
                </li>
                <li>
                  <a href="#">{t("nav_products")}</a>
                </li>
                <li>
                  <a href="#">{t("nav_news")}</a>
                </li>
                <li>
                  <a href="#">{t("nav_download")}</a>
                </li>
                <li>
                  <a href="#">{t("nav_support")}</a>
                </li>
              </ul>
            </div>
            <div>
              <div className={styles.footerTitle}>{t("policy")}</div>
              <ul className={styles.footerList}>
                <li>
                  <Link to="/policy?type=privacy">{t("privacy_policy")}</Link>
                </li>
                <li>
                  <Link to="/policy?type=terms">{t("service_terms")}</Link>
                </li>
                <li>
                  <Link to="/policy?type=refund">{t("refund_policy")}</Link>
                </li>
                <li>
                  <Link to="/policy?type=deletion">{t("data_deletion")}</Link>
                </li>
              </ul>
            </div>
            <div>
              <div className={styles.footerTitle}>{t("customer_service")}</div>
              <ul className={styles.footerList}>
                <li>Hotline: 1900 0000</li>
                <li>Email: support@bluedream.vn</li>
                <li>{t("working_time")}: 09:00–18:00</li>
              </ul>
            </div>
            <div>
              <div className={styles.footerTitle}>BlueDream</div>
              <div className={styles.footerNote}>
                {t("footer_note")}
                <br />
                ©Copyright 2025 BlueDream. All Rights Reserved
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
