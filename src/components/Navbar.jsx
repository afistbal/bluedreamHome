import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Select } from "antd";
import LoginModal from "./LoginModal";
import { allGames } from "@/utils/games";
import styles from "./Navbar.module.css";
import Logo from "@/assets/logo.jpg";

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gameOptions, setGameOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState();

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const localizedGames = allGames.map((g) => ({
        ...g,
        name: i18n.language === "zh" ? g.name_zh : g.name_vi,
      }));
      setGameOptions(localizedGames);
      setLoading(false);
    }, 300);
  }, [i18n.language]);

  const handleGameSelect = (value) => {
    const game = gameOptions.find((g) => g.game_id === Number(value));
    if (game) navigate(`/payment/${game.game_id}`);
    setTimeout(() => setSelectedValue(null), 100);
  };

  return (
    <>
      <header className={styles.header}>
        {/* ✅ PC 用 flex；H5 用 grid（见 CSS） */}
        <div className={styles.navbarContainer}>
          {/* 左：Logo */}
          <Link to="/" className={styles.logoArea}>
            <img src={Logo} alt="BlueDream logo" className={styles.logoImg} />
          </Link>

          {/* 中：搜索 */}
          <div className={styles.searchArea}>
            <Select
              showSearch
              value={selectedValue}
              placeholder={t("nav.search_games") || "Tìm trò chơi"}
              className={styles.searchSelect}
              optionLabelProp="label"
              loading={loading}
              onChange={handleGameSelect}
              options={gameOptions.map((g) => ({
                value: g.game_id,
                label: (
                  <div className={styles.dropdownItem}>
                    <img src={g.icon_url} alt={g.name} className={styles.dropdownIcon} />
                    <div className={styles.dropdownInfo}>
                      <div className={styles.dropdownName}>{g.name}</div>
                      <div className={styles.dropdownMeta}>
                        <span>{g.platform}</span>
                        <span>• {g.region}</span>
                      </div>
                    </div>
                  </div>
                ),
              }))}
            />
          </div>

          {/* 右：登录（唯一按钮） */}
          <div className={styles.actionArea}>
            <Button className={styles.loginBtn} onClick={() => setIsLoginVisible(true)}>
              {t("login.btn_login")}
            </Button>
          </div>
        </div>
      </header>

      <LoginModal
        visible={isLoginVisible}
        onClose={() => setIsLoginVisible(false)}
        onLoginSuccess={() => setIsLoginVisible(false)}
      />
    </>
  );
}
