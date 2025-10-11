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

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { firstName, avatar, bio, refreshUser } = useContext(AuthContext)
  const apiKey = import.meta.env.VITE_API_KEY

  const [form, setForm] = useState<FormState>({
    firstName: firstName || '',
    avatar: avatar || '',
    bio: bio || '',
  })
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(avatar || null)

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

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-lg shadow-blue-200/30 max-w-2xl w-full p-6 relative hover:shadow-xl hover:shadow-blue-300/40 transition-all duration-300"
        onClick={e => e.stopPropagation()} // Prevent modal close when clicking inside
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 hover:bg-gray-100 hover:shadow-lg hover:shadow-blue-200/30 p-2 rounded-lg transition-all duration-200 text-xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Profile</h2>

        <div className="space-y-6">
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

          {/* Save Button */}
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
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
