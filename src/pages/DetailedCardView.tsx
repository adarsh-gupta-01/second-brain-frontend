import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { FadeLoader } from 'react-spinners'
import { 
  ArrowLeft, 
  Edit, 
  Copy, 
  Trash, 
  ExternalLink, 
  Calendar, 
  Tag,
  FileText,
  Image,
  Youtube,
  Twitter,
  Instagram,
  File,
  Upload
} from 'lucide-react'
import Embed from '../components/Embed'
import EditContentModal from '../components/EditContentModal'

interface ContentItem {
  _id: string
  title: string
  type: string
  link?: string
  tags: string[]
  content?: string
  createdAt: string
}

type ContentType = 'image' | 'youtube' | 'tweet' | 'instagram' | 'doc' | 'note' | 'upload'

const mapTypeToCardType = (type: string): ContentType => {
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
      return 'doc'
    case 'image':
      return 'image'
    case 'instagram':
      return 'instagram'
    case 'upload':
      return 'upload'
    case 'note':
      return 'note'
    default:
      return 'note'
  }
}

const getTypeIcon = (type: ContentType) => {
  const iconClass = 'w-6 h-6'
  switch (type) {
    case 'image':
      return <Image className={`${iconClass} text-blue-600`} />
    case 'youtube':
      return <Youtube className={`${iconClass} text-red-600`} />
    case 'tweet':
      return <Twitter className={`${iconClass} text-blue-500`} />
    case 'instagram':
      return <Instagram className={`${iconClass} text-pink-500`} />
    case 'doc':
      return <File className={`${iconClass} text-green-600`} />
    case 'note':
      return <FileText className={`${iconClass} text-yellow-600`} />
    case 'upload':
      return <Upload className={`${iconClass} text-gray-500`} />
    default:
      return <FileText className={`${iconClass} text-gray-600`} />
  }
}

export default function DetailedCardView() {
  const { contentId } = useParams<{ contentId: string }>()
  const navigate = useNavigate()
  const apiKey = import.meta.env.VITE_API_KEY

  const [content, setContent] = useState<ContentItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [copying, setCopying] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetchContent = async () => {
      if (!contentId) {
        setError('No content ID provided')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        // We need to fetch all content and find the specific one
        // since there's no single content endpoint
        const response = await axios.get(`${apiKey}/content`, { withCredentials: true })
        const contents = response.data?.content || []
        const foundContent = contents.find((c: ContentItem) => c._id === contentId)
        
        if (!foundContent) {
          setError('Content not found')
        } else {
          setContent(foundContent)
        }
      } catch (err: unknown) {
        console.error('Failed to fetch content:', err)
        setError('Failed to load content. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [contentId, apiKey])

  const handleCopyLink = async () => {
    if (!content?.link || copying) return
    
    setCopying(true)
    try {
      await navigator.clipboard.writeText(content.link)
      toast.success('Link copied to clipboard!')
    } catch {
      toast.error('Failed to copy link')
    } finally {
      setTimeout(() => setCopying(false), 300)
    }
  }

  const handleDelete = async () => {
    if (!content || deleting) return
    
    if (!confirm('Are you sure you want to delete this content?')) return

    setDeleting(true)
    try {
      await axios.delete(`${apiKey}/content`, { 
        data: { contentId: content._id }, 
        withCredentials: true 
      })
      toast.success('Content deleted successfully')
      navigate('/')
    } catch (err: unknown) {
      console.error('Failed to delete content:', err)
      toast.error('Failed to delete content')
    } finally {
      setDeleting(false)
    }
  }

  const handleUpdateContent = (updatedContent: ContentItem) => {
    setContent(updatedContent)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <FadeLoader color="#6366f1" />
          <p className="mt-4 text-slate-600">Loading content...</p>
        </div>
      </div>
    )
  }

  if (error || !content) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExternalLink className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Content Not Found</h1>
          <p className="text-slate-600 mb-6">{error || 'The content you\'re looking for could not be found.'}</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Home
          </button>
        </div>
      </div>
    )
  }

  const cardType = mapTypeToCardType(content.type)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
                title="Go Back"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <div className="flex-shrink-0">
                  {getTypeIcon(cardType)}
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-base sm:text-xl font-bold text-slate-800 line-clamp-1">
                    {content.title}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 capitalize">
                    {content.type} • {new Date(content.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
              {content.link && (
                <button
                  onClick={handleCopyLink}
                  disabled={copying}
                  className="inline-flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex-1 sm:flex-initial text-sm"
                  title="Copy Link"
                >
                  <Copy className="w-4 h-4" />
                  <span className="hidden xs:inline">{copying ? 'Copied!' : 'Copy'}</span>
                </button>
              )}
              
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="inline-flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors flex-1 sm:flex-initial text-sm"
                title="Edit"
              >
                <Edit className="w-4 h-4" />
                <span className="hidden xs:inline">Edit</span>
              </button>
              
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50 flex-1 sm:flex-initial text-sm"
                title="Delete"
              >
                <Trash className="w-4 h-4" />
                <span className="hidden xs:inline">{deleting ? 'Deleting...' : 'Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Embedded Content */}
          <div className="p-3 sm:p-6">
            <Embed
              content={content.content}
              type={cardType}
              link={cardType === 'tweet' ? content.link?.replace('x.com', 'twitter.com') : content.link}
            />
          </div>

          {/* Details */}
          <div className="border-t border-slate-200 p-3 sm:p-6">
            {/* Tags */}
            {content.tags && content.tags.length > 0 && (
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <Tag className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700">Tags</span>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {content.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Content/Notes */}
            {content.content && (
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700">Notes</span>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 sm:p-4">
                  <p className="text-sm sm:text-base text-slate-700 whitespace-pre-wrap">{content.content}</p>
                </div>
              </div>
            )}

            {/* Link */}
            {content.link && (
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <ExternalLink className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700">Link</span>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 bg-slate-50 rounded-lg">
                  <span className="text-xs sm:text-sm text-slate-700 break-all flex-1 min-w-0">{content.link}</span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={handleCopyLink}
                      disabled={copying}
                      className="p-2 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"
                      title="Copy Link"
                    >
                      <Copy className="w-4 h-4 text-slate-600" />
                    </button>
                    <a
                      href={content.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                      title="Open Link"
                    >
                      <ExternalLink className="w-4 h-4 text-slate-600" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-500 pt-3 sm:pt-4 border-t border-slate-200">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Created {new Date(content.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="capitalize">{content.type}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      <EditContentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        content={content}
        onUpdate={handleUpdateContent}
      />
    </div>
  )
}