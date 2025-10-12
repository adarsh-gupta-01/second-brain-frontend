import { useContext, useState, useEffect } from 'react'
import type { ChangeEvent } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { AuthContext } from '../context/AuthContext'

interface FormState {
  firstName: string
  avatar: string
  bio: string
}

interface PasswordFormState {
  newPassword: string
  confirmPassword: string
}

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { username, firstName, avatar, bio, refreshUser } = useContext(AuthContext)
  const apiKey = import.meta.env.VITE_API_KEY

  const [form, setForm] = useState<FormState>({
    firstName: firstName || '',
    avatar: avatar || '',
    bio: bio || '',
  })
  const [passwordForm, setPasswordForm] = useState<PasswordFormState>({
    newPassword: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(avatar || null)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    setForm({
      firstName: firstName || '',
      avatar: avatar || '',
      bio: bio || '',
    })
    setPreview(avatar || null)
  }, [firstName, avatar, bio])

  const onFileChange = (file?: File) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setPreview(result)
      setForm(f => ({ ...f, avatar: result }))
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    if (!form.firstName.trim()) {
      toast.error('Name cannot be empty')
      return
    }

    setLoading(true)
    try {
      const res = await axios.put(`${apiKey}/me`, form, { withCredentials: true })
      if (res.data?.success) {
        toast.success('Profile updated successfully')
        await refreshUser()
        onClose()
      } else {
        toast.error('Update failed')
      }
    } catch (err: unknown) {
      console.error(err)
      const message = err && typeof err === 'object' && 'response' in err 
        ? (err as any)?.response?.data?.message || 'Something went wrong'
        : 'Something went wrong'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (name === 'avatar') setPreview(value)
  }

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordForm(f => ({ ...f, [name]: value }))
  }

  const handleChangePassword = async () => {
    const { newPassword, confirmPassword } = passwordForm

    if (!newPassword || !confirmPassword) {
      toast.error('Both password fields are required')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    // Validate new password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/
    if (!passwordRegex.test(newPassword)) {
      toast.error('Password must be at least 8 characters with uppercase, lowercase, digit & special character')
      return
    }

    setPasswordLoading(true)
    try {
      const res = await axios.put(
        `${apiKey}/change-password`, 
        { newPassword },
        { withCredentials: true }
      )
      if (res.data?.success) {
        toast.success('Password changed successfully')
        setPasswordForm({ newPassword: '', confirmPassword: '' })
        setShowChangePassword(false)
      } else {
        toast.error(res.data?.message || 'Failed to change password')
      }
    } catch (err: unknown) {
      console.error(err)
      const message = err && typeof err === 'object' && 'response' in err 
        ? (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Something went wrong'
        : 'Something went wrong'
      toast.error(message)
    } finally {
      setPasswordLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-lg shadow-blue-200/30 max-w-2xl w-full p-6 relative hover:shadow-xl hover:shadow-blue-300/40 transition-all duration-300 my-8 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()} // Prevent modal close when clicking inside
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="sticky top-0 float-right text-gray-500 hover:text-gray-700 hover:bg-gray-100 hover:shadow-lg hover:shadow-blue-200/30 p-2 rounded-lg transition-all duration-200 text-xl font-bold z-10 bg-white"
        >
          &times;
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-gray-800 clear-both">Profile</h2>

        <div className="space-y-6">
          {/* Username (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              value={username || ''}
              readOnly
              title="Username (cannot be changed)"
              className="w-full mt-1 p-2.5 border rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full mt-1 p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Avatar */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Avatar (upload or paste URL)</label>
            <div className="flex gap-4 items-center mt-2">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center shadow-sm">
                {preview ? (
                  <img src={preview} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg font-semibold text-gray-500">
                    {(form.firstName || 'U').charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => onFileChange(e.target.files?.[0])}
                  className="mt-1 text-sm"
                  title="Upload avatar image"
                />
                <input
                  name="avatar"
                  value={form.avatar}
                  placeholder="Or paste image URL"
                  onChange={handleChange}
                  className="w-full mt-2 p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              placeholder="Write something about yourself..."
              className="w-full mt-1 p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
              rows={4}
            />
          </div>

          {/* Change Password Section */}
          <div className="border-t pt-6">
            <button
              onClick={() => setShowChangePassword(!showChangePassword)}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors"
            >
              <span className="text-lg">{showChangePassword ? '−' : '+'}</span>
              <span>{showChangePassword ? 'Hide Password Change' : 'Change Password'}</span>
            </button>

            {showChangePassword && (
              <div className="mt-4 space-y-4 bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-xl border border-indigo-100">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter new password"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none pr-12 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600 transition-colors text-lg"
                      title={showNewPassword ? "Hide password" : "Show password"}
                    >
                      {showNewPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none pr-12 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600 transition-colors text-lg"
                      title={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                <div className="bg-white/70 p-3 rounded-lg">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Password Requirements:</p>
                  <ul className="text-xs space-y-1 text-gray-600">
                    <li className="flex items-center gap-2">
                      <span className="text-indigo-500">•</span> At least 8 characters
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-indigo-500">•</span> Uppercase & lowercase letters
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-indigo-500">•</span> At least one digit (0-9)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-indigo-500">•</span> Special character (@$!%*?&#)
                    </li>
                  </ul>
                </div>

                <button
                  onClick={handleChangePassword}
                  disabled={passwordLoading}
                  className={`w-full px-5 py-3 rounded-lg text-white font-semibold transition-all duration-200 ${
                    passwordLoading
                      ? 'bg-indigo-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg'
                  }`}
                >
                  {passwordLoading ? '🔄 Changing Password...' : '🔒 Change Password'}
                </button>
              </div>
            )}
          </div>

          {/* Save Profile Button */}
          <div className="flex justify-end pt-4">
            <button
              onClick={handleSave}
              disabled={loading}
              className={`px-5 py-2.5 rounded-lg text-white font-medium transition-all duration-200 ${
                loading
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-md'
              }`}
            >
              {loading ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
