import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../utils/supabase'
import MobileMenu from '../components/MobileMenu'
import {
  Goal,
  RectangleVertical,
  TriangleAlert,
  ShieldCheck,
  Handshake,
  ClipboardList,
  Trophy,
} from 'lucide-react'

const placeholderImage = 'https://ui-avatars.com/api/?background=f59e0b&color=fff&bold=true&size=128&name='

const statsConfig = {
  topScorer: {
    label: 'Top Scorer',
    statLabel: 'Goals',
    icon: Goal,
    color: 'from-amber-500 to-orange-500',
    borderColor: 'border-amber-300',
    bgAccent: 'bg-amber-500',
    iconColor: 'text-amber-500',
    lightBg: 'bg-amber-50',
  },
  redCard: {
    label: 'Red Card',
    statLabel: 'Red Cards',
    icon: RectangleVertical,
    color: 'from-red-500 to-rose-600',
    borderColor: 'border-red-300',
    bgAccent: 'bg-red-500',
    iconColor: 'text-red-500',
    lightBg: 'bg-red-50',
  },
  yellowCard: {
    label: 'Yellow Card',
    statLabel: 'Yellow Cards',
    icon: TriangleAlert,
    color: 'from-yellow-400 to-amber-500',
    borderColor: 'border-yellow-300',
    bgAccent: 'bg-yellow-500',
    iconColor: 'text-yellow-500',
    lightBg: 'bg-yellow-50',
  },
  cleanSheet: {
    label: 'Clean Sheets',
    statLabel: 'Clean Sheets',
    icon: ShieldCheck,
    color: 'from-emerald-500 to-green-600',
    borderColor: 'border-emerald-300',
    bgAccent: 'bg-emerald-500',
    iconColor: 'text-emerald-500',
    lightBg: 'bg-emerald-50',
  },
  assists: {
    label: 'Assists',
    statLabel: 'Assists',
    icon: Handshake,
    color: 'from-blue-500 to-indigo-600',
    borderColor: 'border-blue-300',
    bgAccent: 'bg-blue-500',
    iconColor: 'text-blue-500',
    lightBg: 'bg-blue-50',
  },
}

const tabs = [
  { key: 'topScorer', label: 'Top Scorer' },
  { key: 'assists', label: 'Assists' },
  { key: 'redCard', label: 'Red Card' },
  { key: 'yellowCard', label: 'Yellow Card' },
  { key: 'cleanSheet', label: 'Clean Sheets' },
]

function PlayerImage({ src, name, size = 'md' }) {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24 sm:w-28 sm:h-28',
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 flex-shrink-0`}>
      <img
        src={src || `${placeholderImage}${encodeURIComponent(name)}`}
        alt={name}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.src = `${placeholderImage}${encodeURIComponent(name)}`
        }}
      />
    </div>
  )
}

function RankBadge({ rank }) {
  const badgeColors = {
    1: 'bg-amber-500 text-white',
    2: 'bg-gray-400 text-white',
    3: 'bg-amber-700 text-white',
  }

  return (
    <span
      className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold flex-shrink-0 ${
        badgeColors[rank] || 'bg-gray-200 text-gray-500'
      }`}
    >
      {rank}
    </span>
  )
}

