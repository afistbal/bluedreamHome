import React, { useState, useEffect } from "react";
import { Modal, Button, message } from "antd";
import {
  GoogleOutlined,
  AppleFilled,
  FacebookFilled,
  ArrowLeftOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  loginWithGoogle,
  loginWithFacebook,
  loginWithApple,
} from "../../services/loginService";
import { callApi } from "@/utils/api";
import { allGames } from "@/utils/games";
import styles from "./LoginModal.module.css";

const LoginModal = ({
  visible,
  onClose,
  onLoginSuccess,
  fromLoginBtn = false,
}) => {
  const { t, i18n } = useTranslation();
  const [selectedGame, setSelectedGame] = useState(null);
  const [step, setStep] = useState(1);
  const [messageApi, contextHolder] = message.useMessage();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [games, setGames] = useState([]);

  useEffect(() => {
    if (visible) {
      const saved = localStorage.getItem("selectedGame");
      const hasSavedGame = !!saved;

      // ✅ 从 Navbar 登录按钮打开 → 强制显示选游戏页
      if (fromLoginBtn) {
        setSelectedGame(null);
        setStep(1);
      }
      // ✅ 从其他地方唤起（window.openLoginModal(false)） → 按 localStorage 判断
      else if (hasSavedGame) {
        const game = JSON.parse(saved);
        setSelectedGame(game);
        setStep(2);
      } else {
        setStep(1);
      }

      const localizedGames = allGames.map((g) => ({
        ...g,
        name: i18n.language === "zh" ? g.name_zh : g.name_vi,
      }));
      setGames(localizedGames);
    }
  }, [visible, i18n.language, fromLoginBtn]);

  // ✅ 选游戏时不立即保存
  const handleSelectGame = (game) => {
    setSelectedGame(game);
  };

  const handleNext = () => {
    if (!selectedGame) {
      messageApi.warning({
        key: "login",
        content: t("msg.please_choose_game"),
      });
      return;
    }
    setStep(2);
  };

  const handleBack = () => setStep(1);

  // ✅ 账号密码登录
  const handleAccountLogin = async () => {
    if (!selectedGame) {
      messageApi.warning({
        key: "login",
        content: t("msg.please_choose_game"),
      });
      return;
    }
    if (!username || !password) {
      messageApi.warning({
        key: "login",
        content: t("msg.please_fill_account"),
      });
      return;
    }

    try {
      messageApi.open({
        key: "login",
        type: "loading",
        content: t("login.logging_in"),
        duration: 0,
      });

      const res = await callApi("api/APILogin/BdLogin", "POST", {
        UserName: username,
        PassWord: password,
        GameId: selectedGame.game_id,
      });

      if (!res?.success || !res?.data?.PlayerId) {
        messageApi.error({ key: "login", content: t("login.login_fail") });
        return;
      }

      const userData = res.data;

      // ✅ 成功后存储
      localStorage.setItem("selectedGame", JSON.stringify(selectedGame));
      localStorage.setItem("user", JSON.stringify(userData));

      messageApi.success({ key: "login", content: t("login.login_success") });

      onLoginSuccess?.(userData);
      onClose();

      // ✅ 延时刷新页面
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error("Login error:", err);
      messageApi.error({ key: "login", content: t("login.login_fail") });
    }
  };

  // ✅ 第三方登录（Apple 例子）
  const handleLogin = async (provider) => {
    if (!selectedGame) {
      messageApi.warning({
        key: "login",
        content: t("msg.please_choose_game"),
      });
      return;
    }

    try {
      if (provider === "google") return loginWithGoogle();
      if (provider === "facebook") return loginWithFacebook();

      if (provider === "apple") {
        messageApi.open({
          key: "login",
          type: "loading",
          content: t("login.logging_in"),
          duration: 0,
        });

        const payload = await loginWithApple();
        if (!payload?.TokenId) {
          messageApi.error({ key: "login", content: t("login.apple_fail") });
          return;
        }

        const res = await callApi("/api/APILogin/ApLogin", "POST", payload);
        if (!res?.success || !res?.data?.PlayerId) {
          messageApi.error({ key: "login", content: t("login.login_fail") });
          return;
        }

        const userData = res.data;

        localStorage.setItem("selectedGame", JSON.stringify(selectedGame));
        localStorage.setItem("user", JSON.stringify(userData));

        messageApi.success({ key: "login", content: t("login.login_success") });

        onLoginSuccess?.(userData);
        onClose();

        // ✅ 延时刷新页面
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (e) {
      messageApi.error({ key: "login", content: t("login.login_fail") });
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={visible}
        onCancel={onClose}
        footer={null}
        closeIcon={null}
        centered
        width={500}
        className={styles.modalWrapper}
        destroyOnHidden
        styles={{
          body: { padding: 0 },
        }}
      >
        {/* 背景模糊层 */}
        <AnimatePresence>
          {selectedGame && (
            <motion.div
              key={selectedGame.game_id}
              className={styles.bgLayer}
              style={{ backgroundImage: `url(${selectedGame.icon_url})` }}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.45, 0, 0.1, 1] }}
            />
          )}
        </AnimatePresence>

        <div className={styles.inner}>
          <div className={styles.header}>
            {step === 2 && (
              <Button
                type="link"
                icon={<ArrowLeftOutlined />}
                onClick={handleBack}
                className={styles.backBtn}
              >
                {t("login.back_to_game")}
              </Button>
            )}
            <button className={styles.closeBtn} onClick={onClose}>
              ✕
            </button>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="select"
                className={styles.body}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <h2 className={styles.title}>{t("login.select_game")}</h2>
                <p className={styles.subtitle}>
                  {t("login.please_select_game")}
                </p>

                <div className={styles.grid}>
                  {games.map((g) => {
                    const active = selectedGame?.game_id === g.game_id;
                    return (
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        key={g.game_id}
                        className={`${styles.card} ${
                          active ? styles.active : ""
                        }`}
                        onClick={() => handleSelectGame(g)}
                      >
                        <img src={g.icon_url} alt={g.name} />
                        {active && (
                          <motion.div
                            className={styles.check}
                            initial={{ opacity: 0, scale: 0.6 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <CheckOutlined />
                          </motion.div>
                        )}
                        <div className={styles.cardName}>{g.name}</div>
                      </motion.div>
                    );
                  })}
                </div>

                <Button
                  type="primary"
                  className={styles.nextBtn}
                  disabled={!selectedGame}
                  onClick={handleNext}
                >
                  {t("login.btn_login")}
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="login"
                className={styles.body}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <h2 className={styles.title}>{t("login.btn_login")}</h2>
                <p className={styles.subtitle}>
                  Một tài khoản cho tất cả sản phẩm <strong>BlueDream</strong>
                </p>

                <input
                  type="text"
                  placeholder={
                    i18n.language === "zh" ? "登录账号" : "Tài khoản đăng nhập"
                  }
                  className={styles.input}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input
                  type="password"
                  placeholder={i18n.language === "zh" ? "密码" : "Mật khẩu"}
                  className={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Button
                  type="primary"
                  block
                  className={styles.loginBtn}
                  onClick={handleAccountLogin}
                >
                  {t("login.btn_login")}
                </Button>

                <div className={styles.socialRow}>
                  <button
                    className={`${styles.social} ${styles.apple}`}
                    onClick={() => handleLogin("apple")}
                  >
                    <AppleFilled />
                  </button>
                  <button
                    className={`${styles.social} ${styles.facebook}`}
                    onClick={() => handleLogin("facebook")}
                  >
                    <FacebookFilled />
                  </button>
                  <button
                    className={`${styles.social} ${styles.google}`}
                    onClick={() => handleLogin("google")}
                  >
                    <GoogleOutlined />
                  </button>
                </div>

                <div className={styles.selectedTag}>
                  🎮 {selectedGame?.name}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Modal>
    </>
  );
};

export default LoginModal;
