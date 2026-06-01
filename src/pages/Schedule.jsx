import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const scheduleData = [
  {
    round: '1st Round',
    matches: [
      { home: 'Changathi Koottam', away: 'Brothers FC' },
      { home: 'Konippadi', away: 'Thavakkal FC' },
      { home: 'Winners FC', away: 'Fukri' },
    ],
  },
  {
    round: '2nd Round',
    matches: [
      { home: 'Konippadi', away: 'Changathi Koottam' },
      { home: 'Winners FC', away: 'Brothers FC' },
      { home: 'Fukri', away: 'Thavakkal FC' },
    ],
  },
  {
    round: '3rd Round',
    matches: [
      { home: 'Winners FC', away: 'Changathi Koottam' },
      { home: 'Konippadi', away: 'Fukri' },
      { home: 'Brothers FC', away: 'Thavakkal FC' },
    ],
  },
  {
    round: '4th Round',
    matches: [
      { home: 'Fukri', away: 'Changathi Koottam' },
      { home: 'Brothers FC', away: 'Konippadi' },
      { home: 'Winners FC', away: 'Thavakkal FC' },
    ],
  },
  {
    round: '5th Round',
    matches: [
      { home: 'Fukri', away: 'Brothers FC' },
      { home: 'Changathi Koottam', away: 'Thavakkal FC' },
      { home: 'Winners FC', away: 'Konippadi' },
    ],
  },
]

function Schedule() {
  const [activeRound, setActiveRound] = useState(0)

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

        {/* Round Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 md:mb-12"
        >
          {scheduleData.map((round, index) => (
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
                  {scheduleData[activeRound].round}
                </span>
                <span className="text-xs text-gray-400">
                  — {scheduleData[activeRound].matches.length} Matches
                </span>
              </div>
            </div>

            {scheduleData[activeRound].matches.map((match, index) => (
              <motion.div
                key={`${activeRound}-${index}`}
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
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-50 text-amber-600 border border-amber-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Scheduled
                  </span>
                </div>

                {/* Teams Layout */}
                <div className="flex items-center justify-between mt-7 sm:mt-6">
                  {/* Home Team */}
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-200 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm sm:text-base font-extrabold text-gray-500">
                          {match.home.charAt(0)}
                        </span>
                      </div>
                      <h3
                        className="text-sm sm:text-base font-bold text-gray-800 tracking-wide uppercase leading-tight"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        {match.home}
                      </h3>
                    </div>
                  </div>

                  {/* VS Separator */}
                  <div className="flex-shrink-0 mx-3 sm:mx-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 flex items-center justify-center shadow-sm">
                      <span className="text-xs sm:text-sm font-extrabold tracking-wider text-amber-600">
                        VS
                      </span>
                    </div>
                  </div>

                  {/* Away Team */}
                  <div className="flex-1 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <h3
                        className="text-sm sm:text-base font-bold text-gray-800 tracking-wide uppercase leading-tight"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        {match.away}
                      </h3>
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-200 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm sm:text-base font-extrabold text-gray-500">
                          {match.away.charAt(0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom accent line on hover */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-1/2 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent transition-all duration-500 rounded-full" />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

export default Schedule

