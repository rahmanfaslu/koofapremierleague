import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import logo from '../assets/koofa logo round.png'

const standingsData = [
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
  return (
    <section className="min-h-screen bg-gray-50 py-16 md:py-24 relative overflow-hidden">
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

        {/* Standings Table */}
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
          {standingsData.map((team, index) => (
            <motion.div
              key={team.team}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.2 + index * 0.06 }}
              className={`group transition-all duration-200 hover:bg-amber-50/50 ${
                index !== standingsData.length - 1 ? 'border-b border-gray-50' : ''
              }`}
            >
              {/* Desktop Row */}
              <div className="hidden sm:grid grid-cols-[60px_1fr_50px_50px_50px_50px_50px_50px_50px_60px] items-center px-5 py-4">
                {/* Position */}
                <div className="flex items-center">
                  <div className={`w-1 h-10 rounded-full mr-3 ${
                    index === 0 ? 'bg-emerald-500' :
                    index === 1 ? 'bg-emerald-400' :
                    index >= standingsData.length - 1 ? 'bg-red-400' :
                    'bg-gray-200'
                  }`} />
                  <span className="text-base font-extrabold text-gray-800">{team.pos}</span>
                </div>

                {/* Team Name & Form */}
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
                        index === 0 ? 'bg-emerald-500' :
                        index === 1 ? 'bg-emerald-400' :
                        index >= standingsData.length - 1 ? 'bg-red-400' :
                        'bg-gray-200'
                      }`} />
                      <span className="text-lg font-extrabold text-gray-800 w-6">{team.pos}</span>
                    </div>
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
