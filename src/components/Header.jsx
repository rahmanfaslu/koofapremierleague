import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import logo from '../assets/koofa logo.png'

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Register', href: '/register' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={logo}
              alt="Koofa Premier League"
              className="h-10 md:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                className={({ isActive }) => 
                  `relative text-sm font-semibold tracking-wide uppercase transition-colors duration-300 hover:text-amber-600
                  ${isActive ? 'text-amber-600 after:w-full' : 'text-gray-700 after:w-0'}
                  after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-amber-500 after:transition-all after:duration-300 hover:after:w-full`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white border-t border-gray-100 ${
          mobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => 
                `block py-3 px-4 text-sm font-semibold tracking-wide uppercase rounded-lg transition-colors duration-200 
                ${isActive ? 'bg-amber-50 text-amber-600' : 'text-gray-700 hover:bg-amber-50 hover:text-amber-600'}`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Header
