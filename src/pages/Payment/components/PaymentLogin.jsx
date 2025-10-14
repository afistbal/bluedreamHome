import React, { useState } from "react";
import { Input, Button } from "antd";
import "../styles/PaymentLogin.css";

export default function PaymentLogin() {
  const [uid, setUid] = useState("");
  const [server, setServer] = useState("S1");
  const [character, setCharacter] = useState("Sun");

  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    if (!uid) return alert("Vui lòng nhập UID!");
    setLoggedIn(true);
  };

  return (
    <div className="login-card">
      <h2 className="section-title">1. Thông tin nhân vật</h2>

      {!loggedIn ? (
        <div className="login-form">
          <Input
            placeholder="Nhập UID hoặc ID nhân vật"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            className="uid-input"
          />
          <Button type="primary" className="login-button" onClick={handleLogin}>
            Đăng nhập
          </Button>
        </div>
      ) : (
        <div className="login-info">
          <div><strong>Máy chủ:</strong> {server}</div>
          <div><strong>ID nhân vật:</strong> {uid}</div>
          <div><strong>Nhân vật:</strong> {character}</div>
          <Button onClick={() => setLoggedIn(false)}>Đăng xuất</Button>
        </div>
      )}
    </div>
  );
}