function Stats() {
  const [activeTab, setActiveTab] = useState('topScorer')
  const [stats, setStats] = useState(null)
  const [summaryStats, setSummaryStats] = useState({
    matchesPlayed: 0,
    goalsScored: 0,
    redCards: 0,
    cleanSheets: 0,
    assists: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true)

        // 1. Fetch all teams to map team_id to team name & logo
        const { data: teamsData } = await supabase
          .from('teams')
          .select('id, name, logo')

        const teamsMap = {}
        teamsData?.forEach((team) => {
          teamsMap[team.id] = { name: team.name, logo: team.logo }
        })

        // 2. Fetch tournament summary stats
        const { data: summaryData } = await supabase
          .from('tournament_stats')
          .select('*')

        if (summaryData && summaryData.length > 0) {
          const s = summaryData[0]
          setSummaryStats({
            matchesPlayed: s.matches_played ?? 0,
            goalsScored: s.goals_scored ?? 0,
            redCards: s.red_cards ?? 0,
            cleanSheets: s.clean_sheets ?? 0,
            assists: s.assists ?? 0,
          })
        }

        // 3. Fetch player stats ordered by respective fields
        const { data: statsData, error: statsError } = await supabase
          .from('player_stats')
          .select(`
            goals,
            yellow_cards,
            red_cards,
            clean_sheets,
            assists,
            player:player_id(
              id,
              name,
              team_id,
              photo_url,
              position
            )
          `)

        if (statsError) throw statsError

        const processLeaderboard = (field) => {
          if (!statsData) return []
          const filtered = statsData
            .filter((row) => row[field] > 0)
            .sort((a, b) => (b[field] || 0) - (a[field] || 0))

          return filtered.map((row, idx) => ({
            rank: idx + 1,
            name: row.player?.name || 'Unknown Player',
            team: teamsMap[row.player?.team_id]?.name || 'Unknown Team',
            stat: row[field] || 0,
            image: row.player?.photo_url || null,
          }))
        }

        setStats({
          topScorer: processLeaderboard('goals'),
          redCard: processLeaderboard('red_cards'),
          yellowCard: processLeaderboard('yellow_cards'),
          cleanSheet: processLeaderboard('clean_sheets'),
          assists: processLeaderboard('assists'),
        })
      } catch (err) {
        console.error('Error fetching statistics:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const currentConfig = statsConfig[activeTab]
  const IconComponent = currentConfig.icon

  const currentLeaderboard = stats ? stats[activeTab] : []
  const featuredPlayer = currentLeaderboard.length > 0
    ? currentLeaderboard[0]
    : {
        name: 'No Active Leader',
        team: 'Tournament in Progress',
        stat: 0,
        image: null,
      }

  const summaryCards = [
    { label: 'Matches Played', value: summaryStats.matchesPlayed, icon: ClipboardList, iconColor: 'text-amber-500' },
    { label: 'Goals Scored', value: summaryStats.goalsScored, icon: Goal, iconColor: 'text-orange-500' },
    { label: 'Assists', value: summaryStats.assists, icon: Handshake, iconColor: 'text-blue-500' },
    { label: 'Clean Sheets', value: summaryStats.cleanSheets, icon: ShieldCheck, iconColor: 'text-emerald-500' },
  ]

  return (
    <section
      id="stats"
      className="bg-gray-50 py-16 md:py-24 relative overflow-hidden"
    >
      <MobileMenu />
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #e5e7eb 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute top-20 left-0 w-[500px] h-[500px] bg-amber-200/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-0 w-[500px] h-[500px] bg-orange-200/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-3"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Tournament <span className="text-amber-500">Stats</span>
          </h2>
          <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
            Live statistics and leaderboards from Koofa Premier League 2026
          </p>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10 md:mb-14"
        >
          {summaryCards.map((card, i) => {
            const CardIcon = card.icon
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
                viewport={{ once: true }}
                className="relative bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 group hover:border-amber-200 hover:shadow-md transition-all duration-300 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] sm:text-xs font-semibold tracking-widest text-gray-400 uppercase">
                    {card.label}
                  </span>
                  <CardIcon
                    className={`w-5 h-5 ${card.iconColor} opacity-60 group-hover:opacity-100 transition-opacity duration-300`}
                  />
                </div>
                <span className="text-3xl sm:text-4xl font-extrabold text-gray-900">{card.value}</span>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-2 sm:gap-3 mb-8 md:mb-10"
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide uppercase transition-all duration-300 border ${
                activeTab === tab.key
                  ? `bg-gradient-to-r ${statsConfig[tab.key].color} text-white border-transparent shadow-lg shadow-amber-500/20`
                  : 'bg-white text-gray-500 border-gray-200 hover:border-amber-300 hover:text-amber-600 shadow-sm'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-amber-500 rounded-full animate-spin" />
            <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>Loading Statistics...</p>
          </div>
        ) : (
          /* Main Content */
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6"
            >
              {/* Featured Player Card */}
              <div
                className={`lg:col-span-2 relative bg-white border ${currentConfig.borderColor} rounded-2xl p-6 sm:p-8 overflow-hidden shadow-sm`}
              >
                {/* Decorative gradient blob */}
                <div
                  className={`absolute -top-20 -right-20 w-48 h-48 bg-gradient-to-br ${currentConfig.color} rounded-full opacity-10 blur-3xl`}
                />

                <span className="inline-block text-[10px] sm:text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-6">
                  Featured {currentConfig.label}
                </span>

                <div className="relative flex flex-col items-center text-center">
                  {/* Player Image */}
                  <div className="relative mb-5">
                    <PlayerImage
                      src={featuredPlayer.image}
                      name={featuredPlayer.name}
                      size="lg"
                    />
                    {currentLeaderboard.length > 0 && (
                      <div
                        className={`absolute -bottom-1 -right-1 flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r ${currentConfig.color} text-white text-[10px] font-bold shadow-lg`}
                      >
                        <Trophy className="w-3 h-3" /> #1
                      </div>
                    )}
                  </div>

                  {/* Player Info */}
                  <h3
                    className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-wide mb-1"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {featuredPlayer.name}
                  </h3>
                  <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-6">
                    {featuredPlayer.team}
                  </p>

                  {/* Stat Circle */}
                  <div
                    className={`w-24 h-24 rounded-full bg-gradient-to-br ${currentConfig.color} flex flex-col items-center justify-center shadow-xl`}
                  >
                    <span className="text-3xl font-extrabold text-white leading-none">
                      {featuredPlayer.stat ?? 0}
                    </span>
                    <span className="text-[9px] font-bold tracking-widest text-white/70 uppercase mt-0.5">
                      {currentConfig.statLabel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Leaderboard */}
              <div className="lg:col-span-3 bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 shadow-sm">
                <span className="inline-block text-[10px] sm:text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-5">
                  Top Five
                </span>

                {currentLeaderboard.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <IconComponent className="w-12 h-12 stroke-[1.5] mb-2 opacity-55 text-amber-500" />
                    <p className="text-sm font-semibold uppercase tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>No stats recorded yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {currentLeaderboard.slice(0, 5).map((player, index) => (
                      <motion.div
                        key={`${activeTab}-${player.rank}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.06 }}
                        className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl transition-all duration-300 ${
                          player.rank === 1
                            ? `${currentConfig.lightBg} border ${currentConfig.borderColor}`
                            : 'bg-gray-50/50 hover:bg-gray-100/80 border border-transparent hover:border-gray-200'
                        }`}
                      >
                        {/* Rank */}
                        <RankBadge rank={player.rank} />

                        {/* Player Image */}
                        <PlayerImage
                          src={player.image}
                          name={player.name}
                          size="sm"
                        />

                        {/* Player Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm sm:text-base font-bold text-gray-800 truncate tracking-wide">
                            {player.name}
                          </h4>
                          <p className="text-[10px] sm:text-xs font-medium tracking-wider text-gray-400 uppercase truncate">
                            {player.team}
                          </p>
                        </div>

                        {/* Stat */}
                        <div className="text-right flex-shrink-0">
                          <span className="text-xl sm:text-2xl font-extrabold text-gray-900">
                            {player.stat}
                          </span>
                          <p className="text-[9px] sm:text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                            {currentConfig.statLabel}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  )
}

export default Stats

