import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, CheckCircle2, AlertCircle } from 'lucide-react'
import { supabase } from '../utils/supabase'
import { toast } from 'react-hot-toast'

function PollSection() {
  const [votedTeamId, setVotedTeamId] = useState(null)
  const [pollOptions, setPollOptions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Instantly check localStorage to see if user has already voted
    const savedVote = localStorage.getItem('kpl_fan_vote_2026')
    if (savedVote) {
      setVotedTeamId(savedVote)
    }

    // 2. Fetch latest poll option counts from Supabase
    async function fetchPollOptions() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from("poll_options")
          .select(`
            id,
            votes,
            team:team_id(name, logo)
          `)

        if (error) throw error

        if (data && data.length > 0) {
          const formatted = data.map((row) => ({
            id: row.id,
            name: row.team?.name || 'Unknown Team',
            logo: row.team?.logo,
            votes: row.votes ?? 0,
          })).sort((a, b) => a.name.localeCompare(b.name))
          setPollOptions(formatted)
        } else {
          setPollOptions([])
        }
      } catch (err) {
        console.error('Error fetching poll options:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPollOptions()
  }, [])

  const handleVote = async (optionId) => {
    // Stricter safety check: if already voted, prevent double submissions
    if (votedTeamId) return

    // 1. Update LocalStorage immediately (instant blocking on refresh)
    localStorage.setItem('kpl_fan_vote_2026', optionId)
    setVotedTeamId(optionId)

    // 2. Optimistic UI Update: increment count locally for zero-latency animation
    setPollOptions(prev => prev.map(o => o.id === optionId ? { ...o, votes: o.votes + 1 } : o))
    toast.success('Vote cast successfully!')

    try {
      const option = pollOptions.find((o) => o.id === optionId)
      if (!option) return

      // 3. Update database: increment vote count
      const { error } = await supabase
        .from('poll_options')
        .update({ votes: (option.votes || 0) + 1 })
        .eq('id', optionId)

      if (error) throw error

      // 4. Silently fetch fresh results to sync with other users' votes
      const { data: freshData } = await supabase
        .from("poll_options")
        .select(`
          id,
          votes,
          team:team_id(name, logo)
        `)

      if (freshData && freshData.length > 0) {
        const formatted = freshData.map((row) => ({
          id: row.id,
          name: row.team?.name || 'Unknown Team',
          logo: row.team?.logo,
          votes: row.votes ?? 0,
        })).sort((a, b) => a.name.localeCompare(b.name))
        setPollOptions(formatted)
      }
    } catch (err) {
      console.error('Error registering vote in database:', err)
      toast.error('Could not sync vote to server, but registered locally.')
    }
  }

  const handleChangeVote = async () => {
    if (!votedTeamId) return

    const previousOptionId = votedTeamId

    // 1. Instantly reset states locally to provide snappy, zero-latency transition back to interactive selection
    setVotedTeamId(null)
    localStorage.removeItem('kpl_fan_vote_2026')
    setPollOptions(prev => prev.map(o => o.id === previousOptionId ? { ...o, votes: Math.max(0, o.votes - 1) } : o))
    toast.success('You can now change your vote!')

    try {
      const option = pollOptions.find((o) => o.id === previousOptionId)
      if (!option) return

      // 2. Decrement the count in Supabase database
      const { error } = await supabase
        .from('poll_options')
        .update({ votes: Math.max(0, (option.votes || 0) - 1) })
        .eq('id', previousOptionId)

      if (error) throw error

      // 3. Silently fetch fresh results to make sure everything is completely in sync
      const { data: freshData } = await supabase
        .from("poll_options")
        .select(`
          id,
          votes,
          team:team_id(name, logo)
        `)

      if (freshData && freshData.length > 0) {
        const formatted = freshData.map((row) => ({
          id: row.id,
          name: row.team?.name || 'Unknown Team',
          logo: row.team?.logo,
          votes: row.votes ?? 0,
        })).sort((a, b) => a.name.localeCompare(b.name))
        setPollOptions(formatted)
      }
    } catch (err) {
      console.error('Error retracting/changing vote in database:', err)
      // Fallback is already handled locally, so no disruptive rollback is needed
    }
  }

  const currentOptions = pollOptions
  const totalVotes = currentOptions.reduce((acc, o) => acc + o.votes, 0)
  const isVoted = votedTeamId !== null

  return (
    <section id="fan-poll" className="bg-white py-16 md:py-24 relative overflow-hidden border-t border-gray-100">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #e5e7eb 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-amber-200/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-orange-200/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-amber-600 uppercase mb-3 inline-block">
            Fan Zone
          </span>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-3"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Championship <span className="text-amber-500">Fan Poll</span>
          </h2>
          <p className="text-gray-500 text-sm sm:text-base max-w-lg mx-auto">
            Cast your vote for the team you think will win the Koofa Premier League 2026 title!
          </p>
        </motion.div>

        {/* Dynamic Polling Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-10 shadow-lg"
        >
          <div className="flex items-center justify-between pb-6 border-b border-gray-100 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 border border-amber-100">
                <HelpCircle size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm sm:text-base">Who will win KPL 2026?</h3>
                <p className="text-xs text-gray-400">
                  {isVoted ? 'Thank you for voting! Here are the current results.' : 'Select a team to cast your vote.'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-extrabold text-amber-600 block leading-none">
                {totalVotes.toLocaleString()}
              </span>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Total Votes</span>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <div className="w-8 h-8 border-3 border-gray-200 border-t-amber-500 rounded-full animate-spin" />
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>Loading Poll...</p>
            </div>
          ) : pollOptions.length === 0 ? (
            <div className="text-center py-10">
              <HelpCircle className="mx-auto text-gray-300 mb-3 w-10 h-10 animate-bounce" />
              <p className="text-sm text-gray-400 font-semibold uppercase tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>
                No poll options available
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Please seed the teams and poll options in the Admin Dashboard first.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentOptions.map((team) => {
                const teamVotes = team.votes
                const percentage = totalVotes > 0 ? Math.round((teamVotes / totalVotes) * 100) : 0
                const isSelected = votedTeamId === team.id

                return (
                  <div
                    key={team.id}
                    onClick={isVoted ? undefined : () => handleVote(team.id)}
                    className={`relative overflow-hidden rounded-2xl border p-4.5 sm:p-5 transition-all duration-300 ${
                      isVoted
                        ? (isSelected ? 'border-amber-400 bg-amber-50/5 shadow-sm' : 'border-gray-100 bg-white')
                        : 'border-gray-100 hover:border-amber-200 hover:bg-gray-50/30 bg-white cursor-pointer group'
                    }`}
                  >
                    {/* Background Progress Overlay - Animated only after voting */}
                    {isVoted && (
                      <motion.div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 z-0 pointer-events-none rounded-r-xl"
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ type: 'spring', damping: 22, stiffness: 75 }}
                      />
                    )}

                    {/* Horizontal visual progress line - Animated only after voting */}
                    {isVoted && (
                      <div className="absolute bottom-0 left-0 right-0 h-[3.5px] bg-gray-100 z-0">
                        <motion.div
                          className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-r-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ type: 'spring', damping: 20, stiffness: 80 }}
                        />
                      </div>
                    )}

                    <div className="relative z-10 flex items-center justify-between">
                      {/* Team Selector & Info */}
                      <div className="flex items-center gap-3.5 sm:gap-4">
                        {/* Selector/Checkbox Indicator */}
                        {!isVoted ? (
                          <div className="w-6 h-6 rounded-full border border-gray-300 bg-white flex items-center justify-center transition-all duration-200 group-hover:border-amber-400 flex-shrink-0" />
                        ) : isSelected ? (
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 size={14} className="stroke-[3.5px]" />
                          </div>
                        ) : (
                          // Placeholder spacing for non-selected items in result view to keep layout aligned
                          <div className="w-6 h-6 flex-shrink-0" />
                        )}

                        {/* Team Logo */}
                        {team.logo ? (
                          <img
                            src={team.logo}
                            alt={team.name}
                            className="w-8 h-8 rounded-full object-cover border border-gray-200 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center font-extrabold text-[10px] text-amber-600 flex-shrink-0">
                            {team.name.charAt(0)}
                          </div>
                        )}

                        {/* Team Name */}
                        <span
                          className={`text-sm sm:text-base font-bold transition-colors ${
                            isSelected ? 'text-amber-700 font-extrabold' : 'text-gray-800'
                          }`}
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          {team.name}
                        </span>
                      </div>

                      {/* Vote Count & Percent - Animated Fade-In after voting */}
                      <AnimatePresence>
                        {isVoted && (
                          <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="flex items-center gap-3 flex-shrink-0"
                          >
                            <span className="text-xs text-gray-400 font-semibold">
                              {teamVotes.toLocaleString()} votes
                            </span>
                            <span className="text-sm sm:text-base font-extrabold text-gray-900">
                              {percentage}%
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Feedback/Prompt Badge */}
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl bg-amber-50/50 border border-amber-100 text-amber-800 text-xs sm:text-sm">
            <div className="flex items-start gap-2.5">
              <AlertCircle size={18} className="flex-shrink-0 text-amber-500 mt-0.5 animate-pulse" />
              <p className="leading-relaxed">
                {isVoted ? (
                  <span>
                    Thank you for voting! You voted for <strong className="font-extrabold text-amber-700">{currentOptions.find(t => t.id === votedTeamId)?.name || 'your chosen team'}</strong>.
                  </span>
                ) : (
                  <span>
                    Your vote is completely anonymous. Click on any of the teams above to cast your vote!
                  </span>
                )}
              </p>
            </div>
            {isVoted && (
              <button
                onClick={handleChangeVote}
                className="self-start sm:self-auto text-xs font-bold text-amber-600 hover:text-amber-700 hover:underline underline-offset-2 transition-colors flex items-center gap-1 cursor-pointer flex-shrink-0"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Change Vote
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default PollSection
