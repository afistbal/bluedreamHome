import React, { useEffect, useState } from "react";
import { Input, Button, Select, message, Row, Col } from "antd";
import { callApi } from "@/utils/api";
import { useTranslation } from "react-i18next";
import styles from "../styles/PaymentLogin.module.css";

const { Option } = Select;

export default function PaymentLogin() {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();

  const [uid, setUid] = useState("");
  const [server, setServer] = useState("");
  const [character, setCharacter] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [serverList, setServerList] = useState([]);

  // ✅ 初始化用户信息
  useEffect(() => {
    const local = localStorage.getItem("user");
    if (local) {
      try {
        const data = JSON.parse(local);
        setUid(data.UuId || "");
        setPlayerId(data.PlayerId || "");
        setCharacter(data.PlayerName || "");

        if (data.ServerId) {
          const srv = data.ServerId.includes("+")
            ? "S" + data.ServerId.split("+")[1]
            : "S" + data.ServerId;
          setServer(srv);
        }

        if (Array.isArray(data.ServerList) && data.ServerList.length > 0) {
          const formatted = data.ServerList.map((id) =>
            id.toString().startsWith("S") ? id : "S" + id
          );
          setServerList(formatted);
        } else {
          setServerList(["S1"]);
        }

        setLoggedIn(true);
      } catch (e) {
        console.error("Invalid local user:", e);
      }
    }
  }, []);

  // ✅ 切换区服
  const handleServerChange = async (value) => {
    setServer(value);
    const local = localStorage.getItem("user");
    if (!local) return;

    try {
      const data = JSON.parse(local);
      const res = await callApi(
        `/api/ApiPurchase/ChangeServer?uuid=${data.UuId}&serverId=${value.replace("S", "")}`,
        "GET"
      );

      if (res?.success) {
        data.ServerId = "1+" + value.replace("S", "");
        localStorage.setItem("user", JSON.stringify(data));
        messageApi.success(t("msg.switch_game_text", { server: value }));
      } else {
        messageApi.warning(t("msg.server_error"));
      }
    } catch (err) {
      console.error(err);
      messageApi.error(t("msg.connect_error"));
    }
  };

  // ✅ 模拟登录
  const handleLogin = () => {
    if (!uid) return messageApi.warning(t("msg.please_fill_account"));

    const mockData = {
      UuId: uid,
      Level: "46",
      PlayerId: "1000003",
      PlayerName: "2+Tk",
      Power: "523340",
      ServerId: "1+1",
      ServerList: [1, 2, 3],
      PayMethods: [0],
    };

    localStorage.setItem("user", JSON.stringify(mockData));
    setLoggedIn(true);
    setCharacter("2+Tk");
    setPlayerId("1000003");
    setServerList(["S1", "S2", "S3"]);
    setServer("S1");
    messageApi.success(t("login.login_success"));
  };

  return (
    <div className={styles.loginCard}>
      {contextHolder}

      <h2 className={styles.sectionTitle}>
        1. {t("login.select_game") || "Thông tin nhân vật"}
      </h2>

      {!loggedIn ? (
        <div className={styles.loginForm}>
          <Input
            placeholder={t("login.username")}
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            className={styles.uidInput}
          />
          <Button type="primary" className={styles.loginButton} onClick={handleLogin}>
            {t("login.btn_login")}
          </Button>
        </div>
      ) : (
        <div className={styles.infoBox}>
          <Row gutter={[16, 12]} align="middle">
            <Col xs={24} sm={8} className={styles.infoCol}>
              <span className={styles.label}>{t("character.server")}:</span>
              <Select
                value={server}
                onChange={handleServerChange}
                className={styles.serverSelect}
                popupMatchSelectWidth={false}
                size="middle"
              >
                {serverList.map((s) => (
                  <Option key={s} value={s}>
                    {s}
                  </Option>
                ))}
              </Select>
            </Col>

            <Col xs={24} sm={8} className={styles.infoCol}>
              <span className={styles.label}>{t("character.id")}:</span>
              <span className={styles.value}>{playerId}</span>
            </Col>

            <Col xs={24} sm={8} className={styles.infoCol}>
              <span className={styles.label}>{t("character.name")}:</span>
              <span className={styles.value}>{character}</span>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}
