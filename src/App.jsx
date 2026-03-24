import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loadUser } from './features/auth/authSlice'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import SpaceDetailPage from './pages/SpaceDetailPage'
import SubscriptionPage from './pages/SubscriptionPage'
import ProtectedRoute from './components/common/ProtectedRoute'
import Spinner from './components/common/Spinner'

export default function App() {
  const dispatch = useDispatch()
  const { loading, isAuthenticated } = useSelector((s) => s.auth)

  useEffect(() => {
    dispatch(loadUser())
  }, [dispatch])

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
      }}>
        <Spinner size={40} />
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/space/:spaceId" element={<SpaceDetailPage />} />
        <Route path="/subscription" element={<SubscriptionPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
