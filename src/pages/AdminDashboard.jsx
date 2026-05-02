import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Search, Users, Shield, Crosshair, Footprints, X, ChevronDown, ChevronUp } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../utils/supabase'
import logo from '../assets/koofa logo round.png'

function AdminDashboard() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState('created_at')
  const [sortDirection, setSortDirection] = useState('desc')
  const [selectedImage, setSelectedImage] = useState(null)

  // Fetch players from Supabase
  useEffect(() => {
    fetchPlayers()
  }, [])

  const fetchPlayers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Failed to load players')
      console.error(error)
    } else {
      setPlayers(data || [])
    }
    setLoading(false)
  }

  // Filter and sort players
  const filteredPlayers = useMemo(() => {
    let result = players

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.phone?.toLowerCase().includes(q) ||
          p.position?.toLowerCase().includes(q)
      )
    }

    // Sort
    result = [...result].sort((a, b) => {
      const aVal = a[sortField] || ''
      const bVal = b[sortField] || ''
      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1
      }
      return aVal < bVal ? 1 : -1
    })

    return result
  }, [players, searchQuery, sortField, sortDirection])

  // Stats
  const stats = useMemo(() => {
    const total = players.length
    const byPosition = (pos) => players.filter((p) => p.position === pos).length
    return {
      total,
      goalkeepers: byPosition('Goalkeeper'),
      defenders: byPosition('Defender'),
      midfielders: byPosition('Midfielder'),
      forwards: byPosition('Forward'),
    }
  }, [players])

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleLogout = async () => {
    const { error } = await signOut()
    if (error) {
      toast.error('Logout failed')
    } else {
      navigate('/admin/login', { replace: true })
    }
  }

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? (
      <ChevronUp size={14} className="inline ml-1" />
    ) : (
      <ChevronDown size={14} className="inline ml-1" />
    )
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <img src={logo} alt="KPL" className="w-8 h-8 object-contain" />
              <h1
                className="text-base font-bold text-gray-900"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                KPL Admin
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span
                className="text-sm text-gray-500 hidden sm:block"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          <StatCard
            label="Total Players"
            value={stats.total}
            icon={<Users size={18} />}
            color="text-gray-700"
            bg="bg-white"
          />
          <StatCard
            label="Goalkeepers"
            value={stats.goalkeepers}
            icon={<Shield size={18} />}
            color="text-amber-600"
            bg="bg-white"
          />
          <StatCard
            label="Defenders"
            value={stats.defenders}
            icon={<Shield size={18} />}
            color="text-blue-600"
            bg="bg-white"
          />
          <StatCard
            label="Midfielders"
            value={stats.midfielders}
            icon={<Crosshair size={18} />}
            color="text-green-600"
            bg="bg-white"
          />
          <StatCard
            label="Forwards"
            value={stats.forwards}
            icon={<Footprints size={18} />}
            color="text-red-600"
            bg="bg-white"
          />
        </div>

        {/* Players Section */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          {/* Table Header Bar */}
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2
              className="text-base font-semibold text-gray-900"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Registered Players
              <span className="text-sm font-normal text-gray-400 ml-2">
                ({filteredPlayers.length})
              </span>
            </h2>
            <div className="relative w-full sm:w-64">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by name, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              />
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-3">
                <div className="w-7 h-7 border-3 border-gray-300 border-t-amber-500 rounded-full animate-spin" />
                <p
                  className="text-sm text-gray-400"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Loading players...
                </p>
              </div>
            </div>
          ) : filteredPlayers.length === 0 ? (
            <div className="text-center py-20">
              <Users size={40} className="mx-auto text-gray-300 mb-3" />
              <p
                className="text-sm text-gray-400"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {searchQuery ? 'No players found matching your search' : 'No players registered yet'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wider"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      #
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wider"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      Photo
                    </th>
                    <th
                      className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wider cursor-pointer hover:text-gray-700 select-none"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                      onClick={() => handleSort('name')}
                    >
                      Name <SortIcon field="name" />
                    </th>
                    <th
                      className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wider cursor-pointer hover:text-gray-700 select-none"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                      onClick={() => handleSort('phone')}
                    >
                      Phone <SortIcon field="phone" />
                    </th>
                    <th
                      className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wider cursor-pointer hover:text-gray-700 select-none"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                      onClick={() => handleSort('position')}
                    >
                      Position <SortIcon field="position" />
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wider"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      Payment
                    </th>
                    <th
                      className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wider cursor-pointer hover:text-gray-700 select-none"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                      onClick={() => handleSort('created_at')}
                    >
                      Registered <SortIcon field="created_at" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPlayers.map((player, index) => (
                    <tr
                      key={player.id}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors duration-100"
                    >
                      <td className="py-3 px-4 text-gray-400" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {index + 1}
                      </td>
                      <td className="py-3 px-4">
                        {player.photo_url ? (
                          <img
                            src={player.photo_url}
                            alt={player.name}
                            className="w-9 h-9 rounded-full object-cover border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => setSelectedImage({ url: player.photo_url, title: `${player.name} — Photo` })}
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs font-medium">
                            {player.name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                        )}
                      </td>
                      <td
                        className="py-3 px-4 font-medium text-gray-900"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        {player.name}
                      </td>
                      <td
                        className="py-3 px-4 text-gray-600"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        {player.phone}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                            player.position === 'Goalkeeper'
                              ? 'bg-amber-50 text-amber-700'
                              : player.position === 'Defender'
                              ? 'bg-blue-50 text-blue-700'
                              : player.position === 'Midfielder'
                              ? 'bg-green-50 text-green-700'
                              : player.position === 'Forward'
                              ? 'bg-red-50 text-red-700'
                              : 'bg-gray-50 text-gray-700'
                          }`}
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          {player.position}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {player.payment_url ? (
                          <button
                            onClick={() => setSelectedImage({ url: player.payment_url, title: `${player.name} — Payment` })}
                            className="text-xs text-amber-600 hover:text-amber-700 font-medium underline underline-offset-2 cursor-pointer"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                          >
                            View
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td
                        className="py-3 px-4 text-gray-500"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        {formatDate(player.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h3
                className="text-sm font-semibold text-gray-900"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {selectedImage.title}
              </h3>
              <button
                onClick={() => setSelectedImage(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-4 flex items-center justify-center">
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="max-w-full max-h-[60vh] object-contain rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, icon, color, bg }) {
  return (
    <div className={`${bg} rounded-lg border border-gray-200 p-4`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`${color}`}>{icon}</span>
      </div>
      <p
        className="text-2xl font-bold text-gray-900"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {value}
      </p>
      <p
        className="text-xs text-gray-500 mt-0.5"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {label}
      </p>
    </div>
  )
}

export default AdminDashboard
