import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, CheckCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { supabase } from '../utils/supabase'
import qrCode from '../assets/qr-code.png'

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    position: '',
    photo: null,
    paymentScreenshot: null,
  })

  const [photoPreview, setPhotoPreview] = useState(null)
  const [paymentPreview, setPaymentPreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e, field) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, [field]: file })
      const reader = new FileReader()
      reader.onloadend = () => {
        if (field === 'photo') setPhotoPreview(reader.result)
        if (field === 'paymentScreenshot') setPaymentPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const loadingToast = toast.loading('Registering player...')

    try {
      const photoFile = formData.photo
      const paymentFile = formData.paymentScreenshot

      if (!photoFile || !paymentFile) {
        toast.error('Please upload both photo and payment screenshot', { id: loadingToast })
        setIsSubmitting(false)
        return
      }

      if (photoFile.size > 5 * 1024 * 1024) {
        toast.error('Photo must be under 5MB', { id: loadingToast })
        setIsSubmitting(false)
        return
      }

      if (paymentFile.size > 5 * 1024 * 1024) {
        toast.error('Payment screenshot must be under 5MB', { id: loadingToast })
        setIsSubmitting(false)
        return
      }

      // Upload photo
      const { data: photoData, error: photoError } = await supabase.storage
        .from('photos')
        .upload(`${Date.now()}-${photoFile.name}`, photoFile)

      if (photoError) {
        toast.error('Photo upload failed', { id: loadingToast })
        setIsSubmitting(false)
        return
      }

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const photoUrl = `${supabaseUrl}/storage/v1/object/public/photos/${photoData.path}`

      // Upload payment screenshot
      const { data: paymentData, error: paymentError } = await supabase.storage
        .from('screenshots')
        .upload(`${Date.now()}-${paymentFile.name}`, paymentFile)

      if (paymentError) {
        toast.error('Payment screenshot upload failed', { id: loadingToast })
        setIsSubmitting(false)
        return
      }

      const paymentUrl = `${supabaseUrl}/storage/v1/object/public/screenshots/${paymentData.path}`

      // Insert into DB
      const { error } = await supabase.from('players').insert([
        {
          name: formData.name,
          phone: formData.phone,
          position: formData.position,
          photo_url: photoUrl,
          payment_url: paymentUrl,
        },
      ])

      if (error) {
        toast.error('Error saving data', { id: loadingToast })
      } else {
        toast.success('Registered successfully!', { id: loadingToast })
        setFormData({ name: '', phone: '', position: '', photo: null, paymentScreenshot: null })
        setPhotoPreview(null)
        setPaymentPreview(null)
      }
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong. Please try again.', { id: loadingToast })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="register" className="bg-white py-16 md:py-24 flex-grow">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Player <span className="text-amber-500">Registration</span>
          </h2>
          <p className="text-gray-500 text-base md:text-lg" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Fill in the details below to register for KPL 2026
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="bg-gray-50 rounded-2xl shadow-lg p-6 sm:p-10 space-y-6 border border-gray-100"
        >
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            />
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Enter your phone number"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            />
          </div>

          {/* Position */}
          <div>
            <label htmlFor="position" className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Position
            </label>
            <select
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 appearance-none"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <option value="">Select your position</option>
              <option value="Goalkeeper">Goalkeeper</option>
              <option value="Defender">Defender</option>
              <option value="Midfielder">Midfielder</option>
              <option value="Forward">Forward</option>
            </select>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Photo
            </label>
            <label
              htmlFor="photo"
              className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-amber-400 hover:bg-amber-50/50 transition-all duration-200 overflow-hidden"
            >
              {photoPreview ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <img src={photoPreview} alt="Photo preview" className="h-full object-contain" />
                  <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                    <CheckCircle size={16} />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <Upload size={28} />
                  <span className="text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>Click to upload your photo</span>
                </div>
              )}
              <input
                type="file"
                id="photo"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'photo')}
                className="hidden"
              />
            </label>
          </div>

          {/* Payment QR Code */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
            <h3
              className="text-lg font-bold text-gray-900 mb-1"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Pay <span className="text-amber-600">₹100</span> using this QR Code
            </h3>
            <p className="text-sm text-gray-500 mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Scan the QR code below with any UPI app and upload the payment screenshot
            </p>
            <div className="flex justify-center mb-3">
              <img
                src={qrCode}
                alt="Payment QR Code"
                className="w-48 h-48 sm:w-56 sm:h-56 rounded-lg shadow-md border border-gray-200 bg-white p-2"
              />
            </div>
            <p className="text-xs text-gray-400" style={{ fontFamily: "'Poppins', sans-serif" }}>
              UPI ID: www.mohammedrashid19@okicici
            </p>
          </div>

          {/* Payment Screenshot Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Payment Screenshot
            </label>
            <label
              htmlFor="paymentScreenshot"
              className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-amber-400 hover:bg-amber-50/50 transition-all duration-200 overflow-hidden"
            >
              {paymentPreview ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <img src={paymentPreview} alt="Payment preview" className="h-full object-contain" />
                  <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                    <CheckCircle size={16} />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <Upload size={28} />
                  <span className="text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>Click to upload payment screenshot</span>
                </div>
              )}
              <input
                type="file"
                id="paymentScreenshot"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'paymentScreenshot')}
                className="hidden"
              />
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3.5 text-white text-base font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-amber-500/20 transition-all duration-300 ${isSubmitting ? 'bg-amber-400 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-600 hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-500/30'}`}
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Registration'}
          </button>
        </motion.form>
      </div>
    </section>
  )
}

export default Register
