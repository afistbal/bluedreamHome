import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./Footer.module.css";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {/* Brand */}
        <div className={styles.brand}>
          <span className={styles.brandEm}>{t("footer.brand_em")}</span>
          <span className={styles.brandText}>{t("footer.brand_text")}</span>
        </div>

        {/* Columns */}
        <div className={styles.cols}>
          <div className={styles.col}>
            <h4 className={styles.colTitle}>{t("footer.explore")}</h4>
            <ul className={styles.list}>
              <li>
                <a className={styles.link} href="#">{t("footer.agency")}</a>
              </li>
            </ul>
          </div>

          <div className={styles.col}>
            <h4 className={styles.colTitle}>{t("footer.support")}</h4>
            <ul className={styles.list}>
              <li><a className={styles.link} href="#">{t("footer.payment_guide")}</a></li>
              <li><a className={styles.link} href="#">{t("footer.faq")}</a></li>
              <li><a className={styles.link} href="#">{t("footer.customer_care")}</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.hr} />

      <div className={styles.bottom}>
        <div className={styles.copy}>
          {t("footer.copyright")} ©2025 BlueDream. {t("footer.all_rights")}
        </div>

        <div className={styles.bottomLinks}>
          <Link className={styles.link} to="/policy?type=terms">
            {t("footer.terms")}
          </Link>
          <Link className={styles.link} to="/policy?type=privacy">
            {t("footer.privacy")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
