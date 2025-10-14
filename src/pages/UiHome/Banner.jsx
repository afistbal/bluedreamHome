import React, { useEffect, useRef, useState } from "react";
import { Carousel } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import styles from "../styles/Banner.module.css";

const banners = [
  "https://scdn-img.vnggames.com/mainsite/images/TQHT-homepage-desktop-1650x928.jpg?qlty=100&size=750&iswebp=1",
  "https://scdn-img.vnggames.com/mainsite/images/NBM-homepage-1650x928-v4.png?qlty=100&size=750&iswebp=1",
];

const AUTO_MS = 6000; // 6s 自动轮播

export default function Banner() {
  const ref = useRef(null);
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0); // 0~100
  const timer = useRef(null);

  const goPrev = () => ref.current?.prev();
  const goNext = () => ref.current?.next();

  // 进度条动画
  useEffect(() => {
    clearInterval(timer.current);
    setProgress(0);
    const started = Date.now();
    timer.current = setInterval(() => {
      const pct = Math.min(100, ((Date.now() - started) / AUTO_MS) * 100);
      setProgress(pct);
      if (pct >= 100) goNext();
    }, 60);
    return () => clearInterval(timer.current);
  }, [current]);

  return (
    <div className={styles.wrap}>
      {/* 轮播主体 */}
      <div className={styles.carouselWrap}>
        <Carousel
          ref={ref}
          dots={false}
          effect="fade"
          autoplay={false}
          beforeChange={(_, next) => setCurrent(next)}
          className={styles.carousel}
        >
          {banners.map((src, i) => (
            <div key={i} className={styles.slide}>
              <img className={styles.img} src={src} alt={`banner-${i}`} />
            </div>
          ))}
        </Carousel>

        {/* 自定义左右按钮（在图内，hover 放大） */}
        <button className={`${styles.arrow} ${styles.left}`} onClick={goPrev}>
          <LeftOutlined />
        </button>
        <button className={`${styles.arrow} ${styles.right}`} onClick={goNext}>
          <RightOutlined />
        </button>

        {/* 底部圆点 + 进度条 */}
        <div className={styles.dots}>
          {banners.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${current === i ? styles.active : ""}`}
              onClick={() => ref.current?.goTo(i)}
              aria-label={`slide-${i}`}
            >
              {current === i && (
                <span
                  className={styles.dotProgress}
                  style={{ width: `${progress}%` }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
