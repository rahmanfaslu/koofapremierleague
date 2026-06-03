import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LogOut, Search, Users, Shield, Crosshair, Footprints, X,
  ChevronDown, ChevronUp, CalendarDays, Trophy, BarChart3,
  Vote, Plus, Trash2, Edit3, Save, Goal, RectangleVertical,
  ShieldCheck, TableProperties, HelpCircle, Handshake,
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../utils/supabase'
import logo from '../assets/koofa logo round.png'

const SIDEBAR_TABS = [
  { key: 'players', label: 'Players', icon: Users },
  { key: 'standings', label: 'Standings', icon: TableProperties },
  { key: 'schedule', label: 'Schedule', icon: CalendarDays },
  { key: 'stats', label: 'Stats', icon: BarChart3 },
  { key: 'polling', label: 'Polling', icon: Vote },
]

const poppins = { fontFamily: "'Poppins', sans-serif" }

const FALLBACK_TEAMS = [
  { id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', name: 'Changathi Koottam' },
  { id: 'b2c3d4e5-f67a-8b9c-0d1e-2f3a4b5c6d7e', name: 'Brothers FC' },
  { id: 'c3d4e5f6-7a8b-9c0d-1e2f-3a4b5c6d7e8f', name: 'Konippadi' },
  { id: 'd4e5f67a-8b9c-0d1e-2f3a-4b5c6d7e8f9a', name: 'Thavakkal FC' },
  { id: 'e5f67a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b', name: 'Winners FC' },
  { id: 'f67a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c', name: 'Fukri' }
]

function SectionCard({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
      {children}
    </div>
  )
}

function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h2 className="text-base font-semibold text-gray-900" style={poppins}>{title}</h2>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5" style={poppins}>{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

function InputField({ label, ...props }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={poppins}>{label}</label>
      <input
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
        style={poppins}
        {...props}
      />
    </div>
  )
}

function SelectField({ label, children, ...props }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={poppins}>{label}</label>
      <select
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all appearance-none"
        style={poppins}
        {...props}
      >
        {children}
      </select>
    </div>
  )
}

function ActionButton({ children, variant = 'primary', className = '', ...props }) {
  const base = 'inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 cursor-pointer'
  const variants = {
    primary: 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
    danger: 'bg-red-50 hover:bg-red-100 text-red-600',
  }
  return (
    <button className={`${base} ${variants[variant]} ${className}`} style={poppins} {...props}>
      {children}
    </button>
  )
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className={color}>{icon}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900" style={poppins}>{value}</p>
      <p className="text-xs text-gray-500 mt-0.5" style={poppins}>{label}</p>
    </div>
  )
}

