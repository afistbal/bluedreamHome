import { Carousel } from "antd";
import { LeftOutlined, RightOutlined, FireOutlined } from "@ant-design/icons";
import React, { useState, useEffect, useRef } from "react";
import styles from "./Home.module.css"; // ✅ 样式隔离

const banners = [
  "https://scdn-img.vnggames.com/mainsite/images/TQHT-homepage-desktop-1650x928.jpg?qlty=100&size=750&iswebp=1",
  "https://scdn-img.vnggames.com/mainsite/images/NBM-homepage-1650x928-v4.png?qlty=100&size=750&iswebp=1",
];

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const timer = useRef(null);
  const carouselRef = useRef(null);

  const next = () => carouselRef.current.next();
  const prev = () => carouselRef.current.prev();

  useEffect(() => {
    setProgress(0);
    clearInterval(timer.current);
    let w = 0;
    timer.current = setInterval(() => {
      w += 1;
      setProgress(w);
      if (w >= 100) {
        setCurrent((p) => (p + 1) % 2);
        setProgress(0);
      }
    }, 60);
    return () => clearInterval(timer.current);
  }, [current]);

  const games = [
    { id: 1, name: "Tam Quốc Huyền Tưởng VNG", img: "https://scdn-img.vnggames.com/mainsite/images/lol-icon.jpg" },
    { id: 2, name: "Liên Minh Huyền Thoại", img: "https://scdn-img.vnggames.com/mainsite/images/lol-icon.jpg" },
    { id: 3, name: "PUBG Mobile VN", img: "https://scdn-img.vnggames.com/mainsite/images/lol-icon.jpg" },
    { id: 4, name: "Roblox VN", img: "https://scdn-img.vnggames.com/mainsite/images/lol-icon.jpg" },
    { id: 5, name: "Play Together VNG", img: "https://scdn-img.vnggames.com/mainsite/images/lol-icon.jpg" },
  ];

  const benefits = [
    { icon: "🎁", title: "Ưu đãi hấp dẫn" },
    { icon: "🏆", title: "Vật phẩm độc quyền" },
    { icon: "💳", title: "Thanh toán trực tiếp" },
    { icon: "💰", title: "Giá tốt nhất" },
  ];

  return (
    <main className={styles.vngHome}>
      {/* Banner */}
      <section className={styles.bannerSection}>
        <div
          className={styles.bannerBlurBg}
          style={{ backgroundImage: `url(${banners[current]})` }}
        ></div>

        <div className={styles.bannerWrapper}>
          <Carousel
            autoplay
            fade
            ref={carouselRef}
            beforeChange={(_, next) => setCurrent(next)}
            dots={{ className: styles.bannerDots }}
          >
            {banners.map((src, i) => (
              <div key={i} className={styles.bannerSlide}>
                <img src={src} alt={`banner-${i}`} className={styles.bannerImg} />
              </div>
            ))}
          </Carousel>

          <button className={`${styles.bannerBtn} ${styles.left}`} onClick={prev}>
            <LeftOutlined />
          </button>
          <button className={`${styles.bannerBtn} ${styles.right}`} onClick={next}>
            <RightOutlined />
          </button>
        </div>
      </section>

      {/* Games Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            <FireOutlined style={{ color: "#f05c22" }} /> DÀNH CHO BẠN
          </h2>
          <div className={styles.gameGrid}>
            {games.map((g) => (
              <div className={styles.gameCard} key={g.id}>
                <div className={styles.gameThumbWrap}>
                  <img src={g.img} alt={g.name} className={styles.gameThumb} />
                </div>
                <div className={styles.gameInfo}>
                  <h3>{g.name}</h3>
                  <button className={styles.btnOrange}>Nạp ngay</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={styles.benefitSection}>
        <h2 className={styles.benefitTitle}>LỢI ÍCH KHI NẠP TẠI VNGGAMES</h2>
        <div className={styles.benefitGrid}>
          {benefits.map((b, i) => (
            <div className={styles.benefitCard} key={i}>
              <div className={styles.benefitIcon}>{b.icon}</div>
              <p>{b.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerLogo}>VNGGAMES Shop</div>
          <div className={styles.footerLinks}>
            <div>
              <h4>Khám phá</h4>
              <ul>
                <li>Đại lý thẻ Zing</li>
              </ul>
            </div>
            <div>
              <h4>Hỗ trợ</h4>
              <ul>
                <li>Hướng dẫn nạp tiền</li>
                <li>Câu hỏi thường gặp</li>
                <li>Chăm sóc khách hàng</li>
              </ul>
            </div>
            <div>
              <h4>Điều khoản dịch vụ</h4>
              <h4>Chính sách bảo mật</h4>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          © Copyright ©2023 VNG. All Rights Reserved
        </div>
      </footer>
    </main>
  );
}
