// ✅ Navbar.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Select, Dropdown, message, Modal } from "antd";
import { allGames } from "@/utils/games";
import styles from "./Navbar.module.css";
import Logo from "@/assets/logo.jpg";
import OrdersModal from "@/components/OrdersModal/OrdersModal.jsx";

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [messageApi, messageContextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();

  const [ordersOpen, setOrdersOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gameOptions, setGameOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState();
  const [user, setUser] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const localizedGames = allGames.map((g) => ({
        ...g,
        name:
          i18n.language === "zh"
            ? g.name_zh
            : i18n.language === "en"
            ? g.name_en || g.name_vi
            : g.name_vi,
      }));
      setGameOptions(localizedGames);
      setLoading(false);
    }, 300);

    try {
      const u = JSON.parse(localStorage.getItem("user") || "null");
      if (u?.UuId) setUser(u);
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

  // ✅ 多语言循环切换 zh → vi → en → zh
  const handleLanguageToggle = () => {
    const current = i18n.language;
    let next = "zh";
    if (current === "zh") next = "vi";
    else if (current === "vi") next = "en";
    else next = "zh";
    i18n.changeLanguage(next);
    localStorage.setItem("lang", next);
  };

  const handleGameSelect = (value) => {
    const game = gameOptions.find((g) => g.game_id === Number(value));
    if (!game) return;
    setTimeout(() => setSelectedValue(null), 100);

    const savedUser = JSON.parse(localStorage.getItem("user") || "null");
    const savedGame = JSON.parse(localStorage.getItem("selectedGame") || "null");

    if (!savedUser?.UuId) {
      if (window.openLoginModal) window.openLoginModal(false, game.game_id);
      return;
    }

    if (savedGame && savedGame.game_id === game.game_id) {
      navigate(`/payment/${game.game_id}`);
      return;
    }

    modal.confirm({
      title: t("msg.switch_game_title"),
      content: t("msg.switch_game_text"),
      okText: t("common.confirm"),
      cancelText: t("common.cancel"),
      centered: true,
      onOk: () => {
        if (window.openLoginModal) window.openLoginModal(false, game.game_id);
      },
    });
  };

  const handleOpenLogin = () => {
    if (window.openLoginModal) window.openLoginModal(true);
  };

  // ✅ 根据当前语言显示按钮文字
  const getLangLabel = () => {
    switch (i18n.language) {
      case "zh":
        return "中文";
      case "vi":
        return "Việt";
      case "en":
        return "EN";
      default:
        return "Việt";
    }
  };

  return (
    <header className={styles.header}>
      {messageContextHolder}
      {modalContextHolder}
      <OrdersModal open={ordersOpen} onClose={() => setOrdersOpen(false)} />

      <div className={styles.navbarContainer}>
        <Link to="/" className={styles.logoArea}>
          <img src={Logo} alt="BlueDream" className={styles.logoImg} />
        </Link>

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

        <div className={styles.actionArea}>
          {/* ✅ 多语言切换按钮 */}
          <Button
            className={styles.langBtn}
            size="small"
            onClick={handleLanguageToggle}
          >
            {getLangLabel()}
          </Button>

          {user?.UuId ? (
            <Dropdown
              menu={{
                items: [
                  {
                    key: "orders",
                    label: t("account.my_orders"),
                    onClick: () => setOrdersOpen(true),
                  },
                  { type: "divider" },
                  {
                    key: "logout",
                    label: t("account.logout"),
                    onClick: () => {
                      localStorage.removeItem("user");
                      localStorage.removeItem("selectedGame");
                      messageApi.success(t("account.logout_success"));
                      navigate('/');
                      setTimeout(() => window.location.reload(), 600);
                    },
                  },
                ],
              }}
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
