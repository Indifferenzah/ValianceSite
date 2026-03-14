import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Discover from './pages/Discover'
import Privacy from './pages/Privacy'
import Cookie from './pages/Cookie'
import Terms from './pages/Terms'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/policy/privacy" element={<Privacy />} />
        <Route path="/policy/cookie" element={<Cookie />} />
        <Route path="/policy/terms" element={<Terms />} />
      </Routes>
    </BrowserRouter>
  )
}
