import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import heroBanner from '../assets/landing page.jpg'
import heroMobile from '../assets/landing mobile.jpg'
import logo from '../assets/koofa logo round.png'
import About from './About'
import Schedule from './Schedule'

function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'About', href: '#about' },
    { name: 'Schedule', href: '#schedule' },
  ]

  const routeLinks = [
    { name: 'Standings', to: '/standings' },
    { name: 'Stats', to: '/stats' },
    { name: 'Registration', to: '/registration' },
  ]

  const closeSidebar = () => setSidebarOpen(false)

  return (
    <main className="flex-grow">
      {/* Hero Section - Full Viewport */}
      <section className="relative w-full h-screen overflow-hidden">
        {/* Background Image */}
        <picture>
          <source media="(max-width: 768px) and (orientation: portrait)" srcSet={heroMobile} />
          <img
            src={heroBanner}
            alt="Koofa Premier League Ground"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </picture>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/10" />

        {/* Desktop Navigation - hidden on mobile */}
        <nav className="absolute top-0 left-0 right-0 z-20 hidden md:flex items-center justify-center gap-8 sm:gap-12 py-6 px-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm sm:text-base font-semibold tracking-widest text-white/80 uppercase transition-colors duration-300 hover:text-amber-400"
            >
              {link.name}
            </a>
          ))}
          {routeLinks.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              className="text-sm sm:text-base font-semibold tracking-widest text-white/80 uppercase transition-colors duration-300 hover:text-amber-400"
            >
              {link.name}
            </Link>
          ))}
          {/* Admin Link - Right Side */}
          <Link
            to="/admin/login"
            className="absolute right-4 sm:right-8 text-xs font-medium tracking-wide text-white/40 uppercase transition-colors duration-300 hover:text-white/80"
          >
            Admin
          </Link>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          id="mobile-menu-toggle"
          onClick={() => setSidebarOpen(true)}
          className="md:hidden absolute top-5 right-4 z-30 p-2 rounded-lg bg-black/30 backdrop-blur-sm border border-white/10 text-white transition-all duration-200 hover:bg-black/50 active:scale-95"
          aria-label="Open menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* Mobile Sidebar Overlay + Panel */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={closeSidebar}
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              />

              {/* Sidebar Panel */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                className="fixed top-0 right-0 z-50 h-full w-72 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 shadow-2xl md:hidden flex flex-col"
              >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
                  <span className="text-sm font-bold tracking-widest text-amber-400 uppercase">Menu</span>
                  <button
                    id="mobile-menu-close"
                    onClick={closeSidebar}
                    className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors duration-200"
                    aria-label="Close menu"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 px-4 py-6 space-y-1">
                  {navLinks.map((link, index) => (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      onClick={closeSidebar}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.06, duration: 0.3 }}
                      className="flex items-center gap-3 py-3.5 px-4 text-sm font-semibold tracking-widest text-white/80 uppercase rounded-xl transition-all duration-200 hover:bg-amber-500/10 hover:text-amber-400 hover:pl-5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500/50" />
                      {link.name}
                    </motion.a>
                  ))}
                  {routeLinks.map((link, index) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + (navLinks.length + index) * 0.06, duration: 0.3 }}
                    >
                      <Link
                        to={link.to}
                        onClick={closeSidebar}
                        className="flex items-center gap-3 py-3.5 px-4 text-sm font-semibold tracking-widest text-white/80 uppercase rounded-xl transition-all duration-200 hover:bg-amber-500/10 hover:text-amber-400 hover:pl-5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500/50" />
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Admin Login Button */}
                <div className="px-4 pb-8">
                  <Link
                    to="/admin/login"
                    onClick={closeSidebar}
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 text-xs font-bold tracking-widest uppercase rounded-xl border border-white/10 text-white/50 transition-all duration-300 hover:border-amber-500/40 hover:text-amber-400 hover:bg-amber-500/5"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                      <polyline points="10 17 15 12 10 7" />
                      <line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                    Admin Login
                  </Link>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Center Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
          {/* Logo */}
          <motion.img
            src={logo}
            alt="Koofa Premier League Logo"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain mb-4 drop-shadow-2xl"
          />

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-none drop-shadow-2xl"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            KOOFA
            <br />
            <span className="text-amber-400">PREMIER LEAGUE</span>
            <br />
            <span className="text-2xl sm:text-3xl md:text-5xl font-bold text-white/90 mt-2 inline-block">
              2026
            </span>
          </motion.h1>

          {/* Register Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
            className="mt-8 md:mt-10"
          >
            <Link
              to="/registration"
              className="inline-block px-8 py-3 md:px-10 md:py-4 bg-amber-500 hover:bg-amber-600 text-white text-sm md:text-base font-bold uppercase tracking-widest rounded-full shadow-lg shadow-amber-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-amber-500/40"
            >
              Register Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Sections imported as components */}
      <About />
      <Schedule />
    </main>
  )
}

export default Home
