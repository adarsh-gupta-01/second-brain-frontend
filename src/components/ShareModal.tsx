import { useContext, useEffect, useState } from 'react'
import { useModal } from '../context/useModal'
import { AuthContext } from '../context/AuthContext'
import { X } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function ShareModal() {
  const { isShareOpen, setIsShareOpen } = useModal()
  const { userId, username } = useContext(AuthContext)
  const origin = window.location.origin
  const apiKey = import.meta.env.VITE_API_KEY

  const [shareLink, setShareLink] = useState<string | null>(null)
  const [active, setActive] = useState<boolean>(false)
  const [loading, setLoading] = useState(false)
  const [copying, setCopying] = useState(false)
  const [loadingShare, setLoadingShare] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  // Fetch share link and status
  useEffect(() => {
    if (!isShareOpen) return
    let mounted = true

    const fetchShare = async () => {
      setLoadingShare(true)
      setFetchError(null)
      try {
        const res = await axios.get(`${apiKey}/brain/share`, { withCredentials: true })
        const data = res.data?.data || res.data
        if (!mounted) return
        const hash = data?.hash ?? null
        setShareLink(hash ? `${origin}/brain/${hash}` : null)
        setActive(Boolean(data?.active))
        if (!hash) setFetchError('No share link returned from server')
      } catch (err) {
        console.error('Failed to fetch share info', err)
        if (!mounted) return
        setShareLink(null)
        setActive(false)
        setFetchError('Failed to load share link')
      } finally {
        if (mounted) setLoadingShare(false)
      }
    }

    fetchShare()
    return () => { mounted = false }
  }, [isShareOpen, apiKey, origin, username, userId])

  // Toggle share status
  const handleToggle = async () => {
    if (loading) return
    setLoading(true)
    try {
      const newActive = !active
      const res = await axios.post(`${apiKey}/brain/share`, { share: newActive }, { withCredentials: true })
      const data = res.data?.data || res.data
      const hash = data?.hash ?? null
      setActive(newActive)
      if (hash) setShareLink(`${origin}/brain/${hash}`)
      toast.success(newActive ? 'Share link activated' : 'Share link deactivated')
    } catch (error) {
      console.error('Failed to update share status', error)
      toast.error('Failed to update share status')
    } finally {
      setLoading(false)
    }
  }

  // Copy share link
  const handleCopy = async () => {
    if (copying || !shareLink) return
    setCopying(true)
    try {
      await navigator.clipboard.writeText(shareLink)
      toast.success('Link copied!')
    } catch {
      console.error('Copy failed')
      toast.error('Copy not supported')
    } finally {
      setTimeout(() => setCopying(false), 300)
    }
  }

  // Native share functionality
  const handleNativeShare = async () => {
    if (!shareLink) return
    
    // Check if Web Share API is supported
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${username}'s Brain`,
          text: 'Check out my Second Brain collection!',
          url: shareLink
        })
        toast.success('Shared successfully!')
      } catch (error) {
        // User cancelled the share or error occurred
        if ((error as Error).name !== 'AbortError') {
          console.error('Share failed:', error)
          toast.error('Failed to share')
        }
      }
    } else {
      // Fallback: copy to clipboard
      toast.error('Share not supported on this browser. Link copied instead!')
      await handleCopy()
    }
  }

  if (!isShareOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsShareOpen(false)}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl shadow-blue-200/30 w-full max-w-md p-6 z-10 transform transition-all duration-300 scale-100 animate-slideIn hover:shadow-2xl hover:shadow-blue-300/40">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Share Your Brain</h3>
          <button
            onClick={() => setIsShareOpen(false)}
            className="p-1 rounded-full hover:bg-gray-100 hover:shadow-lg hover:shadow-blue-200/30 active:bg-gray-200 transition-all duration-200"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Info Text */}
        <p className="text-sm text-gray-600 mb-4">
          Share your brain with others! When enabled, anyone with the link can view your public content collection.
        </p>

        {/* Preview Button */}
        {shareLink && active && (
          <div className="mb-4">
            <button
              onClick={() => window.open(shareLink, '_blank')}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
            >
              <span>👁️</span>
              Preview your shared brain
            </button>
          </div>
        )}

        {/* Share Link */}
        <div className="flex flex-col gap-2 mb-5">
          <div className="flex gap-2">
            <input
              readOnly
              value={loadingShare ? 'Loading...' : (shareLink ?? '')}
              placeholder={loadingShare ? 'Loading...' : (shareLink ? '' : 'No share link available')}
              className="flex-1 px-3 py-2 border rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              onClick={handleCopy}
              disabled={copying || !shareLink}
              className={`px-3 py-2 rounded-lg text-white transition-all duration-150
                ${(!shareLink || copying) ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'}`}
            >
              {loadingShare ? 'Loading...' : (copying ? 'Copied!' : 'Copy')}
            </button>
          </div>
          
          {/* Native Share Button */}
          <button
            onClick={handleNativeShare}
            disabled={!shareLink}
            className={`w-full px-4 py-2.5 rounded-lg font-medium text-white transition-all duration-200 flex items-center justify-center gap-2
              ${!shareLink ? 'bg-gray-300 cursor-not-allowed' : 'bg-slate-700 hover:bg-slate-800 active:scale-95 shadow-md hover:shadow-lg'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share via Apps
          </button>
        </div>

        {fetchError && (
          <div className="text-sm text-amber-600 mb-3">{fetchError}. You can enable sharing below to create a link.</div>
        )}

        {/* Sharing Status */}
        <div className="flex items-center justify-between mt-2">
          <div>
            <div className="text-sm font-medium text-gray-700">Sharing Status</div>
            <div className="text-xs text-gray-500">Toggle to make your brain public or private</div>
          </div>

          {/* Toggle */}
          <button
            onClick={handleToggle}
            disabled={loading}
            className={`relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none
              ${active ? 'bg-blue-600' : 'bg-gray-300'} ${loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-300
                ${active ? 'translate-x-7' : 'translate-x-0'}`}
            />
            <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white pointer-events-none">
              {active ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
