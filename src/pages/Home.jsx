import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import heroBanner from '../assets/landing page.jpg'
import heroMobile from '../assets/landing mobile.jpg'
import logo from '../assets/koofa logo round.png'
import About from './About'
import Register from './Register'

function Home() {
  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'About', href: '#about' },
    { name: 'Registration', href: '#register' },
  ]

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

        {/* Navigation Links - Simple Inline Header */}
        <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-center gap-8 sm:gap-12 py-6 px-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm sm:text-base font-semibold tracking-widest text-white/80 uppercase transition-colors duration-300 hover:text-amber-400"
            >
              {link.name}
            </a>
          ))}
          {/* Admin Link - Right Side */}
          <Link
            to="/admin/login"
            className="absolute right-4 sm:right-8 text-xs font-medium tracking-wide text-white/40 uppercase transition-colors duration-300 hover:text-white/80"
          >
            Admin
          </Link>
        </nav>

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
            <a
              href="#register"
              className="inline-block px-8 py-3 md:px-10 md:py-4 bg-amber-500 hover:bg-amber-600 text-white text-sm md:text-base font-bold uppercase tracking-widest rounded-full shadow-lg shadow-amber-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-amber-500/40"
            >
              Register Now
            </a>
          </motion.div>
        </div>
      </section>

      {/* Sections imported as components */}
      <About />
      <Register />
    </main>
  )
}

export default Home
