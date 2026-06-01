import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Home, TableProperties, BarChart3, UserPlus, Info, CalendarDays, LogIn, HelpCircle } from 'lucide-react'
import logo from '../assets/koofa logo round.png'

function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const links = [
    { name: 'Home', to: '/', icon: Home, isAnchor: false },
    { name: 'About', to: '/#about', icon: Info, isAnchor: true },
    { name: 'Schedule', to: '/#schedule', icon: CalendarDays, isAnchor: true },
    { name: 'Fan Poll', to: '/#fan-poll', icon: HelpCircle, isAnchor: true },
    { name: 'Standings', to: '/standings', icon: TableProperties, isAnchor: false },
    { name: 'Stats', to: '/stats', icon: BarChart3, isAnchor: false },
    { name: 'Registration', to: '/registration', icon: UserPlus, isAnchor: false },
  ]

  const isActive = (link) => {
    if (link.isAnchor) return false
    return location.pathname === link.to
  }

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 right-4 z-40 p-2.5 rounded-xl bg-white/80 backdrop-blur-md border border-gray-200/80 text-gray-800 shadow-md hover:bg-gray-50 active:scale-95 transition-all duration-200"
        aria-label="Open menu"
      >
        <Menu size={22} className="text-gray-800" />
      </button>

      {/* Sidebar Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
            />

            {/* Sidebar Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-2xl md:hidden flex flex-col border-l border-gray-100"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <img
                    src={logo}
                    alt="KPL Logo"
                    className="w-8 h-8 object-contain"
                  />
                  <span className="text-sm font-bold tracking-widest text-gray-900 uppercase">
                    KPL <span className="text-amber-500">2026</span>
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {links.map((link, index) => {
                  const Icon = link.icon
                  const active = isActive(link)
                  const linkContent = (
                    <>
                      <Icon size={18} className={`${active ? 'text-amber-500' : 'text-gray-400 group-hover:text-amber-500'} transition-colors duration-200`} />
                      <span>{link.name}</span>
                    </>
                  )

                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + index * 0.05, duration: 0.25 }}
                    >
                      {link.isAnchor ? (
                        <a
                          href={link.to}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3.5 py-3 px-4 text-sm font-semibold tracking-wider text-gray-700 uppercase rounded-xl transition-all duration-200 hover:bg-amber-50 hover:text-amber-600 group"
                        >
                          {linkContent}
                        </a>
                      ) : (
                        <Link
                          to={link.to}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-3.5 py-3 px-4 text-sm font-semibold tracking-wider uppercase rounded-xl transition-all duration-200 group ${
                            active
                              ? 'bg-amber-50 text-amber-600 font-bold'
                              : 'text-gray-700 hover:bg-amber-50 hover:text-amber-600'
                          }`}
                        >
                          {linkContent}
                        </Link>
                      )}
                    </motion.div>
                  )
                })}
              </nav>

              {/* Footer Admin Link */}
              <div className="px-4 pb-8 border-t border-gray-100 pt-6">
                <Link
                  to="/admin/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 text-xs font-bold tracking-widest uppercase rounded-xl border border-gray-200 text-gray-500 transition-all duration-300 hover:border-amber-500/40 hover:text-amber-600 hover:bg-amber-50/50"
                >
                  <LogIn size={14} />
                  Admin Login
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default MobileMenu
