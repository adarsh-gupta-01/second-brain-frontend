import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import Embed from './Embed'
import DeleteConfirmationModal from './DeleteConfirmationModal'
import {
  FileTextIcon,
  ImageIcon,
  InstagramIcon,
  StickyNoteIcon,
  TwitterIcon,
  YoutubeIcon,
  Copy,
  Edit,
  Trash,
  Check,
} from 'lucide-react'

type ContentType = 'image' | 'youtube' | 'tweet' | 'instagram' | 'doc' | 'note'
type CategoryType = 'link' | 'note'

interface CardProps {
  contentId: string | number
  category: CategoryType
  type: ContentType
  title: string
  link?: string
  tags?: string[]
  date: string
  content?: string
  onDelete?: (id: string | number) => void // callback after delete
  onEdit?: (id: string | number) => void // callback for edit
  isSharedView?: boolean // whether this is in a shared/read-only view
}

const getIcon = (type: ContentType) => {
  const base = 'w-5 h-5 mr-2'
  switch (type) {
    case 'image':
      return <ImageIcon className={`${base} text-gray-600`} />
    case 'youtube':
      return <YoutubeIcon className={`${base} text-red-600`} />
    case 'tweet':
      return <TwitterIcon className={`${base} text-blue-500`} />
    case 'instagram':
      return <InstagramIcon className={`${base} text-pink-500`} />
    case 'doc':
      return <FileTextIcon className={`${base} text-green-600`} />
    case 'note':
      return <StickyNoteIcon className={`${base} text-yellow-600`} />
    default:
      return null
  }
}

export default function Card(props: CardProps) {
  const apiKey = import.meta.env.VITE_API_KEY
  const navigate = useNavigate()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isCopying, setIsCopying] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const { contentId, onDelete, onEdit, link, isSharedView } = props

  const deleteContent = useCallback(async () => {
    setIsDeleting(true)
    try {
      // Backend expects DELETE /content with JSON body { contentId }
      await axios.delete(`${apiKey}/content`, { data: { contentId }, withCredentials: true })
      toast.success('Deleted successfully')
      onDelete?.(contentId)
    } catch (error: unknown) {
      let message = 'Something went wrong'
      if (error && typeof error === 'object') {
        const errObj = error as Record<string, unknown>
        const resp = errObj.response as Record<string, unknown> | undefined
        const data = resp?.data as Record<string, unknown> | undefined
        if (data && typeof data.message === 'string') message = data.message
      }
      toast.error(message)
    } finally {
      setIsDeleting(false)
    }
  }, [apiKey, contentId, onDelete])

  const handleCopyLink = useCallback(async () => {
    if (!link || isCopying) return
    
    setIsCopying(true)
    try {
      await navigator.clipboard.writeText(link)
      toast.success('Link copied!')
      setCopySuccess(true)
      // Reset the success state after 2 seconds
      setTimeout(() => setCopySuccess(false), 2000)
    } catch {
      toast.error('Failed to copy link')
    } finally {
      setTimeout(() => setIsCopying(false), 300)
    }
  }, [link, isCopying])

  const handleEdit = useCallback(() => {
    if (onEdit) {
      onEdit(contentId)
    } else {
      // Navigate to detailed view
      navigate(`/content/${contentId}`)
    }
  }, [contentId, onEdit, navigate])

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    // Don't navigate if clicking on buttons
    if ((e.target as HTMLElement).closest('button')) return
    
    // Navigate to detailed view
    navigate(`/content/${contentId}`)
  }, [contentId, navigate])

  return (
  <div
    className="
      flex flex-col 
      bg-white shadow-sm hover:shadow-lg hover:shadow-blue-200/40 
      border border-gray-200 hover:border-blue-200
      rounded-xl overflow-hidden 
      w-full 
      min-h-[400px] max-w-none
      hover:scale-[1.01] transition-all duration-200 ease-in-out
      cursor-pointer
      group
      hover:bg-blue-50/30
    "
    onClick={handleCardClick}
  >
    {/* Header */}
    <div className="flex justify-between items-center px-3 py-2 border-b border-gray-100 bg-white">
      <div className="flex items-center w-full overflow-hidden">
        {getIcon(props.type)}
        <div className="truncate">
          <div className="text-sm font-semibold text-gray-800 truncate">{props.title}</div>
        </div>
      </div>

      <div className="flex items-center gap-1 ml-2 shrink-0">
        {!isSharedView && (
          <>
            {link && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleCopyLink()
                }}
                disabled={isCopying}
                className={`p-1.5 rounded-lg transition-all duration-200 ${
                  isCopying ? 'opacity-60 cursor-not-allowed' : 
                  copySuccess ? 'bg-green-50 border border-green-200' : 'hover:bg-blue-50'
                }`}
                title={copySuccess ? 'Link Copied!' : 'Copy Link'}
              >
                {copySuccess ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-blue-600" />
                )}
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleEdit()
              }}
              className="p-1.5 rounded-lg transition-all duration-200 hover:bg-green-50"
              title="Edit"
            >
              <Edit className="w-4 h-4 text-green-600" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowDeleteModal(true)
              }}
              disabled={isDeleting}
              className={`p-1.5 rounded-lg transition-all duration-200 ${
                isDeleting ? 'opacity-60 cursor-not-allowed' : 'hover:bg-red-50'
              }`}
              title="Delete"
            >
              <Trash className="w-4 h-4 text-red-600" />
            </button>
          </>
        )}
        {isSharedView && (
          <div className="px-3 py-1 text-xs text-gray-500 bg-gray-100 rounded-full">
            Shared Content
          </div>
        )}
      </div>
    </div>

    {/* Embedded Content */}
    <div className="flex-1 p-2 bg-gray-50">
      <Embed
        content={props.content}
        type={props.type}
        link={props.type === 'tweet' ? props.link?.replace('x.com', 'twitter.com') : props.link}
      />
      
      {/* Show text content if available */}
      {props.content && props.type === 'note' && (
        <div className="mt-2 p-3 bg-white rounded-lg border border-gray-200">
          <p className="text-sm text-gray-700 line-clamp-3 whitespace-pre-wrap">
            {props.content}
          </p>
        </div>
      )}
    </div>

    {/* Footer */}
    <div className="px-3 py-2 bg-white border-t border-gray-100">
      {props.tags && props.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {props.tags.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700"
            >
              #{tag}
            </span>
          ))}
          {props.tags.length > 3 && (
            <span className="text-xs text-gray-500">
              +{props.tags.length - 3} more
            </span>
          )}
        </div>
      )}
      <div className="text-gray-500 text-xs">
        Added on <span className="font-medium text-gray-700">{props.date}</span>
      </div>
    </div>

    {/* Delete Confirmation Modal */}
    <DeleteConfirmationModal
      isOpen={showDeleteModal}
      onClose={() => setShowDeleteModal(false)}
      onConfirm={deleteContent}
      title="Delete Content"
      description="Are you sure you want to delete this content? This action cannot be undone."
      isDeleting={isDeleting}
    />
  </div>
)

}
