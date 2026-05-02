import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import logo from '../assets/koofa logo round.png'

function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signIn, user } = useAuth()
  const navigate = useNavigate()

  // If already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/admin/dashboard" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    const { error } = await signIn(email, password)

    if (error) {
      toast.error(error.message || 'Invalid credentials')
      setIsLoading(false)
    } else {
      toast.success('Logged in successfully')
      navigate('/admin/dashboard', { replace: true })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <img
            src={logo}
            alt="KPL Logo"
            className="w-16 h-16 mx-auto mb-4 object-contain"
          />
          <h1
            className="text-xl font-bold text-gray-900"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Admin Login
          </h1>
          <p
            className="text-sm text-gray-500 mt-1"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Koofa Premier League
          </p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4"
        >
          <div>
            <label
              htmlFor="admin-email"
              className="block text-sm font-medium text-gray-700 mb-1.5"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Email
            </label>
            <input
              type="email"
              id="admin-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="admin@example.com"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block text-sm font-medium text-gray-700 mb-1.5"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Password
            </label>
            <input
              type="password"
              id="admin-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2.5 text-white text-sm font-semibold rounded-lg transition-all duration-200 ${
              isLoading
                ? 'bg-amber-400 cursor-not-allowed'
                : 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700'
            }`}
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p
          className="text-center text-xs text-gray-400 mt-6"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Authorized personnel only
        </p>
      </div>
    </div>
  )
}

export default AdminLogin
