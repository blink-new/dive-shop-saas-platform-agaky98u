import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { blink } from './blink/client'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import ScheduleManagement from './pages/ScheduleManagement'
import EquipmentShop from './pages/EquipmentShop'
import BusinessProfile from './pages/BusinessProfile'
import DataManagement from './pages/DataManagement'
import LoadingScreen from './components/LoadingScreen'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/schedule" element={<ScheduleManagement />} />
          <Route path="/shop" element={<EquipmentShop />} />
          <Route path="/profile" element={<BusinessProfile />} />
          <Route path="/data" element={<DataManagement />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App