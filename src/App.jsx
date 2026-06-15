import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import SupplyChain from './pages/SupplyChain'
import AboutPage from './pages/AboutPage'
import Methodology from './pages/Methodology'

function App() {
  return (
    <BrowserRouter basename="/dal-map/">
      <NavBar />
      <Routes>
        <Route path="/" element={<SupplyChain />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/methodology" element={<Methodology />} />
        {/* add more pages here later */}
      </Routes>
    </BrowserRouter>
  )
}

export default App