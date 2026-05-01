import { motion } from 'framer-motion'
import aboutImg from '../assets/about.png'

function About() {
  return (
    <section id="about" className="bg-amber-50 py-16 md:py-24 flex-grow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          {/* About Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="w-full md:w-1/2"
          >
            <img
              src={aboutImg}
              alt="About Koofa Premier League"
              className="w-full h-auto rounded-2xl shadow-xl"
            />
          </motion.div>

          {/* About Text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="w-full md:w-1/2 text-center md:text-left"
          >
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-6"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              About <span className="text-amber-500">KPL</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Koofa Premier League is a Kerala sevens football tournament, established in 2019, marks its 7th season—celebrating passion, talent, and the spirit of football in Kerala.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About
