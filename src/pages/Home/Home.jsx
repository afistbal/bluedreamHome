import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Modal } from "antd";
import styles from "./Home.module.css";
import { allGames } from "@/utils/games";
import banner from "@/assets/war2-banner1.jpg";
import banner2 from "@/assets/war2-banner2.jpg";
import banner3 from "@/assets/banner3.png";
import icon_offers from "@/assets/icon_offers.png";
import icon_items from "@/assets/icon_items.png";
import icon_payment from "@/assets/icon_payment.png";
import icon_price from "@/assets/icon_price.png";

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const slides = [banner, banner2, banner3];
  const [current, setCurrent] = useState(0);
  const [selectedGame, setSelectedGame] = useState(null);

  // 支持 context 的 modal 实例（H5 OK）
  const [modal, contextHolder] = Modal.useModal();

  // 点击游戏卡逻辑
  const handleSelect = (game) => {
    const savedUser = JSON.parse(localStorage.getItem("user") || "null");
    const savedGame = JSON.parse(localStorage.getItem("selectedGame") || "null");

    // 未登录 → 直接 Step2（传 game_id）
    if (!savedUser?.UuId) {
      if (window.openLoginModal) {
        window.openLoginModal(false, game.game_id);
      } else {
        console.warn("⚠️ openLoginModal 未定义，请检查 App.jsx");
      }
      return;
    }

    // 已登录 & 与当前相同 → 直达充值页
    if (savedGame && savedGame.game_id === game.game_id) {
      navigate(`/payment/${game.game_id}`);
      return;
    }

    // 已登录 & 切换不同游戏 → 确认后 Step2（传 game_id）
    modal.confirm({
      title: t("msg.switch_game_title") || "切换游戏确认",
      content:
        t("msg.switch_game_text") ||
        "您切换游戏，必须重新登录。确定要切换吗？",
      okText: t("common.confirm") || "确定",
      cancelText: t("common.cancel") || "取消",
      centered: true,
      onOk: () => {
        if (window.openLoginModal) {
          window.openLoginModal(false, game.game_id);
        }
      },
    });
  };

  // 自动轮播
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((p) => (p + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // 滚动透明逻辑 + 当前选中游戏用于 UI 高亮
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
      {/* 🔹 Modal ContextHolder 必须放顶层 */}
      {contextHolder}

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

        {/* 优势区 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t("benefits_title")}</h2>
          <div className={styles.benefits}>
            <div className={`${styles.card} ${styles.benefitsItem}`}>
              <img
                src={icon_offers}
                alt="Offers"
                className={styles.benefitsIcon}
              />
              <div className={styles.benefitsTitle}>
                {t("attractive_offers")}
              </div>
            </div>

            <div className={`${styles.card} ${styles.benefitsItem}`}>
              <img
                src={icon_items}
                alt="Items"
                className={styles.benefitsIcon}
              />
              <div className={styles.benefitsTitle}>{t("exclusive_items")}</div>
            </div>

            <div className={`${styles.card} ${styles.benefitsItem}`}>
              <img
                src={icon_payment}
                alt="Payment"
                className={styles.benefitsIcon}
              />
              <div className={styles.benefitsTitle}>{t("direct_payment")}</div>
            </div>

            <div className={`${styles.card} ${styles.benefitsItem}`}>
              <img
                src={icon_price}
                alt="Price"
                className={styles.benefitsIcon}
              />
              <div className={styles.benefitsTitle}>{t("best_price")}</div>
            </div>
          </div>
        </section>
      </main>

      <div className={styles.dazzlingGradientSection}></div>
    </div>
  );
}
