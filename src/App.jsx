import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Home from "./pages/Home/Home.jsx";
import Payment from "./pages/Payment/Payment.jsx";
import Callback from "./pages/Callback/Callback.jsx";
import SePayCheckout from "@/pages/Payment/components/SePayCheckout";
import GlobalMessage from "@/components/GlobalMessage/GlobalMessage";
import PaymentProcess from "@/pages/Payment/PaymentProcess.jsx";
import PayResult from "@/pages/Payment/PayResult.jsx";
import LoginModal from "@/components/LoginModal/index.jsx";

function App() {
  const location = useLocation();
  const hideLayout = ["/auth/callback"];
  const isHideLayout = hideLayout.includes(location.pathname);

  // ✅ 全局管理登录弹窗状态
  const [loginModalState, setLoginModalState] = useState({
    visible: false,
    fromLoginBtn: false,
    gameId: null, // ✅ 新增：目标游戏ID
  });

  // ✅ 注册全局方法（给 Navbar、Home 调用）
  window.openLoginModal = (fromLoginBtn = false, gameId = null) => {
    setLoginModalState({
      visible: true,
      fromLoginBtn,
      gameId: gameId,
    });
  };

  return (
    <>
      {/* ✅ Layout */}
      {!isHideLayout && (
        <Navbar onLoginClick={() => window.openLoginModal(true)} />
      )}

      <GlobalMessage />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/payment/:id" element={<Payment />} />
        <Route path="/auth/:provider/callback" element={<Callback />} />
        <Route path="/payment/sepay/:orderId" element={<SePayCheckout />} />
        <Route path="/payment/process" element={<PaymentProcess />} />
        <Route path="/payment/order/success/:orderId" element={<PayResult />} />
        <Route path="/payment/order/cancel/:orderId" element={<PayResult />} />
      </Routes>

      {/* ✅ 全局登录弹窗 */}
      <LoginModal
        visible={loginModalState.visible}
        fromLoginBtn={loginModalState.fromLoginBtn}
        gameId={loginModalState.gameId} // ✅ 新增传参
        onClose={() =>
          setLoginModalState((prev) => ({ ...prev, visible: false }))
        }
        onLoginSuccess={() =>
          setLoginModalState((prev) => ({ ...prev, visible: false }))
        }
      />

      {!isHideLayout && <Footer />}
    </>
  );
}

export default App;
