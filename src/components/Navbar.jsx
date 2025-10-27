// src/components/Navbar.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Select, Dropdown, message } from "antd";
import { allGames } from "@/utils/games";
import styles from "./Navbar.module.css";
import Logo from "@/assets/logo.jpg";

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const [loading, setLoading] = useState(false);
  const [gameOptions, setGameOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState();
  const [user, setUser] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);

  // 初始化
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const localizedGames = allGames.map((g) => ({
        ...g,
        name: i18n.language === "zh" ? g.name_zh : g.name_vi,
      }));
      setGameOptions(localizedGames);
      setLoading(false);
    }, 300);

    try {
      const u = JSON.parse(localStorage.getItem("user") || "null");
      if (u?.PlayerId) setUser(u);
      const sg = JSON.parse(localStorage.getItem("selectedGame") || "null");
      if (sg) setSelectedGame(sg);
    } catch {}

    return () => clearTimeout(timer);
  }, [i18n.language]);

  const avatarUrl = useMemo(() => {
    if (!selectedGame?.game_id) return null;
    const found = allGames.find((g) => g.game_id === selectedGame.game_id);
    return found?.icon_url || null;
  }, [selectedGame]);

  // 打开登录弹窗
  const handleOpenLogin = () => {
    if (window.openLoginModal) window.openLoginModal(true);
    else console.warn("⚠️ openLoginModal 未定义，请检查 App.jsx");
  };

  // 选择游戏时唤起登录
  const handleGameSelect = (value) => {
    const game = gameOptions.find((g) => g.game_id === Number(value));
    if (!game) return;
    if (window.openLoginModal) window.openLoginModal(false, game.game_id);
    setTimeout(() => setSelectedValue(null), 100);
  };

  // ✅ 登出逻辑
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("selectedGame");
    messageApi.success(t("account.logout_success"));
    setTimeout(() => {
      navigate("/");
      window.location.reload();
    }, 800);
  };

  const menuItems = [
    {
      key: "orders",
      label: t("account.my_orders"),
      onClick: () => navigate("/orders"),
    },
    { type: "divider" },
    {
      key: "logout",
      label: t("account.logout"),
      onClick: handleLogout,
    },
  ];

  return (
    <header className={styles.header}>
      {contextHolder}
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
            placeholder={t("nav.search_games")}
            className={styles.searchSelect}
            optionLabelProp="label"
            loading={loading}
            onChange={handleGameSelect}
            options={gameOptions.map((g) => ({
              value: g.game_id,
              label: (
                <div className={styles.dropdownItem}>
                  <img
                    src={g.icon_url}
                    alt={g.name}
                    className={styles.dropdownIcon}
                  />
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

        {/* 右：登录按钮 / 用户头像 */}
        <div className={styles.actionArea}>
          {user?.PlayerId ? (
            <Dropdown
              menu={{ items: menuItems }}
              trigger={["hover"]}
              placement="bottomRight"
            >
              <button className={styles.avatarBtn}>
                <img
                  className={styles.avatarImg}
                  src={
                    avatarUrl ||
                    "https://api.iconify.design/solar:user-circle-linear.svg?color=%238a8a8a"
                  }
                  alt="avatar"
                />
              </button>
            </Dropdown>
          ) : (
            <Button className={styles.loginBtn} onClick={handleOpenLogin}>
              {t("login.btn_login")}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
