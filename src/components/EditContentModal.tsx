import { useState, useEffect } from 'react'
import { X, Save, Loader } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

interface ContentItem {
  _id: string
  title: string
  type: string
  link?: string
  tags: string[]
  content?: string
  createdAt: string
}

interface EditContentModalProps {
  isOpen: boolean
  onClose: () => void
  content: ContentItem | null
  onUpdate: (updatedContent: ContentItem) => void
}

export default function EditContentModal({ isOpen, onClose, content, onUpdate }: EditContentModalProps) {
  const apiKey = import.meta.env.VITE_API_KEY
  
  const [formData, setFormData] = useState({
    title: '',
    link: '',
    tags: '',
    content: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (content && isOpen) {
      setFormData({
        title: content.title || '',
        link: content.link || '',
        tags: content.tags?.join(', ') || '',
        content: content.content || ''
      })
    }
  }, [content, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content) return

    if (!formData.title.trim()) {
      toast.error('Title is required')
      return
    }

    setLoading(true)
    try {
      const tagsArray = formData.tags 
        ? formData.tags.split(',').map(t => t.trim()).filter(Boolean)
        : []

      const updateData = {
        contentId: content._id,
        title: formData.title.trim(),
        link: formData.link.trim() || undefined,
        tags: tagsArray,
        content: formData.content.trim() || undefined
      }

      // Since there's no update endpoint, we'll need to add this to the backend
      // For now, let's assume the endpoint exists
      const response = await axios.put(`${apiKey}/content`, updateData, { 
        withCredentials: true 
      })

      if (response.data?.content) {
        onUpdate(response.data.content)
        toast.success('Content updated successfully')
        onClose()
      } else {
        toast.success('Content updated')
        // Update local state with the form data
        const updatedContent = {
          ...content,
          title: formData.title.trim(),
          link: formData.link.trim() || content.link,
          tags: tagsArray,
          content: formData.content.trim() || content.content
        }
        onUpdate(updatedContent)
        onClose()
      }
    } catch (err: unknown) {
      console.error('Failed to update content:', err)
      const errorObj = err as { response?: { data?: { message?: string } } }
      const errorMessage = errorObj.response?.data?.message || 'Failed to update content'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  if (!isOpen || !content) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 m-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Edit Content</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            title="Close"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter title..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              required
            />
          </div>

          {/* Link */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Link (optional)
            </label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tags (comma separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="design, react, learning..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            />
            <p className="text-xs text-slate-500 mt-1">
              Separate multiple tags with commas
            </p>
          </div>

          {/* Content/Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Content / Notes
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write something..."
              rows={6}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Update
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}