import React from "react";
import styles from "../styles/Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>VNGGAMES Shop</div>
        <div className={styles.cols}>
          <div className={styles.col}>
            <h4>Khám phá</h4>
            <ul>
              <li><a href="#">Đại lý thẻ Zing</a></li>
            </ul>
          </div>
          <div className={styles.col}>
            <h4>Hỗ trợ</h4>
            <ul>
              <li><a href="#">Hướng dẫn nạp tiền</a></li>
              <li><a href="#">Câu hỏi thường gặp</a></li>
              <li><a href="#">Chăm sóc khách hàng</a></li>
            </ul>
          </div>
          <div className={styles.col}>
            <h4>Điều khoản dịch vụ</h4>
            <ul>
              <li><a href="#">Chính sách bảo mật</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        © Copyright ©2023 VNG. All Rights Reserved
      </div>
    </footer>
  );
}