// ─── PLAYERS TAB ────────────────────────────────
function PlayersTab({ players, loading, searchQuery, setSearchQuery, filteredPlayers, handleSort, sortField, sortDirection, setSelectedImage, formatDate }) {
  const SortIcon = ({ field }) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? <ChevronUp size={14} className="inline ml-1" /> : <ChevronDown size={14} className="inline ml-1" />
  }

  const stats = useMemo(() => {
    const total = players.length
    const byPos = (p) => players.filter(pl => pl.position === p).length
    return { total, gk: byPos('Goalkeeper'), def: byPos('Defender'), mid: byPos('Midfielder'), fwd: byPos('Forward') }
  }, [players])

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        <StatCard label="Total Players" value={stats.total} icon={<Users size={18} />} color="text-gray-700" />
        <StatCard label="Goalkeepers" value={stats.gk} icon={<Shield size={18} />} color="text-amber-600" />
        <StatCard label="Defenders" value={stats.def} icon={<Shield size={18} />} color="text-blue-600" />
        <StatCard label="Midfielders" value={stats.mid} icon={<Crosshair size={18} />} color="text-green-600" />
        <StatCard label="Forwards" value={stats.fwd} icon={<Footprints size={18} />} color="text-red-600" />
      </div>

      <SectionCard>
        <SectionHeader
          title="Registered Players"
          subtitle={`${filteredPlayers.length} player${filteredPlayers.length !== 1 ? 's' : ''}`}
          action={
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                style={poppins}
              />
            </div>
          }
        />

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="w-7 h-7 border-3 border-gray-300 border-t-amber-500 rounded-full animate-spin" />
              <p className="text-sm text-gray-400" style={poppins}>Loading players...</p>
            </div>
          </div>
        ) : filteredPlayers.length === 0 ? (
          <div className="text-center py-20">
            <Users size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-gray-400" style={poppins}>
              {searchQuery ? 'No players found matching your search' : 'No players registered yet'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wider" style={poppins}>#</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wider" style={poppins}>Photo</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wider cursor-pointer hover:text-gray-700 select-none" style={poppins} onClick={() => handleSort('name')}>Name <SortIcon field="name" /></th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wider cursor-pointer hover:text-gray-700 select-none" style={poppins} onClick={() => handleSort('phone')}>Phone <SortIcon field="phone" /></th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wider cursor-pointer hover:text-gray-700 select-none" style={poppins} onClick={() => handleSort('position')}>Position <SortIcon field="position" /></th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wider" style={poppins}>Payment</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wider cursor-pointer hover:text-gray-700 select-none" style={poppins} onClick={() => handleSort('created_at')}>Registered <SortIcon field="created_at" /></th>
                </tr>
              </thead>
              <tbody>
                {filteredPlayers.map((player, index) => (
                  <tr key={player.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors duration-100">
                    <td className="py-3 px-4 text-gray-400" style={poppins}>{index + 1}</td>
                    <td className="py-3 px-4">
                      {player.photo_url ? (
                        <img src={player.photo_url} alt={player.name} className="w-9 h-9 rounded-full object-cover border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setSelectedImage({ url: player.photo_url, title: `${player.name} — Photo` })} />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs font-medium">{player.name?.charAt(0)?.toUpperCase() || '?'}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900" style={poppins}>{player.name}</td>
                    <td className="py-3 px-4 text-gray-600" style={poppins}>{player.phone}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                        player.position === 'Goalkeeper' ? 'bg-amber-50 text-amber-700' :
                        player.position === 'Defender' ? 'bg-blue-50 text-blue-700' :
                        player.position === 'Midfielder' ? 'bg-green-50 text-green-700' :
                        player.position === 'Forward' ? 'bg-red-50 text-red-700' :
                        'bg-gray-50 text-gray-700'
                      }`} style={poppins}>{player.position}</span>
                    </td>
                    <td className="py-3 px-4">
                      {player.payment_url ? (
                        <button onClick={() => setSelectedImage({ url: player.payment_url, title: `${player.name} — Payment` })} className="text-xs text-amber-600 hover:text-amber-700 font-medium underline underline-offset-2 cursor-pointer" style={poppins}>View</button>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-500" style={poppins}>{formatDate(player.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </>
  )
}

// ─── STANDINGS TAB ──────────────────────────────
function StandingsTab({ teams }) {
  const activeTeams = teams && teams.length > 0 ? teams : FALLBACK_TEAMS
  const [standings, setStandings] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    fetchAdminStandings()
  }, [teams])

  const fetchAdminStandings = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("standings")
        .select(`
          *,
          team:team_id(name)
        `)
        .order("pts", { ascending: false })
        .order("gd", { ascending: false })
        .order("gf", { ascending: false })

      if (!error && data && data.length > 0) {
        const formatted = data.map((row, idx) => ({
          id: row.id,
          pos: idx + 1,
          team: row.team?.name || 'Unknown Team',
          team_id: row.team_id,
          mp: row.mp ?? 0,
          w: row.w ?? 0,
          d: row.d ?? 0,
          l: row.l ?? 0,
          gf: row.gf ?? 0,
          ga: row.ga ?? 0,
          gd: row.gd ?? 0,
          pts: row.pts ?? 0,
        }))
        setStandings(formatted)
      } else {
        const initial = activeTeams.map((t, idx) => ({
          id: t.id,
          pos: idx + 1,
          team: t.name,
          team_id: t.id,
          mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0,
        }))
        setStandings(initial)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (id, field, value) => {
    setStandings(prev => prev.map(row =>
      row.id === id ? { ...row, [field]: parseInt(value) || 0 } : row
    ))
  }

  const handleSave = async () => {
    try {
      for (const row of standings) {
        const payload = {
          team_id: row.team_id,
          mp: row.mp,
          w: row.w,
          d: row.d,
          l: row.l,
          gf: row.gf,
          ga: row.ga,
          pts: row.w * 3 + row.d
        }

        const { error } = await supabase
          .from("standings")
          .upsert([payload], { onConflict: 'team_id' })

        if (error) throw error
      }
      toast.success('Standings saved successfully!')
      setEditingId(null)
      fetchAdminStandings()
    } catch (e) {
      console.error(e)
      toast.error('Failed to save standings')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 bg-white border border-gray-200 rounded-xl">
        <div className="w-8 h-8 border-3 border-gray-200 border-t-amber-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <SectionCard>
      <SectionHeader
        title="League Standings"
        subtitle="Edit team stats directly — GD and PTS are auto-calculated"
        action={<ActionButton onClick={handleSave}><Save size={14} /> Save All</ActionButton>}
      />
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              {['Pos', 'Team', 'MP', 'W', 'D', 'L', 'GF', 'GA', 'GD', 'PTS', ''].map(h => (
                <th key={h} className="text-left py-3 px-3 font-medium text-gray-500 text-[10px] uppercase tracking-wider" style={poppins}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {standings.map((row, index) => {
              const isEditing = editingId === row.id
              const gd = row.gf - row.ga
              const pts = row.w * 3 + row.d
              return (
                <tr key={row.id} className={`border-b border-gray-50 transition-colors ${isEditing ? 'bg-amber-50/30' : 'hover:bg-gray-50/50'}`}>
                  <td className="py-3 px-3 font-bold text-gray-800" style={poppins}>{index + 1}</td>
                  <td className="py-3 px-3 font-semibold text-gray-900 min-w-[140px]" style={poppins}>{row.team}</td>
                  {['mp', 'w', 'd', 'l', 'gf', 'ga'].map(f => (
                    <td key={f} className="py-3 px-3">
                      {isEditing ? (
                        <input
                          type="number"
                          min="0"
                          value={row[f]}
                          onChange={(e) => handleChange(row.id, f, e.target.value)}
                          className="w-12 px-1.5 py-1 text-sm text-center border border-amber-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                        />
                      ) : (
                        <span className="text-gray-600" style={poppins}>{row[f]}</span>
                      )}
                    </td>
                  ))}
                  <td className={`py-3 px-3 font-bold ${gd > 0 ? 'text-emerald-600' : gd < 0 ? 'text-red-500' : 'text-gray-400'}`} style={poppins}>
                    {gd > 0 ? `+${gd}` : gd}
                  </td>
                  <td className="py-3 px-3 font-extrabold text-gray-900" style={poppins}>{pts}</td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => setEditingId(isEditing ? null : row.id)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isEditing ? 'text-amber-600 bg-amber-100' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}
                    >
                      <Edit3 size={14} />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </SectionCard>
  )
}

// ─── SCHEDULE TAB ───────────────────────────────
function ScheduleTab({ teams, recalculateStandings }) {
  const activeTeams = teams && teams.length > 0 ? teams : FALLBACK_TEAMS
  const [rounds, setRounds] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeRound, setActiveRound] = useState(0)

  useEffect(() => {
    fetchAdminSchedule()
  }, [])

  const fetchAdminSchedule = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("matches")
        .select("*")
        .order("round_no")

      if (error) throw error

      if (data && data.length > 0) {
        const roundsMap = {}
        data.forEach((match) => {
          const roundNo = match.round_no || 1
          if (!roundsMap[roundNo]) {
            roundsMap[roundNo] = []
          }
          roundsMap[roundNo].push({
            id: match.id,
            home_team_id: match.home_team_id || '',
            away_team_id: match.away_team_id || '',
            homeScore: match.home_score ?? '',
            awayScore: match.away_score ?? '',
            status: match.status || 'Scheduled',
          })
        })

        const getRoundSuffix = (num) => {
          if (num === 1) return 'st'
          if (num === 2) return 'nd'
          if (num === 3) return 'rd'
          return 'th'
        }

        const groupedRounds = Object.keys(roundsMap)
          .sort((a, b) => Number(a) - Number(b))
          .map((roundNo) => ({
            round: `${roundNo}${getRoundSuffix(Number(roundNo))} Round`,
            round_no: Number(roundNo),
            matches: roundsMap[roundNo],
          }))

        setRounds(groupedRounds)
      } else {
        setRounds([
          {
            round: '1st Round',
            round_no: 1,
            matches: [{ id: 'new-1', home_team_id: '', away_team_id: '', homeScore: '', awayScore: '', status: 'Scheduled' }],
          },
        ])
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to load schedule')
    } finally {
      setLoading(false)
    }
  }

  const updateMatch = (mIdx, field, value) => {
    setRounds(prev => {
      const copy = JSON.parse(JSON.stringify(prev))
      copy[activeRound].matches[mIdx][field] = value
      return copy
    })
  }

  const addMatch = () => {
    setRounds(prev => {
      const copy = JSON.parse(JSON.stringify(prev))
      copy[activeRound].matches.push({
        id: `new-${Date.now()}`,
        home_team_id: '',
        away_team_id: '',
        homeScore: '',
        awayScore: '',
        status: 'Scheduled',
      })
      return copy
    })
  }

  const removeMatch = async (mIdx) => {
    const match = rounds[activeRound].matches[mIdx]
    if (match.id && typeof match.id === 'string' && !match.id.startsWith('new-')) {
      const { error } = await supabase
        .from("matches")
        .delete()
        .eq("id", match.id)

      if (error) {
        toast.error('Failed to delete match')
        return
      }
    }

    setRounds(prev => {
      const copy = JSON.parse(JSON.stringify(prev))
      copy[activeRound].matches.splice(mIdx, 1)
      return copy
    })
    toast.success('Match removed')
  }

  const addRound = () => {
    const nextRoundNo = rounds.length + 1
    const getRoundSuffix = (num) => {
      if (num === 1) return 'st'
      if (num === 2) return 'nd'
      if (num === 3) return 'rd'
      return 'th'
    }
    setRounds(prev => [
      ...prev,
      {
        round: `${nextRoundNo}${getRoundSuffix(nextRoundNo)} Round`,
        round_no: nextRoundNo,
        matches: [{ id: `new-${Date.now()}`, home_team_id: '', away_team_id: '', homeScore: '', awayScore: '', status: 'Scheduled' }],
      },
    ])
    setActiveRound(rounds.length)
  }

  const handleSave = async () => {
    try {
      const activeMatches = rounds[activeRound]?.matches || []
      
      for (const match of activeMatches) {
        if (!match.home_team_id || !match.away_team_id) {
          toast.error("Please select both teams for all matches!")
          return
        }

        const matchPayload = {
          home_team_id: match.home_team_id,
          away_team_id: match.away_team_id,
          home_score: match.homeScore === '' ? null : Number(match.homeScore),
          away_score: match.awayScore === '' ? null : Number(match.awayScore),
          status: match.status,
          round_no: rounds[activeRound].round_no
        }

        if (match.id && typeof match.id === 'string' && !match.id.startsWith('new-')) {
          const { error } = await supabase
            .from("matches")
            .update(matchPayload)
            .eq("id", match.id)
          if (error) throw error
        } else {
          const { error } = await supabase
            .from("matches")
            .insert([matchPayload])
          if (error) throw error
        }
      }

      toast.success('Schedule saved successfully!')
      if (recalculateStandings) {
        await recalculateStandings()
      }
      fetchAdminSchedule()
    } catch (err) {
      console.error(err)
      toast.error('Failed to save schedule')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 bg-white border border-gray-200 rounded-xl">
        <div className="w-8 h-8 border-3 border-gray-200 border-t-amber-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <SectionCard>
      <SectionHeader
        title="Match Schedule"
        subtitle="Manage match fixtures, scores and statuses"
        action={
          <div className="flex gap-2">
            <ActionButton variant="secondary" onClick={addMatch}><Plus size={14} /> Add Match</ActionButton>
            <ActionButton variant="secondary" onClick={addRound}><Plus size={14} /> Add Round</ActionButton>
            <ActionButton onClick={handleSave}><Save size={14} /> Save</ActionButton>
          </div>
        }
      />

      {/* Round Tabs */}
      <div className="px-5 py-3 border-b border-gray-100 flex flex-wrap gap-2">
        {rounds.map((r, i) => (
          <button
            key={r.round}
            onClick={() => setActiveRound(i)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all border cursor-pointer ${
              activeRound === i
                ? 'bg-amber-500 text-white border-transparent shadow-sm'
                : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-amber-300 hover:text-amber-600'
            }`}
            style={poppins}
          >
            {r.round}
          </button>
        ))}
      </div>

      <div className="p-5 space-y-4">
        {rounds[activeRound]?.matches.map((match, mIdx) => (
          <div key={match.id} className="border border-gray-100 rounded-xl p-4 hover:border-amber-200 transition-all bg-gray-50/30 relative group">
            <button
              onClick={() => removeMatch(mIdx)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 size={14} />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Match {mIdx + 1}</span>
              <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border ${
                match.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                match.status === 'Live' ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' :
                'bg-amber-50 text-amber-600 border-amber-200'
              }`}>{match.status}</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 items-center">
              <div>
                <p className="text-xs text-gray-400 mb-1 font-semibold" style={poppins}>Home Team</p>
                <select
                  value={match.home_team_id}
                  onChange={(e) => updateMatch(mIdx, "home_team_id", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400 font-semibold uppercase cursor-pointer"
                  style={poppins}
                >
                  <option value="">Select Team</option>
                  {activeTeams.map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
                <input type="number" min="0" placeholder="Score" value={match.homeScore} onChange={(e) => updateMatch(mIdx, 'homeScore', e.target.value)} className="mt-2 w-20 px-2 py-1.5 text-sm text-center border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-amber-400" />
              </div>
              <div className="hidden sm:flex items-center justify-center px-2">
                <span className="text-xs font-extrabold text-gray-300 tracking-wider">VS</span>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1 font-semibold sm:text-right" style={poppins}>Away Team</p>
                <select
                  value={match.away_team_id}
                  onChange={(e) => updateMatch(mIdx, "away_team_id", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400 font-semibold uppercase cursor-pointer sm:text-right"
                  style={poppins}
                >
                  <option value="">Select Team</option>
                  {activeTeams.map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
                <input type="number" min="0" placeholder="Score" value={match.awayScore} onChange={(e) => updateMatch(mIdx, 'awayScore', e.target.value)} className="mt-2 w-20 px-2 py-1.5 text-sm text-center border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-amber-400 sm:ml-auto" />
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100">
              <SelectField label="Status" value={match.status} onChange={(e) => updateMatch(mIdx, 'status', e.target.value)}>
                <option value="Scheduled">Scheduled</option>
                <option value="Live">Live</option>
                <option value="Completed">Completed</option>
              </SelectField>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

// ─── STATS TAB ──────────────────────────────────
function StatsTab({ teams, players }) {
  const activeTeams = teams && teams.length > 0 ? teams : FALLBACK_TEAMS
  const [showPlayerModal, setShowPlayerModal] = useState(false)
  const [activeModalIndex, setActiveModalIndex] = useState(null)
  const [modalSearch, setModalSearch] = useState('')

  const teamsMap = useMemo(() => {
    const map = {}
    activeTeams.forEach(t => {
      map[t.id] = t.name
    })
    return map
  }, [activeTeams])

  const filteredModalPlayers = useMemo(() => {
    if (!players) return []
    const q = modalSearch.toLowerCase().trim()
    if (!q) return players
    return players.filter(p => 
      p.name?.toLowerCase().includes(q) || 
      p.position?.toLowerCase().includes(q) ||
      p.phone?.toLowerCase().includes(q)
    )
  }, [players, modalSearch])

  const categories = [
    { key: 'topScorer', label: 'Top Scorers', icon: <Goal size={16} />, statLabel: 'Goals' },
    { key: 'assists', label: 'Assists', icon: <Handshake size={16} />, statLabel: 'Assists' },
    { key: 'redCard', label: 'Red Cards', icon: <RectangleVertical size={16} />, statLabel: 'Red Cards' },
    { key: 'yellowCard', label: 'Yellow Cards', icon: <RectangleVertical size={16} />, statLabel: 'Yellow Cards' },
    { key: 'cleanSheet', label: 'Clean Sheets', icon: <ShieldCheck size={16} />, statLabel: 'Clean Sheets' },
  ]
  const [activeCat, setActiveCat] = useState('topScorer')
  const [statsEntries, setStatsEntries] = useState({
    topScorer: [],
    assists: [],
    redCard: [],
    yellowCard: [],
    cleanSheet: [],
  })
  const [loading, setLoading] = useState(true)

  const [summaryStats, setSummaryStats] = useState({
    matchesPlayed: 0,
    goalsScored: 0,
    redCards: 0,
    cleanSheets: 0,
    assists: 0,
  })

  useEffect(() => {
    fetchAdminStats()
  }, [])

  const fetchAdminStats = async () => {
    try {
      setLoading(true)
      
      const { data: sumData, error: sumError } = await supabase.from('tournament_stats').select('*')
      if (sumError) throw sumError

      if (sumData && sumData.length > 0) {
        const s = sumData[0]
        setSummaryStats({
          id: s.id,
          matchesPlayed: s.matches_played ?? 0,
          goalsScored: s.goals_scored ?? 0,
          redCards: s.red_cards ?? 0,
          cleanSheets: s.clean_sheets ?? 0,
          assists: s.assists ?? 0,
        })
      }

      const { data: pStats, error: pStatsError } = await supabase
        .from('player_stats')
        .select(`
          id,
          goals,
          yellow_cards,
          red_cards,
          clean_sheets,
          assists,
          player:player_id(id, name, team_id)
        `)

      if (pStatsError) throw pStatsError

      if (pStats) {
        const categoriesMap = {
          topScorer: 'goals',
          assists: 'assists',
          redCard: 'red_cards',
          yellowCard: 'yellow_cards',
          cleanSheet: 'clean_sheets',
        }

        const entriesMap = {
          topScorer: [],
          assists: [],
          redCard: [],
          yellowCard: [],
          cleanSheet: [],
        }

        Object.keys(categoriesMap).forEach(catKey => {
          const field = categoriesMap[catKey]
          const list = pStats
            .filter(r => r[field] > 0)
            .map(row => ({
              id: row.id,
              player_id: row.player?.id || '',
              name: row.player?.name || '',
              team_id: row.player?.team_id || '',
              stat: row[field] ?? 0
            }))

          entriesMap[catKey] = list.length > 0 ? list : [{ player_id: '', name: '', team_id: '', stat: 0 }]
        })

        setStatsEntries(entriesMap)
      }
    } catch (e) {
      console.error(e)
      toast.error('Failed to load stats: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  const addEntry = () => {
    setStatsEntries(prev => ({
      ...prev,
      [activeCat]: [...prev[activeCat], { player_id: '', name: '', team_id: activeTeams[0]?.id || '', stat: 0 }],
    }))
  }

  const removeEntry = async (idx) => {
    const entry = statsEntries[activeCat][idx]
    if (entry.id) {
      const { error } = await supabase.from('player_stats').delete().eq('id', entry.id)
      if (error) {
        toast.error('Failed to delete player stat: ' + error.message)
        return
      }
    }
    setStatsEntries(prev => ({
      ...prev,
      [activeCat]: prev[activeCat].filter((_, i) => i !== idx),
    }))
    toast.success('Player entry removed')
  }

  const updateEntry = (idx, field, value) => {
    setStatsEntries(prev => ({
      ...prev,
      [activeCat]: prev[activeCat].map((e, i) => i === idx ? { ...e, [field]: field === 'stat' ? (parseInt(value) || 0) : value } : e),
    }))
  }

  const handleSaveStats = async () => {
    try {
      const summaryPayload = {
        matches_played: summaryStats.matchesPlayed,
        goals_scored: summaryStats.goalsScored,
        red_cards: summaryStats.redCards,
        clean_sheets: summaryStats.cleanSheets,
        assists: summaryStats.assists,
      }

      if (summaryStats.id) {
        const { error: sumErr } = await supabase.from('tournament_stats').update(summaryPayload).eq('id', summaryStats.id)
        if (sumErr) throw sumErr
      } else {
        const { error: sumErr } = await supabase.from('tournament_stats').insert([summaryPayload])
        if (sumErr) throw sumErr
      }

      const activeEntries = statsEntries[activeCat] || []
      const fieldMap = {
        topScorer: 'goals',
        assists: 'assists',
        redCard: 'red_cards',
        yellowCard: 'yellow_cards',
        cleanSheet: 'clean_sheets',
      }
      const fieldName = fieldMap[activeCat]

      for (const entry of activeEntries) {
        if (!entry.name) continue

        let pId = entry.player_id
        if (!pId) {
          const { data: pExist } = await supabase.from('players').select('id').eq('name', entry.name).single()
          if (pExist) {
            pId = pExist.id
          } else {
            const { data: pNew, error: pErr } = await supabase
              .from('players')
              .insert([{ name: entry.name, team_id: entry.team_id || null }])
              .select('id')
              .single()
            if (pErr) throw pErr
            pId = pNew.id
          }
        }

        // Always ensure the player's team_id is updated in the database players table!
        const { error: pUpdateErr } = await supabase
          .from('players')
          .update({ team_id: entry.team_id || null })
          .eq('id', pId)
        if (pUpdateErr) throw pUpdateErr

        const statsPayload = {
          player_id: pId,
          [fieldName]: entry.stat
        }

        // Deduplicate: Check if there's already an existing player_stats row for this player to update
        let targetId = entry.id
        if (!targetId) {
          const { data: existingStat, error: existErr } = await supabase
            .from('player_stats')
            .select('id')
            .eq('player_id', pId)
            .maybeSingle()

          if (!existErr && existingStat) {
            targetId = existingStat.id
          }
        }

        if (targetId) {
          const { error: updateErr } = await supabase.from('player_stats').update(statsPayload).eq('id', targetId)
          if (updateErr) throw updateErr
        } else {
          const { error: insertErr } = await supabase.from('player_stats').insert([statsPayload])
          if (insertErr) throw insertErr
        }
      }

      toast.success('Stats and tournament summary saved successfully!')
      fetchAdminStats()
    } catch (e) {
      console.error(e)
      toast.error('Failed to save tournament statistics: ' + e.message)
    }
  }

  const currentCat = categories.find(c => c.key === activeCat)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 bg-white border border-gray-200 rounded-xl">
        <div className="w-8 h-8 border-3 border-gray-200 border-t-amber-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <SectionCard>
        <SectionHeader title="Tournament Summary" subtitle="Overall tournament statistics" action={<ActionButton onClick={handleSaveStats}><Save size={14} /> Save Summary</ActionButton>} />
        <div className="p-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <InputField label="Matches Played" type="number" min="0" value={summaryStats.matchesPlayed} onChange={(e) => setSummaryStats(p => ({ ...p, matchesPlayed: parseInt(e.target.value) || 0 }))} />
          <InputField label="Goals Scored" type="number" min="0" value={summaryStats.goalsScored} onChange={(e) => setSummaryStats(p => ({ ...p, goalsScored: parseInt(e.target.value) || 0 }))} />
          <InputField label="Assists" type="number" min="0" value={summaryStats.assists} onChange={(e) => setSummaryStats(p => ({ ...p, assists: parseInt(e.target.value) || 0 }))} />
          <InputField label="Red Cards" type="number" min="0" value={summaryStats.redCards} onChange={(e) => setSummaryStats(p => ({ ...p, redCards: parseInt(e.target.value) || 0 }))} />
          <InputField label="Clean Sheets" type="number" min="0" value={summaryStats.cleanSheets} onChange={(e) => setSummaryStats(p => ({ ...p, cleanSheets: parseInt(e.target.value) || 0 }))} />
        </div>
      </SectionCard>

      {/* Leaderboard Management */}
      <SectionCard>
        <SectionHeader
          title="Leaderboard Management"
          subtitle={`Manage ${currentCat?.label} leaderboard`}
          action={<ActionButton onClick={handleSaveStats}><Save size={14} /> Save Leaderboard</ActionButton>}
        />

        {/* Category Tabs */}
        <div className="px-5 py-3 border-b border-gray-100 flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCat(cat.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all border cursor-pointer ${
                activeCat === cat.key
                  ? 'bg-amber-500 text-white border-transparent shadow-sm'
                  : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-amber-300'
              }`}
              style={poppins}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        <div className="p-5 space-y-3">
          {statsEntries[activeCat]?.map((entry, idx) => (
            <div key={idx} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_80px_40px] gap-3 items-end p-3 bg-gray-50/50 rounded-xl border border-gray-100">
              <div className="w-full">
                <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={poppins}>Player Name</label>
                <input
                  type="text"
                  placeholder="Click to select player"
                  value={entry.name}
                  readOnly
                  onClick={() => {
                    setActiveModalIndex(idx)
                    setShowPlayerModal(true)
                    setModalSearch('')
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all cursor-pointer hover:bg-gray-50/50 font-semibold"
                  style={poppins}
                />
              </div>
              <SelectField label="Team" value={entry.team_id} onChange={(e) => updateEntry(idx, 'team_id', e.target.value)}>
                <option value="">Select Team</option>
                {activeTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </SelectField>
              <InputField label={currentCat?.statLabel} type="number" min="0" value={entry.stat} onChange={(e) => updateEntry(idx, 'stat', e.target.value)} />
              <button onClick={() => removeEntry(idx)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors self-end mb-0.5 cursor-pointer">
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          <ActionButton variant="secondary" onClick={addEntry}>
            <Plus size={14} /> Add Player
          </ActionButton>
        </div>
      </SectionCard>

      {/* Player Selection Modal */}
      {showPlayerModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowPlayerModal(false)}>
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[85vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-bold text-gray-900" style={poppins}>Select Registered Player</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Choose a player to assign stats</p>
              </div>
              <button onClick={() => setShowPlayerModal(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-50 transition-colors"><X size={18} /></button>
            </div>
            
            {/* Search Input */}
            <div className="p-4 border-b border-gray-50 bg-gray-50/50 relative">
              <Search size={16} className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search player by name, position..."
                value={modalSearch}
                onChange={(e) => setModalSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                style={poppins}
                autoFocus
              />
            </div>

            {/* Players List */}
            <div className="flex-1 overflow-y-auto p-3 max-h-[400px] space-y-1 bg-white">
              {filteredModalPlayers.length === 0 ? (
                <div className="text-center py-10">
                  <Users size={32} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-xs text-gray-400" style={poppins}>No players found matching your search</p>
                </div>
              ) : (
                filteredModalPlayers.map(p => (
                  <div
                    key={p.id}
                    onClick={() => {
                      updateEntry(activeModalIndex, 'name', p.name)
                      updateEntry(activeModalIndex, 'team_id', p.team_id || '')
                      updateEntry(activeModalIndex, 'player_id', p.id)
                      setShowPlayerModal(false)
                    }}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-amber-50/50 border border-transparent hover:border-amber-100 transition-all cursor-pointer group"
                  >
                    {/* Photo */}
                    {p.photo_url || p.photo ? (
                      <img src={p.photo_url || p.photo} alt={p.name} className="w-9 h-9 rounded-full object-cover border border-gray-100 flex-shrink-0" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center font-extrabold text-xs text-amber-600 flex-shrink-0">
                        {p.name?.charAt(0)?.toUpperCase()}
                      </div>
                    )}

                    {/* Name & Team */}
                    <div className="flex-grow min-w-0">
                      <p className="text-xs font-bold text-gray-900 group-hover:text-amber-800 transition-colors truncate" style={poppins}>{p.name}</p>
                      <p className="text-[10px] text-gray-400 truncate" style={poppins}>
                        {teamsMap[p.team_id] || 'Unassigned Team'}
                      </p>
                    </div>

                    {/* Position Badge */}
                    <span className="text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-gray-50 border border-gray-200 text-gray-500 flex-shrink-0 group-hover:bg-amber-100 group-hover:text-amber-700 group-hover:border-amber-200 transition-colors" style={poppins}>
                      {p.position || 'Player'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── POLLING TAB ────────────────────────────────
function PollingTab({ teams }) {
  const activeTeams = teams && teams.length > 0 ? teams : FALLBACK_TEAMS
  const [pollQuestion, setPollQuestion] = useState('Who will win KPL 2026?')
  const [pollOptions, setPollOptions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminPoll()
  }, [])

  const fetchAdminPoll = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("poll_options")
        .select(`
          id,
          votes,
          team:team_id(name)
        `)

      if (!error && data && data.length > 0) {
        const formatted = data.map(row => ({
          id: row.id,
          team: row.team?.name || 'Unknown Team',
          votes: row.votes ?? 0
        }))
        setPollOptions(formatted)
      } else {
        const fallback = activeTeams.map(t => ({
          id: t.id,
          team: t.name,
          votes: 0
        }))
        setPollOptions(fallback)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const totalVotes = pollOptions.reduce((a, b) => a + b.votes, 0)

  const updateVotes = (idx, value) => {
    setPollOptions(prev => prev.map((o, i) => i === idx ? { ...o, votes: parseInt(value) || 0 } : o))
  }

  const handleSavePoll = async () => {
    try {
      for (const opt of pollOptions) {
        if (!opt.id) continue
        await supabase
          .from('poll_options')
          .update({ votes: opt.votes })
          .eq('id', opt.id)
      }
      toast.success('Poll settings and votes saved successfully!')
      fetchAdminPoll()
    } catch (e) {
      console.error(e)
      toast.error('Failed to save poll votes')
    }
  }

  const handleResetPoll = async () => {
    try {
      for (const opt of pollOptions) {
        if (!opt.id) continue
        await supabase
          .from('poll_options')
          .update({ votes: 0 })
          .eq('id', opt.id)
      }
      toast.success('All votes have been reset!')
      fetchAdminPoll()
    } catch (e) {
      console.error(e)
      toast.error('Failed to reset poll votes')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 bg-white border border-gray-200 rounded-xl">
        <div className="w-8 h-8 border-3 border-gray-200 border-t-amber-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <SectionCard>
      <SectionHeader
        title="Fan Poll Management"
        subtitle="Control the championship poll on the home page"
        action={<ActionButton onClick={handleSavePoll}><Save size={14} /> Save</ActionButton>}
      />

      <div className="p-5 space-y-6">
        {/* Poll Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Poll Question" value={pollQuestion} onChange={(e) => setPollQuestion(e.target.value)} />
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={poppins}>Poll Status</label>
            <div className="flex items-center gap-3 mt-1">
              <button
                className="flex-1 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wide border transition-all bg-emerald-500 text-white border-transparent cursor-pointer"
                style={poppins}
              >
                Active
              </button>
              <button
                className="flex-1 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wide border transition-all bg-gray-50 text-gray-500 border-gray-200 cursor-pointer"
                style={poppins}
              >
                Closed
              </button>
            </div>
          </div>
        </div>

        {/* Vote Counts */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider" style={poppins}>Vote Counts</h4>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">{totalVotes.toLocaleString()} Total Votes</span>
          </div>
          <div className="space-y-3">
            {pollOptions.map((opt, idx) => {
              const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0
              return (
                <div key={opt.id} className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl border border-gray-100">
                  <span className="text-sm font-bold text-gray-900 min-w-[140px]" style={poppins}>{opt.team}</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs font-bold text-gray-500 w-10 text-right">{pct}%</span>
                  <input type="number" min="0" value={opt.votes} onChange={(e) => updateVotes(idx, e.target.value)} className="w-16 px-2 py-1.5 text-sm text-center border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-amber-400" />
                </div>
              )
            })}
          </div>
        </div>

        {/* Reset Votes */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-400" style={poppins}>Resetting will clear all vote counts to zero</p>
          <ActionButton variant="danger" onClick={handleResetPoll}>
            <Trash2 size={14} /> Reset All Votes
          </ActionButton>
        </div>
      </div>
    </SectionCard>
  )
}

// ─── MAIN DASHBOARD ─────────────────────────────
function AdminDashboard() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('players')
  const [players, setPlayers] = useState([])
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState('created_at')
  const [sortDirection, setSortDirection] = useState('desc')
  const [selectedImage, setSelectedImage] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    fetchPlayers()
    fetchTeams()
  }, [])

  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .order("name")

      if (error) {
        console.error("Error fetching teams from Supabase:", error)
        toast.error("Failed to load teams from database: " + error.message)
        return
      }

      console.log("Teams fetched from database in Admin:", data)
      if (data && data.length > 0) {
        setTeams(data)
      } else {
        // Teams table is empty! Let's automatically seed the 6 core KPL teams with the correct UUIDs
        console.log("Teams table is empty in Supabase. Auto-seeding core teams...")
        const defaultTeams = [
          { id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', name: 'Changathi Koottam' },
          { id: 'b2c3d4e5-f67a-8b9c-0d1e-2f3a4b5c6d7e', name: 'Brothers FC' },
          { id: 'c3d4e5f6-7a8b-9c0d-1e2f-3a4b5c6d7e8f', name: 'Konippadi' },
          { id: 'd4e5f67a-8b9c-0d1e-2f3a-4b5c6d7e8f9a', name: 'Thavakkal FC' },
          { id: 'e5f67a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b', name: 'Winners FC' },
          { id: 'f67a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c', name: 'Fukri' }
        ]

        const { data: seeded, error: seedError } = await supabase
          .from("teams")
          .insert(defaultTeams)
          .select()

        if (seedError) {
          console.error("Error auto-seeding teams:", seedError)
          toast.error("Database teams table is empty, and auto-seeding failed: " + seedError.message)
        } else if (seeded && seeded.length > 0) {
          toast.success("Successfully seeded default KPL teams in database!")
          setTeams(seeded)

          // Now let's also check and seed the poll_options table so fans can vote!
          try {
            const { data: existingPolls } = await supabase.from("poll_options").select("id")
            if (!existingPolls || existingPolls.length === 0) {
              const defaultPollOptions = seeded.map(t => ({
                team_id: t.id,
                votes: 0
              }))
              const { error: pollSeedError } = await supabase.from("poll_options").insert(defaultPollOptions)
              if (pollSeedError) {
                console.error("Error seeding poll options:", pollSeedError)
              } else {
                console.log("Successfully seeded default poll options!")
              }
            }
          } catch (e) {
            console.error("Error checking/seeding poll options:", e)
          }
        }
      }
    } catch (err) {
      console.error("Exception in fetchTeams:", err)
    }
  }

  const recalculateStandings = async () => {
    try {
      // 1. Fetch all matches
      const { data: matches, error: matchesError } = await supabase
        .from("matches")
        .select("*")

      if (matchesError) throw matchesError

      // 2. Fetch all teams
      const { data: dbTeams, error: teamsError } = await supabase
        .from("teams")
        .select("*")

      if (teamsError) throw teamsError

      const activeTeamsList = dbTeams && dbTeams.length > 0 ? dbTeams : FALLBACK_TEAMS

      // 3. Initialize standing records for all teams
      const standingsMap = {}
      activeTeamsList.forEach(team => {
        standingsMap[team.id] = {
          team_id: team.id,
          mp: 0,
          w: 0,
          d: 0,
          l: 0,
          gf: 0,
          ga: 0,
          pts: 0
        }
      })

      // 4. Process completed matches
      const completedMatches = (matches || []).filter(m => m.status === 'Completed' || m.status === 'completed')

      completedMatches.forEach(match => {
        const homeId = match.home_team_id
        const awayId = match.away_team_id
        const homeScore = Number(match.home_score ?? 0)
        const awayScore = Number(match.away_score ?? 0)

        if (homeId && awayId) {
          if (!standingsMap[homeId]) {
            standingsMap[homeId] = { team_id: homeId, mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 }
          }
          if (!standingsMap[awayId]) {
            standingsMap[awayId] = { team_id: awayId, mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 }
          }

          standingsMap[homeId].mp += 1
          standingsMap[awayId].mp += 1

          standingsMap[homeId].gf += homeScore
          standingsMap[homeId].ga += awayScore
          standingsMap[awayId].gf += awayScore
          standingsMap[awayId].ga += homeScore

          if (homeScore > awayScore) {
            standingsMap[homeId].w += 1
            standingsMap[homeId].pts += 3
            standingsMap[awayId].l += 1
          } else if (awayScore > homeScore) {
            standingsMap[awayId].w += 1
            standingsMap[awayId].pts += 3
            standingsMap[homeId].l += 1
          } else {
            standingsMap[homeId].d += 1
            standingsMap[homeId].pts += 1
            standingsMap[awayId].d += 1
            standingsMap[awayId].pts += 1
          }
        }
      })

      // 5. Calculate goal differences and build payload
      const standingsPayload = Object.values(standingsMap).map(row => {
        return {
          team_id: row.team_id,
          mp: row.mp,
          w: row.w,
          d: row.d,
          l: row.l,
          gf: row.gf,
          ga: row.ga,
          gd: row.gf - row.ga,
          pts: row.pts
        }
      })

      // 6. Save (upsert) to Supabase standings table
      if (standingsPayload.length > 0) {
        const { error: upsertError } = await supabase
          .from("standings")
          .upsert(standingsPayload, { onConflict: 'team_id' })

        if (upsertError) throw upsertError
        console.log("Standings successfully recalculated and saved!")
      }
    } catch (err) {
      console.error("Error in recalculateStandings:", err)
      toast.error("Failed to automatically recalculate standings: " + err.message)
    }
  }

  const fetchPlayers = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('players').select('*').order('created_at', { ascending: false })
    if (error) { toast.error('Failed to load players'); console.error(error) }
    else { setPlayers(data || []) }
    setLoading(false)
  }

  const filteredPlayers = useMemo(() => {
    let result = players
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(p => p.name?.toLowerCase().includes(q) || p.phone?.toLowerCase().includes(q) || p.position?.toLowerCase().includes(q))
    }
    result = [...result].sort((a, b) => {
      const aVal = a[sortField] || ''
      const bVal = b[sortField] || ''
      return sortDirection === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1)
    })
    return result
  }, [players, searchQuery, sortField, sortDirection])

  const handleSort = (field) => {
    if (sortField === field) setSortDirection(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDirection('asc') }
  }

  const handleLogout = async () => {
    const { error } = await signOut()
    if (error) toast.error('Logout failed')
    else navigate('/admin/login', { replace: true })
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const currentTabInfo = SIDEBAR_TABS.find(t => t.key === activeTab)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar — Desktop */}
      <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-gray-200 fixed inset-y-0 left-0 z-30">
        <div className="flex items-center gap-2.5 px-5 h-14 border-b border-gray-100">
          <img src={logo} alt="KPL" className="w-8 h-8 object-contain" />
          <span className="text-sm font-bold text-gray-900" style={poppins}>KPL <span className="text-amber-500">Admin</span></span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {SIDEBAR_TABS.map(tab => {
            const Icon = tab.icon
            const active = activeTab === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  active
                    ? 'bg-amber-50 text-amber-700 shadow-sm border border-amber-100'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800 border border-transparent'
                }`}
                style={poppins}
              >
                <Icon size={18} className={active ? 'text-amber-500' : 'text-gray-400'} />
                {tab.label}
              </button>
            )
          })}
        </nav>
        <div className="px-4 pb-4 border-t border-gray-100 pt-3">
          <div className="text-[11px] text-gray-400 truncate mb-2" style={poppins}>{user?.email}</div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-gray-100 cursor-pointer"
            style={poppins}
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-white shadow-2xl flex flex-col z-50">
            <div className="flex items-center justify-between px-5 h-14 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <img src={logo} alt="KPL" className="w-7 h-7 object-contain" />
                <span className="text-sm font-bold text-gray-900" style={poppins}>KPL <span className="text-amber-500">Admin</span></span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"><X size={18} /></button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {SIDEBAR_TABS.map(tab => {
                const Icon = tab.icon
                const active = activeTab === tab.key
                return (
                  <button
                    key={tab.key}
                    onClick={() => { setActiveTab(tab.key); setSidebarOpen(false) }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                      active ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800 border border-transparent'
                    }`}
                    style={poppins}
                  >
                    <Icon size={18} className={active ? 'text-amber-500' : 'text-gray-400'} />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
            <div className="px-4 pb-4">
              <button onClick={handleLogout} className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-gray-100 cursor-pointer" style={poppins}>
                <LogOut size={14} /> Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-60">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100">
                <CalendarDays size={20} />
              </button>
              <div className="flex items-center gap-2">
                {currentTabInfo && <currentTabInfo.icon size={18} className="text-amber-500" />}
                <h1 className="text-base font-bold text-gray-900" style={poppins}>{currentTabInfo?.label || 'Dashboard'}</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 hidden sm:block" style={poppins}>{user?.email}</span>
              <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer" style={poppins}>
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === 'players' && (
            <PlayersTab
              players={players}
              loading={loading}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filteredPlayers={filteredPlayers}
              handleSort={handleSort}
              sortField={sortField}
              sortDirection={sortDirection}
              setSelectedImage={setSelectedImage}
              formatDate={formatDate}
            />
          )}
          {activeTab === 'standings' && <StandingsTab teams={teams} />}
          {activeTab === 'schedule' && <ScheduleTab teams={teams} recalculateStandings={recalculateStandings} />}
          {activeTab === 'stats' && <StatsTab teams={teams} players={players} />}
          {activeTab === 'polling' && <PollingTab teams={teams} />}
        </main>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900" style={poppins}>{selectedImage.title}</h3>
              <button onClick={() => setSelectedImage(null)} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={18} /></button>
            </div>
            <div className="p-4 flex items-center justify-center">
              <img src={selectedImage.url} alt={selectedImage.title} className="max-w-full max-h-[60vh] object-contain rounded" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
