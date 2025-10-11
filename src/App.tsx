import "./App.css";
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ModalProvider } from './context/ModalContext'
import AppRouter from './Routes'
import ShareModal from './components/ShareModal'
import ProfileModal from './components/ProfileModal'
import LogoutModal from './components/LogoutModal'
import { useModal } from './context/useModal'

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <ModalProvider>
            <AppRouter />
            <ShareModal />
            {/* Profile modal mounted at root so it can be opened from anywhere */}
            <ModalMount />
          </ModalProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;

function ModalMount() {
  const { isProfileOpen, setIsProfileOpen, isLogoutOpen, setIsLogoutOpen } = useModal()
  return (
    <>
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      <LogoutModal open={isLogoutOpen} onClose={() => setIsLogoutOpen(false)} />
    </>
  )
}
