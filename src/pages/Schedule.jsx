import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../utils/supabase'
import { CalendarDays } from 'lucide-react'

function Schedule() {
  const [activeRound, setActiveRound] = useState(0)
  const [rounds, setRounds] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSchedule() {
      try {
        setLoading(true)

        // Fetch real matches from DB
        const { data: matchesData, error } = await supabase
          .from("matches")
          .select(`
            *,
            home_team:home_team_id(name,logo),
            away_team:away_team_id(name,logo)
          `)
          .order("round_no")

        if (error) throw error

        if (matchesData && matchesData.length > 0) {
          const roundsMap = {}
          matchesData.forEach((match) => {
            const roundNo = match.round_no || 1
            if (!roundsMap[roundNo]) {
              roundsMap[roundNo] = []
            }
            roundsMap[roundNo].push({
              id: match.id,
              home: match.home_team?.name || 'Unknown Team',
              homeLogo: match.home_team?.logo,
              away: match.away_team?.name || 'Unknown Team',
              awayLogo: match.away_team?.logo,
              homeScore: match.home_score,
              awayScore: match.away_score,
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
              matches: roundsMap[roundNo],
            }))

          setRounds(groupedRounds)
        } else {
          setRounds([])
        }
      } catch (err) {
        console.error('Error fetching matches:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSchedule()
  }, [])

  const currentSchedule = rounds

  return (
    <section id="schedule" className="bg-gray-50 py-16 md:py-24 relative overflow-hidden">
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

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
            Match <span className="text-amber-500">Schedule</span>
          </h2>
          <p className="text-gray-500 text-sm sm:text-base max-w-lg mx-auto">
            Complete fixture list for Koofa Premier League 2026
          </p>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-amber-500 rounded-full animate-spin" />
            <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>Loading Schedule...</p>
          </div>
        ) : currentSchedule.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
            <CalendarDays className="w-12 h-12 stroke-[1.5] mb-2 opacity-55 text-amber-500 animate-pulse" />
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>No matches scheduled yet</p>
          </div>
        ) : (
          <>
            {/* Round Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              viewport={{ once: true }}
              className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 md:mb-12"
            >
              {currentSchedule.map((round, index) => (
                <button
                  key={round.round}
                  onClick={() => setActiveRound(index)}
                  className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide uppercase transition-all duration-300 border ${
                    activeRound === index
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-transparent shadow-lg shadow-amber-500/25'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-amber-300 hover:text-amber-600 shadow-sm'
                  }`}
                >
                  {round.round}
                </button>
              ))}
            </motion.div>

            {/* Match Cards */}
            <AnimatePresence mode="wait">
              {currentSchedule[activeRound] && (
                <motion.div
                  key={activeRound}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="space-y-4"
                >
                  {/* Round Title Badge */}
                  <div className="flex items-center justify-center mb-6">
                    <div className="flex items-center gap-3 px-5 py-2 bg-white border border-gray-200 rounded-full shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      <span className="text-xs font-bold tracking-[0.2em] text-gray-700 uppercase">
                        {currentSchedule[activeRound].round}
                      </span>
                      <span className="text-xs text-gray-400">
                        — {currentSchedule[activeRound].matches.length} Matches
                      </span>
                    </div>
                  </div>

                  {currentSchedule[activeRound].matches.map((match, index) => {
                    const homeScoreNum = Number(match.homeScore ?? 0)
                    const awayScoreNum = Number(match.awayScore ?? 0)
                    const isHomeWinner = homeScoreNum > awayScoreNum
                    const isAwayWinner = awayScoreNum > homeScoreNum

                    return (
                      <motion.div
                        key={match.id || `${activeRound}-${index}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.35, delay: index * 0.08 }}
                        className="relative bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-amber-200 transition-all duration-300 group"
                      >
                        {/* Match Number */}
                        <div className="absolute top-3 left-4 sm:top-4 sm:left-5">
                          <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                            Match {index + 1}
                          </span>
                        </div>

                        {/* Status Badge */}
                        <div className="absolute top-3 right-4 sm:top-4 sm:right-5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
                            match.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                            match.status === 'Live' ? 'bg-red-50 text-red-600 border-red-200' :
                            'bg-amber-50 text-amber-600 border-amber-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              match.status === 'Completed' ? 'bg-emerald-500' :
                              match.status === 'Live' ? 'bg-red-500 animate-pulse' :
                              'bg-amber-500'
                            }`} />
                            {match.status}
                          </span>
                        </div>

                        {/* Teams Layout */}
                        <div className="flex items-center justify-between mt-7 sm:mt-6">
                          {/* Home Team */}
                          <div className="flex-1 text-left">
                            <div className="flex items-center gap-3">
                              {match.homeLogo ? (
                                <img
                                  src={match.homeLogo}
                                  alt={match.home}
                                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-gray-200 flex-shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 flex-shrink-0 flex items-center justify-center">
                                  <span className="text-sm sm:text-base font-extrabold text-amber-600">
                                    {match.home.charAt(0)}
                                  </span>
                                </div>
                              )}
                              <div className="flex flex-col">
                                <h3
                                  className={`text-sm sm:text-base uppercase tracking-wide leading-tight transition-all duration-300 ${
                                    match.status === 'Completed'
                                      ? (isHomeWinner ? 'font-bold text-[#22c55e]' : 'opacity-70 font-medium text-gray-500')
                                      : 'font-bold text-gray-800'
                                  }`}
                                  style={{ fontFamily: "'Poppins', sans-serif" }}
                                >
                                  {match.home}
                                </h3>
                                {match.status === 'Completed' && isHomeWinner && (
                                  <span className="text-[9px] font-bold text-green-600 uppercase tracking-widest mt-0.5">Winner</span>
                                )}
                              </div>

                              {/* Home Score next to team name */}
                              {(match.status === 'Completed' || match.status === 'Live') && (
                                <span className={`text-base sm:text-lg font-black ml-auto ${
                                  match.status === 'Completed'
                                    ? (isHomeWinner ? 'text-[#22c55e]' : 'text-gray-400')
                                    : 'text-gray-800'
                                }`}>
                                  {match.homeScore ?? 0}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* VS / Score Separator in the center */}
                          <div className="flex-shrink-0 mx-3 sm:mx-6">
                            {match.status === 'Live' ? (
                              <div className="w-16 h-12 sm:w-20 sm:h-14 rounded-full bg-red-50 border border-red-200 flex flex-col items-center justify-center shadow-sm relative">
                                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                                <span className="text-[9px] font-extrabold text-red-600 tracking-wider uppercase animate-pulse">LIVE</span>
                                <span className="text-xs font-bold text-red-400 uppercase tracking-widest -mt-0.5">VS</span>
                              </div>
                            ) : match.status === 'Completed' ? (
                              <div className="w-16 h-12 sm:w-20 sm:h-14 rounded-full bg-emerald-50 border border-emerald-200 flex flex-col items-center justify-center shadow-sm">
                                <span className="text-[9px] font-bold text-emerald-600 tracking-wider uppercase">FT</span>
                                <span className="text-[10px] font-black text-emerald-700 tracking-widest -mt-0.5">FT</span>
                              </div>
                            ) : (
                              <div className="w-16 h-12 sm:w-20 sm:h-14 rounded-full bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 flex items-center justify-center shadow-sm">
                                <span className="text-xs sm:text-sm font-extrabold tracking-wider text-amber-600">
                                  VS
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Away Team */}
                          <div className="flex-1 text-right">
                            <div className="flex items-center justify-end gap-3">
                              {/* Away Score next to team name */}
                              {(match.status === 'Completed' || match.status === 'Live') && (
                                <span className={`text-base sm:text-lg font-black mr-auto ${
                                  match.status === 'Completed'
                                    ? (isAwayWinner ? 'text-[#22c55e]' : 'text-gray-400')
                                    : 'text-gray-800'
                                }`}>
                                  {match.awayScore ?? 0}
                                </span>
                              )}

                              <div className="flex flex-col text-right">
                                <h3
                                  className={`text-sm sm:text-base uppercase tracking-wide leading-tight transition-all duration-300 ${
                                    match.status === 'Completed'
                                      ? (isAwayWinner ? 'font-bold text-[#22c55e]' : 'opacity-70 font-medium text-gray-500')
                                      : 'font-bold text-gray-800'
                                  }`}
                                  style={{ fontFamily: "'Poppins', sans-serif" }}
                                >
                                  {match.away}
                                </h3>
                                {match.status === 'Completed' && isAwayWinner && (
                                  <span className="text-[9px] font-bold text-green-600 uppercase tracking-widest mt-0.5">Winner</span>
                                )}
                              </div>

                              {match.awayLogo ? (
                                <img
                                  src={match.awayLogo}
                                  alt={match.away}
                                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-gray-200 flex-shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 flex-shrink-0 flex items-center justify-center">
                                  <span className="text-sm sm:text-base font-extrabold text-amber-600">
                                    {match.away.charAt(0)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Bottom accent line on hover */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-1/2 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent transition-all duration-500 rounded-full" />
                      </motion.div>
                    )
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </section>
  )
}

export default Schedule


