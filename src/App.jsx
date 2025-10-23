import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home/Home.jsx";
import UIHome from "./pages/oldHome/Home.jsx";
import Payment from "./pages/Payment/Payment.jsx";
import Callback from "./pages/Callback/Callback.jsx";
import SePayCheckout from "@/pages/Payment/components/SePayCheckout";
import GlobalMessage from "@/components/GlobalMessage/GlobalMessage";
import PaymentProcess from "@/pages/Payment/PaymentProcess.jsx";

function App() {
  const location = useLocation();

  // ✅ 不需要导航和底部的路径（比如 callback 页）
  const hideLayout = ["/auth/callback"];

  const isHideLayout = hideLayout.includes(location.pathname);

  return (
    <>
      {/* ✅ 只有在非 callback 页时才渲染 Navbar/Footer */}
      {!isHideLayout && <Navbar />}
      <GlobalMessage /> {/* 🔥 这里负责初始化全局 message */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/payment/:id" element={<Payment />} />
        <Route path="/ui" element={<UIHome />} />
        <Route path="/auth/:provider/callback" element={<Callback />} />
        <Route path="/payment/sepay/:orderId" element={<SePayCheckout />} />
        <Route path="/payment/process" element={<PaymentProcess />} />
      </Routes>

      {!isHideLayout && <Footer />}
    </>
  );
}

export default App;
