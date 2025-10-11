import ProfileModal from '../components/ProfileModal'
import { useModal } from '../context/useModal'

export default function ProfilePage() {
  const { isProfileOpen, setIsProfileOpen } = useModal()

  return <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
}
