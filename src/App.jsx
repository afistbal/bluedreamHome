import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home/Home.jsx'
import Payment from './pages/Payment/Payment.jsx'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/" element={<Payment />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
