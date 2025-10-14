import React from "react";
import { Modal, Button, Space } from "antd";
import {
  loginWithGoogle,
  loginWithFacebook,
  loginWithApple,
} from "../../services/loginService";
import {
  GoogleOutlined,
  AppleFilled,
  FacebookFilled,
  MailOutlined,
} from "@ant-design/icons";

const LoginModal = ({ visible, onClose, onLoginSuccess }) => {
  const handleLogin = async (provider) => {
    try {
      let result = null;
      switch (provider) {
        case "google":
          result = await loginWithGoogle();
          break;
        case "facebook":
          result = await loginWithFacebook();
          break;
        case "apple":
          result = await loginWithApple();
          break;
        default:
          break;
      }

      if (result) {
        console.log("✅ Token:", result);

        // 调用你的后端登录接口
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(result),
        });

        const data = await res.json();
        console.log("Backend login result:", data);

        localStorage.setItem("user", JSON.stringify(data));
        onLoginSuccess(data);
        onClose();
      }
    } catch (e) {
      console.error("Login failed:", e);
    }
  };

  return (
    <Modal open={visible} onCancel={onClose} footer={null} centered>
      <h2 style={{ textAlign: "center" }}>Đăng nhập</h2>
      <p style={{ textAlign: "center", color: "#888" }}>
        Một tài khoản cho tất cả sản phẩm VNGGames
      </p>

      <Space direction="vertical" style={{ width: "100%" }}>
        <Button
          block
          type="primary"
          icon={<MailOutlined />}
          style={{ background: "#f97316", borderColor: "#f97316" }}
        >
          Email hoặc số điện thoại
        </Button>

        <Button
          block
          type="primary"
          style={{ background: "#0096E6", borderColor: "#0096E6" }}
        >
          Zing ID
        </Button>

        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginTop: "8px",
          }}
        >
          <Button
            shape="circle"
            icon={<AppleFilled />}
            onClick={() => handleLogin("apple")}
          />
          <Button
            shape="circle"
            icon={<FacebookFilled />}
            onClick={() => handleLogin("facebook")}
          />
          <Button
            shape="circle"
            icon={<GoogleOutlined />}
            onClick={() => handleLogin("google")}
          />
        </div>
      </Space>
    </Modal>
  );
};

export default LoginModal;
