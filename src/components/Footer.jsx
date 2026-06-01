import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin } from 'lucide-react'
import logo from '../assets/koofa logo round.png'

function Footer() {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/#about' },
    { name: 'Schedule', href: '/#schedule' },
    { name: 'Standings', to: '/standings' },
    { name: 'Stats', to: '/stats' },
    { name: 'Registeration', to: '/registration' },
  ]

  const socials = [
    {
      name: 'Instagram',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
      href: 'https://instagram.com'
    },
    {
      name: 'WhatsApp',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      ),
      href: 'https://wa.me'
    },
    {
      name: 'YouTube',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
          <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
        </svg>
      ),
      href: 'https://youtube.com'
    },
    {
      name: 'Facebook',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
      href: 'https://facebook.com'
    },
  ]

  return (
    <footer className="bg-gradient-to-b from-gray-900 via-gray-950 to-black text-gray-400 border-t border-white/5 pt-16 pb-8 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
          
          {/* Logo & About Info */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="Koofa Premier League Logo"
                className="h-16 w-auto object-contain drop-shadow-[0_4px_12px_rgba(245,158,11,0.2)]"
              />
              <div>
                <h3 className="text-lg font-bold text-white tracking-widest uppercase">
                  KOOFA
                </h3>
                <p className="text-[10px] text-amber-500 font-semibold tracking-[0.2em] uppercase">
                  Premier League
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed font-light">
              Kerala's premium sevens football tournament. Established in 2019, celebrating passion, local talent, and the ultimate spirit of football.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white text-sm font-bold tracking-widest uppercase relative after:content-[''] after:absolute after:bottom-[-6px] after:left-0 after:h-[2px] after:w-8 after:bg-amber-500">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 pt-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  {link.to ? (
                    <Link
                      to={link.to}
                      className="text-sm text-gray-400 hover:text-amber-400 transition-colors duration-200 flex items-center gap-1.5 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500/30 group-hover:bg-amber-500 transition-all duration-200" />
                      {link.name}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-amber-400 transition-colors duration-200 flex items-center gap-1.5 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500/30 group-hover:bg-amber-500 transition-all duration-200" />
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-white text-sm font-bold tracking-widest uppercase relative after:content-[''] after:absolute after:bottom-[-6px] after:left-0 after:h-[2px] after:w-8 after:bg-amber-500">
              Contact Details
            </h4>
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <Phone className="text-amber-500 mt-1 flex-shrink-0" size={16} />
                <div className="text-sm space-y-1">
                  <a href="tel:7994819006" className="block hover:text-white transition-colors duration-200">
                    +91 79948 19006
                  </a>
                  <a href="tel:9633411090" className="block hover:text-white transition-colors duration-200">
                    +91 96334 11090
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="text-amber-500 flex-shrink-0" size={16} />
                <a
                  href="mailto:koofapremierleague@gmail.com"
                  className="text-sm hover:text-white transition-colors duration-200 break-all"
                >
                  koofapremierleague@gmail.com
                </a>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="text-amber-500 mt-1 flex-shrink-0" size={16} />
                <p className="text-sm leading-relaxed font-light">
                  Koofa, Malappuram,
                </p>
              </div>
            </div>
          </div>

          {/* Social Connect */}
          <div className="space-y-4">
            <h4 className="text-white text-sm font-bold tracking-widest uppercase relative after:content-[''] after:absolute after:bottom-[-6px] after:left-0 after:h-[2px] after:w-8 after:bg-amber-500">
              Connect With Us
            </h4>
            <p className="text-sm text-gray-400 font-light pt-2">
              Follow our official handles for live updates, matches, and team statistics.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-amber-500 hover:border-amber-500 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300 hover:-translate-y-1"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 text-center sm:text-left">
            &copy; {currentYear} Koofa Premier League (KPL). All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-gray-500 hover:text-amber-400 transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-gray-500 hover:text-amber-400 transition-colors duration-200">
              Terms of Service
            </a>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer
