import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/shared/ProtectedRoute'

// Páginas públicas
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// Páginas protegidas (Lazy Loading)
const Home = lazy(() => import('./pages/home/Home'))
const Alerts = lazy(() => import('./pages/alerts/Alerts'))
const Sensors = lazy(() => import('./pages/sensors/Sensors'))
const NodeDetail = lazy(() => import('./pages/sensors/NodeDetail'))
const Reports = lazy(() => import('./pages/reports/Reports'))

const Crops = lazy(() => import('./pages/crops/Crops').then(m => ({ default: m.Crops })))
const Properties = lazy(() => import('./pages/properties/Properties').then(m => ({ default: m.Properties })))
const Plots = lazy(() => import('./pages/plots/Plots').then(m => ({ default: m.Plots })))
const Notifications = lazy(() => import('./pages/notifications/Notifications').then(m => ({ default: m.Notifications })))
const MqttPage = lazy(() => import('./pages/mqtt/MqttPage').then(m => ({ default: m.MqttPage })))
const Profile = lazy(() => import('./pages/profile/Profile').then(m => ({ default: m.Profile })))
const Telemetry = lazy(() => import('./pages/telemetry/Telemetry').then(m => ({ default: m.Telemetry })))
const PlotDetail = lazy(() => import('./pages/plots/PlotDetail').then(m => ({ default: m.PlotDetail })))

function RootRedirect() {
  const token = localStorage.getItem('token')
  return <Navigate to={token ? '/home' : '/login'} replace />
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={
          <div style={{ padding: '2rem', color: '#4ade80', textAlign: 'center', fontFamily: 'sans-serif' }}>
            Cargando módulo...
          </div>
        }>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/dashboard" element={<Navigate to="/home" replace />} />
            <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
            <Route path="/sensors" element={<ProtectedRoute><Sensors /></ProtectedRoute>} />
            <Route path="/sensors/:slaveId" element={<ProtectedRoute><NodeDetail /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />

            <Route path="/crops" element={<ProtectedRoute><Crops /></ProtectedRoute>} />
            <Route path="/properties" element={<ProtectedRoute><Properties /></ProtectedRoute>} />
            <Route path="/plots" element={<ProtectedRoute><Plots /></ProtectedRoute>} />
            <Route path="/plots/:plotId" element={<ProtectedRoute><PlotDetail /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/mqtt" element={<ProtectedRoute><MqttPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/telemetry" element={<ProtectedRoute><Telemetry /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/login" replace />} />   
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App