import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import SupplyChain from './pages/SupplyChain'
import AboutPage from './pages/AboutPage'
import Methodology from './pages/Methodology'
import Database from './pages/Database'
import ContactPage from './pages/ContactPage'
import { Analytics } from '@vercel/analytics/react'

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Analytics />
      <NavBar />
      <Routes>
        <Route path="/" element={<SupplyChain />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/methodology" element={<Methodology />} />
        <Route path="/database" element={<Database />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App