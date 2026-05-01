import { Toaster } from 'react-hot-toast'
import './App.css'
import Footer from './components/Footer'
import Home from './pages/Home'

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Toaster position="top-center" reverseOrder={false} />
      <Home />
      <Footer />
    </div>
  )
}

export default App
