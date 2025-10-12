import { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import { FadeLoader } from 'react-spinners'

import Signup from './pages/SignUp'
import Login from './pages/SignIn'
import Home from './pages/Home'
import Profile from './pages/ProfilePage'
import SharedBrain from './pages/SharedBrain'
import DetailedCardView from './pages/DetailedCardView'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthContext } from './context/AuthContext'
const AppRouter = () => {
  const { loading } = useContext(AuthContext)

  if (loading) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-slate-50">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo and Title Section */}
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                  <img
                    src="/logo.png"
                    alt="Second Brain Logo"
                    className="relative w-12 h-12 rounded-2xl object-cover shadow-lg ring-1 ring-white/20"
                  />
                </div>
                <div className="flex flex-col">
                  <h1 className="font-bold text-xl bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    Second Brain
                  </h1>
                  <p className="text-xs text-slate-500 font-medium hidden sm:block">
                    Your personal knowledge hub
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Loader */}
        <div className="flex-1 flex items-center justify-center">
          <FadeLoader color="#6366f1" />
        </div>

        {/* Footer */}
        <footer className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-sm">
          <div className="text-right text-slate-500 py-2 px-4 text-sm">
            Made by <span className="font-semibold text-red-600">Adarsh</span> with ❤️
          </div>
        </footer>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/brain/:shareId" element={<SharedBrain />} />
      <Route path="/content/:contentId" element={<ProtectedRoute><DetailedCardView /></ProtectedRoute>} />
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/twitter" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/youtube" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/instagram" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/images" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/documents" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/notes" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/links" element={<ProtectedRoute><Home /></ProtectedRoute>} />
    </Routes>
  )
}

export default AppRouter