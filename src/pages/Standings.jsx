import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../utils/supabase'
import logo from '../assets/koofa logo round.png'
import MobileMenu from '../components/MobileMenu'

const fallbackStandings = [
  {
    pos: 1,
    team: 'Changathi Koottam',
    mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0,
    form: [],
  },
  {
    pos: 2,
    team: 'Brothers FC',
    mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0,
    form: [],
  },
  {
    pos: 3,
    team: 'Konippadi',
    mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0,
    form: [],
  },
  {
    pos: 4,
    team: 'Thavakkal FC',
    mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0,
    form: [],
  },
  {
    pos: 5,
    team: 'Winners FC',
    mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0,
    form: [],
  },
  {
    pos: 6,
    team: 'Fukri',
    mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0,
    form: [],
  },
]

const formBadge = {
  W: 'bg-emerald-500 text-white',
  D: 'bg-amber-400 text-white',
  L: 'bg-red-500 text-white',
}

function Standings() {
  const [standings, setStandings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStandings() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from("standings")
          .select(`
            *,
            team:team_id(name,logo)
          `)
          .order("pts", { ascending: false })
          .order("gd", { ascending: false })
          .order("gf", { ascending: false })

        if (error) throw error

        if (data && data.length > 0) {
          const formatted = data.map((row, idx) => ({
            pos: idx + 1,
            team: row.team?.name || 'Unknown Team',
            logo: row.team?.logo,
            mp: row.mp ?? 0,
            w: row.w ?? 0,
            d: row.d ?? 0,
            l: row.l ?? 0,
            gf: row.gf ?? 0,
            ga: row.ga ?? 0,
            gd: row.gd ?? ((row.gf ?? 0) - (row.ga ?? 0)),
            pts: row.pts ?? 0,
            form: Array.isArray(row.form) ? row.form : (row.form ? row.form.split(',') : []),
          }))
          setStandings(formatted)
        } else {
          setStandings([])
        }
      } catch (err) {
        console.error('Error fetching standings:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStandings()
  }, [])

  const currentStandings = standings.length > 0 ? standings : fallbackStandings

  return (
    <section className="min-h-screen bg-gray-50 py-16 md:py-24 relative overflow-hidden">
      <MobileMenu />
      {/* Subtle background */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #e5e7eb 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute top-20 left-0 w-[500px] h-[500px] bg-amber-200/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-0 w-[500px] h-[500px] bg-orange-200/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-12 md:mb-14"
        >
          <div className="flex items-center gap-4 mb-4">
            <img
              src={logo}
              alt="KPL Logo"
              className="w-12 h-12 drop-shadow-md"
            />
            <div>
              <p className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-amber-600 uppercase">
                Season Table
              </p>
              <h1
                className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Standings
              </h1>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-amber-500 rounded-full animate-spin" />
            <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>Loading Standings...</p>
          </div>
        ) : (
          /* Standings Table */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
          >
            {/* Table Header */}
            <div className="hidden sm:grid grid-cols-[60px_1fr_50px_50px_50px_50px_50px_50px_50px_60px] items-center px-5 py-3.5 bg-gray-50 border-b border-gray-100">
              <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Pos</span>
              <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Team</span>
              <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase text-center">MP</span>
              <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase text-center">W</span>
              <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase text-center">D</span>
              <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase text-center">L</span>
              <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase text-center">GF</span>
              <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase text-center">GA</span>
              <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase text-center">GD</span>
              <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase text-center">PTS</span>
            </div>

            {/* Table Rows */}
            {currentStandings.map((team, index) => (
              <motion.div
                key={team.team}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.2 + index * 0.06 }}
                className={`group transition-all duration-200 hover:bg-amber-50/50 ${
                  index !== currentStandings.length - 1 ? 'border-b border-gray-50' : ''
                }`}
              >
                {/* Desktop Row */}
                <div className="hidden sm:grid grid-cols-[60px_1fr_50px_50px_50px_50px_50px_50px_50px_60px] items-center px-5 py-4">
                  {/* Position */}
                  <div className="flex items-center">
                    <div className={`w-1 h-10 rounded-full mr-3 ${
                      index < 2 ? 'bg-emerald-500' :
                      index === currentStandings.length - 1 ? 'bg-red-500' :
                      'bg-gray-200'
                    }`} />
                    <span className="text-base font-extrabold text-gray-800">{index + 1}</span>
                  </div>

                  {/* Team Logo, Name & Form */}
                  <div className="flex items-center gap-3">
                    {team.logo ? (
                      <img
                        src={team.logo}
                        alt={team.team}
                        className="w-9 h-9 rounded-full object-cover border border-gray-100 shadow-sm flex-shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center font-extrabold text-xs text-amber-600 flex-shrink-0">
                        {team.team.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3
                        className="text-sm font-bold text-gray-800 uppercase tracking-wide"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        {team.team}
                      </h3>
                      {team.form.length > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          {team.form.map((result, i) => (
                            <span
                              key={i}
                              className={`w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-bold ${formBadge[result]}`}
                            >
                              {result}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <span className="text-sm font-semibold text-gray-600 text-center">{team.mp}</span>
                  <span className="text-sm font-semibold text-gray-600 text-center">{team.w}</span>
                  <span className="text-sm font-semibold text-gray-600 text-center">{team.d}</span>
                  <span className="text-sm font-semibold text-gray-600 text-center">{team.l}</span>
                  <span className="text-sm font-semibold text-gray-600 text-center">{team.gf}</span>
                  <span className="text-sm font-semibold text-gray-600 text-center">{team.ga}</span>
                  <span className={`text-sm font-bold text-center ${
                    team.gd > 0 ? 'text-emerald-600' : team.gd < 0 ? 'text-red-500' : 'text-gray-500'
                  }`}>
                    {team.gd > 0 ? `+${team.gd}` : team.gd}
                  </span>
                  <span className="text-lg font-extrabold text-gray-900 text-center">{team.pts}</span>
                </div>

                {/* Mobile Row */}
                <div className="sm:hidden px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center">
                        <div className={`w-1 h-10 rounded-full mr-2 ${
                          index < 2 ? 'bg-emerald-500' :
                          index === currentStandings.length - 1 ? 'bg-red-500' :
                          'bg-gray-200'
                        }`} />
                        <span className="text-lg font-extrabold text-gray-800 w-6">{index + 1}</span>
                      </div>
                      
                      {team.logo ? (
                        <img
                          src={team.logo}
                          alt={team.team}
                          className="w-9 h-9 rounded-full object-cover border border-gray-100 shadow-sm flex-shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center font-extrabold text-xs text-amber-600 flex-shrink-0">
                          {team.team.charAt(0)}
                        </div>
                      )}

                      <div>
                        <h3
                          className="text-sm font-bold text-gray-800 uppercase tracking-wide"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          {team.team}
                        </h3>
                        <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-400">
                          <span>MP {team.mp}</span>
                          <span>W {team.w}</span>
                          <span>D {team.d}</span>
                          <span>L {team.l}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-extrabold text-gray-900">{team.pts}</span>
                      <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">PTS</p>
                    </div>
                  </div>
                  {/* Mobile extra stats */}
                  <div className="flex items-center gap-4 mt-2 ml-9 text-[11px] text-gray-400">
                    <span>GF {team.gf}</span>
                    <span>GA {team.ga}</span>
                    <span className={`font-bold ${
                      team.gd > 0 ? 'text-emerald-600' : team.gd < 0 ? 'text-red-500' : 'text-gray-400'
                    }`}>
                      GD {team.gd > 0 ? `+${team.gd}` : team.gd}
                    </span>
                  </div>
                  {team.form.length > 0 && (
                    <div className="flex items-center gap-1 mt-2 ml-9">
                      {team.form.map((result, i) => (
                        <span
                          key={i}
                          className={`w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-bold ${formBadge[result]}`}
                        >
                          {result}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-wrap items-center gap-5 mt-6 px-2"
        >
          <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-1">
              <span className="w-5 h-5 rounded-md bg-emerald-500 flex items-center justify-center text-[9px] font-bold text-white">W</span>
              <span className="text-[10px] text-gray-400">Win</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-5 h-5 rounded-md bg-amber-400 flex items-center justify-center text-[9px] font-bold text-white">D</span>
              <span className="text-[10px] text-gray-400">Draw</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-5 h-5 rounded-md bg-red-500 flex items-center justify-center text-[9px] font-bold text-white">L</span>
              <span className="text-[10px] text-gray-400">Loss</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Standings

