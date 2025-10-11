import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { FadeLoader } from 'react-spinners'
import Card from '../components/Card'
import { ArrowLeft, Share2, User, ExternalLink } from 'lucide-react'

interface ContentItem {
  _id: string
  type: 'twitter' | 'youtube' | 'document' | 'link' | 'instagram' | 'image' | 'note'
  link: string
  title: string
  tags: string[]
  createdAt: string
  description?: string
}

interface SharedBrainData {
  sharedBy: string
  contents: ContentItem[]
}

// Map backend types to frontend Card component types
const mapTypeToCardType = (type: string): 'image' | 'youtube' | 'tweet' | 'instagram' | 'doc' | 'note' => {
  const lowerType = type.toLowerCase()
  switch (lowerType) {
    case 'twitter':
    case 'tweet':
      return 'tweet'
    case 'youtube':
      return 'youtube'
    case 'document':
    case 'doc':
      return 'doc'
    case 'link':
      return 'doc' // Use doc as fallback for links
    case 'image':
      return 'image'
    case 'instagram':
      return 'instagram'
    case 'note':
      return 'note'
    default:
      return 'note'
  }
}

// Map backend types to Card component categories
const mapTypeToCategory = (type: string): 'link' | 'note' => {
  const lowerType = type.toLowerCase()
  switch (lowerType) {
    case 'twitter':
    case 'tweet':
    case 'youtube':
    case 'link':
    case 'image':
    case 'instagram':
    case 'document':
    case 'doc':
      return 'link'
    case 'note':
    default:
      return 'note'
  }
}

// Get icon for each content type
const getTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'twitter':
    case 'tweet':
      return '🐦'
    case 'youtube':
      return '📺'
    case 'instagram':
      return '📸'
    case 'image':
      return '🖼️'
    case 'document':
    case 'doc':
      return '📄'
    case 'note':
      return '📝'
    case 'link':
      return '🔗'
    default:
      return '📋'
  }
}

// Get display name for each content type
const getTypeDisplayName = (type: string) => {
  switch (type.toLowerCase()) {
    case 'twitter':
    case 'tweet':
      return 'Twitter'
    case 'youtube':
      return 'YouTube'
    case 'instagram':
      return 'Instagram'
    case 'image':
      return 'Images'
    case 'document':
    case 'doc':
      return 'Documents'
    case 'note':
      return 'Notes'
    case 'link':
      return 'Links'
    default:
      return 'Other'
  }
}

export default function SharedBrain() {
  const { shareId } = useParams<{ shareId: string }>()
  const navigate = useNavigate()
  const apiKey = import.meta.env.VITE_API_KEY

  const [data, setData] = useState<SharedBrainData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!shareId) {
      setError('Invalid share link')
      setLoading(false)
      return
    }

    const fetchSharedBrain = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await axios.get(`${apiKey}/brain/${shareId}`)
        console.log('Shared brain data:', response.data) // Debug log
        setData(response.data)
      } catch (err: unknown) {
        console.error('Failed to fetch shared brain:', err)
        if (err && typeof err === 'object' && 'response' in err) {
          const errorObj = err as { response?: { status?: number } }
          if (errorObj.response?.status === 404) {
            setError('This brain link is invalid or has been removed.')
          } else {
            setError('Failed to load the shared brain. Please try again.')
          }
        } else {
          setError('Failed to load the shared brain. Please try again.')
        }
        toast.error('Failed to load shared brain')
      } finally {
        setLoading(false)
      }
    }

    fetchSharedBrain()
  }, [shareId, apiKey])

  const handleSharePage = async () => {
    try {
      const currentUrl = window.location.href
      await navigator.clipboard.writeText(currentUrl)
      toast.success('Page link copied to clipboard!')
    } catch {
      toast.error('Failed to copy link')
    }
  }



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <FadeLoader color="#6366f1" />
          <p className="mt-4 text-slate-600">Loading shared brain...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExternalLink className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Brain Not Found</h1>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                title="Go Home"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-800">
                    {data?.sharedBy}'s Brain
                  </h1>
                  <p className="text-sm text-slate-600">
                    {data?.contents.length || 0} items shared
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleSharePage}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!data?.contents || data.contents.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Share2 className="w-8 h-8 text-slate-500" />
            </div>
            <h2 className="text-xl font-semibold text-slate-700 mb-2">
              No content shared yet
            </h2>
            <p className="text-slate-500">
              {data?.sharedBy} hasn't shared any content in their brain yet.
            </p>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
              {['twitter', 'youtube', 'instagram', 'image', 'document', 'note', 'link'].map((type) => {
                const count = data.contents.filter(item => {
                  const itemType = item.type.toLowerCase()
                  return itemType === type || 
                         (type === 'twitter' && itemType === 'tweet') ||
                         (type === 'document' && itemType === 'doc')
                }).length
                
                // Only show types that have content
                if (count === 0) return null
                
                return (
                  <div key={type} className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getTypeIcon(type)}</span>
                      <div>
                        <p className="text-xl font-bold text-slate-800">{count}</p>
                        <p className="text-xs text-slate-600">{getTypeDisplayName(type)}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.contents.map((content) => (
                <div key={content._id}>
                  <Card
                    contentId={content._id}
                    category={mapTypeToCategory(content.type)}
                    type={mapTypeToCardType(content.type)}
                    title={content.title}
                    link={content.link}
                    tags={content.tags}
                    date={new Date(content.createdAt).toLocaleDateString()}
                    onDelete={() => {}} // No delete functionality for shared view
                    isSharedView={true} // This is a shared/read-only view
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-slate-500 text-sm">
            <p>Shared from <span className="font-semibold text-indigo-600">{data?.sharedBy}'s</span> Second Brain</p>
            <p className="mt-1">
              Create your own brain at{' '}
              <button
                onClick={() => navigate('/')}
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Second Brain
              </button>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}