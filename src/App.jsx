import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './App.css'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Footer from './components/Footer'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import Register from './pages/Register'
import Stats from './pages/Stats'
import Standings from './pages/Standings'

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        {/* Public - Home page */}
        <Route
          path="/"
          element={
            <div className="min-h-screen flex flex-col bg-white">
              <Home />
              <Footer />
            </div>
          }
        />

        {/* Registration Page */}
        <Route
          path="/registration"
          element={
            <div className="min-h-screen flex flex-col bg-white">
              <Register />
              <Footer />
            </div>
          }
        />

        {/* Stats Page */}
        <Route
          path="/stats"
          element={
            <div className="min-h-screen flex flex-col">
              <Stats />
              <Footer />
            </div>
          }
        />

        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Standings Page */}
        <Route
          path="/standings"
          element={
            <div className="min-h-screen flex flex-col bg-gray-50">
              <Standings />
              <Footer />
            </div>
          }
        />

        {/* Protected Admin Dashboard */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  )
}

export default App
