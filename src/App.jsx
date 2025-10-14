import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home/Home.jsx'
// import UIHome from './pages/UiHome/Home.jsx'
import Payment from './pages/Payment/Payment.jsx'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/" element={<Payment />} />
        {/* <Route path="/ui" element={<UIHome />} /> */}
      </Routes>
      <Footer />
    </>
  )
}

export default App
