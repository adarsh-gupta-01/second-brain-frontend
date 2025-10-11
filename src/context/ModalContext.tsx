import { createContext, useState } from 'react'
import type { ReactNode } from 'react'

type ModalContextType = {
  isAddOpen: boolean
  setIsAddOpen: (open: boolean) => void
  isShareOpen: boolean
  setIsShareOpen: (open: boolean) => void
  isProfileOpen: boolean
  setIsProfileOpen: (open: boolean) => void
  isLogoutOpen: boolean
  setIsLogoutOpen: (open: boolean) => void
}

const ModalContext = createContext<ModalContextType | null>(null)

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)
  return (
    <ModalContext.Provider value={{ isAddOpen, setIsAddOpen, isShareOpen, setIsShareOpen, isProfileOpen, setIsProfileOpen, isLogoutOpen, setIsLogoutOpen }}>
      {children}
    </ModalContext.Provider>
  )
}

export default ModalContext
