import { useEffect } from "react"

interface EmbedProps {
  type: 'image' | 'youtube' | 'tweet' | 'instagram' | 'doc' | 'note' | 'upload'
  link?: string
  content?: string
}

interface WinEmbeds {
  twttr?: { widgets?: { load: () => void } }
  instgrm?: { Embeds?: { process: () => void } }
}

export default function Embed({ type, link, content }: EmbedProps) {
  // Load third-party embed scripts on demand
  const loadScriptOnce = (id: string, src: string) => {
    if (document.getElementById(id)) return
    const s = document.createElement('script')
    s.id = id
    s.src = src
    s.async = true
    s.defer = true
    document.body.appendChild(s)
  }

  useEffect(() => {
    if (type === 'tweet') {
      loadScriptOnce('twitter-embed', 'https://platform.twitter.com/widgets.js')
      const win = window as unknown as WinEmbeds
      win.twttr?.widgets?.load()
    }
    if (type === 'instagram') {
      loadScriptOnce('instagram-embed', 'https://www.instagram.com/embed.js')
      const win = window as unknown as WinEmbeds
      win.instgrm?.Embeds?.process()
    }
  }, [type])

  const containerClass =
    "w-full min-h-[180px] flex justify-center items-center bg-gray-50 rounded-lg overflow-hidden"

  // 🖼️ IMAGE
  if (type === "image") {
    return (
      <div className={containerClass}>
        {link ? (
          <img
            src={link}
            alt="Embedded content"
            className="max-w-full max-h-[300px] object-contain rounded-md shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => window.open(link, '_blank')}
            title="Click to open full image"
          />
        ) : (
          <div className="text-gray-400">No image available</div>
        )}
      </div>
    )
  }

  // 🐦 TWEET
  if (type === "tweet") {
    return (
      <div className={containerClass}>
        {link ? (
          <blockquote className="twitter-tweet" data-theme="light" data-width="100%">
            <a
              href={(link || '').replace('x.com', 'twitter.com')}
              target="_blank"
              rel="noopener noreferrer"
              title="View Tweet"
            >
              View Tweet
            </a>
          </blockquote>
        ) : (
          <div className="text-gray-400">Tweet unavailable</div>
        )}
      </div>
    )
  }

  // 📸 INSTAGRAM
  if (type === "instagram") {
  return (
    <div
      className={`${containerClass} flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg bg-white shadow-sm`}
    >
      {link ? (
        <>
          <div className="text-center mb-2 font-semibold text-gray-800">
            Instagram Content
          </div>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-5 py-2 rounded font-medium hover:opacity-90 transition-opacity"
            style={{
              backgroundColor: "#E1306C", // Instagram pink
              color: "#fff",
              textDecoration: "none",
            }}
          >
            View on Instagram
          </a>
        </>
      ) : (
        <div className="text-gray-400">Instagram post unavailable</div>
      )}
    </div>
  );
}




  // ▶️ YOUTUBE
  if (type === "youtube") {
    // Robustly parse YouTube video id from various URL formats
    const toId = (u?: string) => {
      if (!u) return undefined
      try {
        const url = new URL(u)
        if (url.hostname.includes('youtu.be')) {
          return url.pathname.split('/').filter(Boolean)[0]
        }
        if (url.searchParams.get('v')) return url.searchParams.get('v') || undefined
        const m = url.pathname.match(/\/embed\/([\w-]+)/) || url.pathname.match(/\/shorts\/([\w-]+)/)
        if (m) return m[1]
  } catch { /* ignore invalid URL formats */ }
      // fallback regex
      const rx = /(?:v=|youtu\.be\/|\/embed\/|\/shorts\/)([\w-]+)/
      const mm = u.match(rx)
      return mm?.[1]
    }
    const videoId = toId(link)
    const embedLink = videoId ? `https://www.youtube.com/embed/${videoId}` : undefined

    return (
      <div className={`${containerClass} aspect-video relative`}>
        {embedLink ? (
          <>
            <iframe
              className="w-full h-full border-0"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              src={embedLink}
            />
            {/* Transparent overlay so user can open video in YouTube */}
            <div
              onClick={() => link && window.open(link, '_blank')}
              className="absolute inset-0 z-10 cursor-pointer"
              title="Open on YouTube"
            />
          </>
        ) : (
          <div className="text-gray-400">Invalid YouTube link</div>
        )}
      </div>
    )
  }

  // 📄 DOCUMENT
  if (type === "doc") {
    const isPDF = !!link && /\.pdf($|\?)/i.test(link)
    const fileName = link ? decodeURIComponent(link.split('/').pop()?.split('?')[0] || 'document') : 'document'
    
    return (
      <div className={`${containerClass} p-4`}>
        {link ? (
          <div className="w-full space-y-3">
            {/* Document Preview Card */}
            <div className="bg-white border-2 border-gray-200 rounded-lg p-4 flex flex-col items-center space-y-3">
              {/* Document Icon & Info */}
              <div className="flex items-center gap-3 w-full">
                <div className="flex-shrink-0">
                  {isPDF ? (
                    <svg className="w-12 h-12 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18.5,9H13V3.5L18.5,9M6,20V4H11V10H18V20H6Z"/>
                    </svg>
                  ) : (
                    <svg className="w-12 h-12 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{fileName}</p>
                  <p className="text-xs text-gray-500">{isPDF ? 'PDF Document' : 'Document'}</p>
                </div>
              </div>

              {/* Preview iframe - using Google Docs viewer for reliability */}
              {isPDF && (
                <div className="w-full">
                  <iframe 
                    src={`https://docs.google.com/viewer?url=${encodeURIComponent(link)}&embedded=true`}
                    title="Document Preview" 
                    className="w-full h-[300px] border border-gray-200 rounded bg-gray-50"
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 w-full">
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Open Document
                </a>
                <a
                  href={link}
                  download
                  className="px-4 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                  title="Download"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-400">No document link provided</div>
        )}
      </div>
    )
  }

  // 🗒️ NOTE
  if (type === "note") {
    return (
      <div className={`${containerClass} p-6`}>
        <div className="w-full bg-amber-50 border border-amber-200 rounded-lg p-4 overflow-y-auto shadow-sm">
          <div className="flex items-center mb-3">
            <span className="text-amber-600 text-2xl mr-2">📝</span>
            <span className="text-lg font-semibold text-gray-800">Note</span>
          </div>
          <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
            {content || "No note content available."}
          </p>
        </div>
      </div>
    )
  }

  // 📤 UPLOAD
  if (type === "upload") {
    const isImage = !!link && /\.(jpg|jpeg|png|gif|webp)($|\?)/i.test(link)
    const isPDF = !!link && /\.pdf($|\?)/i.test(link)
    const isVideo = !!link && /\.(mp4|webm|ogg)($|\?)/i.test(link)
    const isAudio = !!link && /\.(mp3|wav|ogg)($|\?)/i.test(link)
    const fileName = link ? decodeURIComponent(link.split('/').pop()?.split('?')[0] || 'file') : 'file'

    return (
      <div className={`${containerClass} p-4`}>
        <div className="w-full flex flex-col items-center">
          {isImage && link && (
            <img 
              src={link} 
              alt="Uploaded" 
              className="w-full max-w-sm rounded shadow-sm mb-3 object-contain cursor-pointer hover:opacity-90 transition-opacity" 
              onClick={() => window.open(link, '_blank')}
              title="Click to open full image"
              onError={(e) => {
                // Show error placeholder if image fails to load
                const img = e.target as HTMLImageElement
                img.style.display = 'none'
                const parent = img.parentElement
                if (parent && !parent.querySelector('.error-placeholder')) {
                  const errorDiv = document.createElement('div')
                  errorDiv.className = 'error-placeholder text-center p-8 bg-gray-50 rounded border-2 border-dashed border-gray-300'
                  errorDiv.innerHTML = `
                    <svg class="w-16 h-16 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p class="text-sm text-gray-500 mb-2">Image unavailable</p>
                    <p class="text-xs text-gray-400">The file may have been deleted or moved</p>
                  `
                  parent.appendChild(errorDiv)
                }
              }}
            />
          )}
          {isVideo && link && (
            <video 
              src={link} 
              controls 
              className="w-full max-w-lg rounded mb-3"
              onError={(e) => {
                const video = e.target as HTMLVideoElement
                video.style.display = 'none'
                const parent = video.parentElement
                if (parent && !parent.querySelector('.error-placeholder')) {
                  const errorDiv = document.createElement('div')
                  errorDiv.className = 'error-placeholder text-center p-8 bg-gray-50 rounded border-2 border-dashed border-gray-300'
                  errorDiv.innerHTML = `<p class="text-sm text-gray-500">Video unavailable</p>`
                  parent.appendChild(errorDiv)
                }
              }}
            />
          )}
          {isAudio && link && (
            <audio 
              src={link} 
              controls 
              className="w-full max-w-lg mb-3"
              onError={(e) => {
                const audio = e.target as HTMLAudioElement
                audio.style.display = 'none'
                const parent = audio.parentElement
                if (parent && !parent.querySelector('.error-placeholder')) {
                  const errorDiv = document.createElement('div')
                  errorDiv.className = 'error-placeholder text-center p-4 bg-gray-50 rounded border border-gray-300'
                  errorDiv.innerHTML = `<p class="text-sm text-gray-500">Audio unavailable</p>`
                  parent.appendChild(errorDiv)
                }
              }}
            />
          )}
          {isPDF && link && (
            <div className="w-full space-y-3 mb-3">
              {/* Document Card with Preview */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-10 h-10 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18.5,9H13V3.5L18.5,9M6,20V4H11V10H18V20H6Z"/>
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{fileName}</p>
                    <p className="text-xs text-gray-500">PDF Document</p>
                  </div>
                </div>
                <iframe 
                  src={`https://docs.google.com/viewer?url=${encodeURIComponent(link)}&embedded=true`}
                  className="w-full h-[300px] border border-gray-200 rounded bg-gray-50" 
                  title="PDF Preview"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </div>
          )}
          {!link && <div className="text-gray-400">No file available</div>}
          {link && (
            <div className="flex gap-2 w-full max-w-lg">
              <a 
                href={link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Open File
              </a>
              <a
                href={link}
                download
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                title="Download"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ❓ UNKNOWN TYPE
  return (
    <div className={`${containerClass} p-6`}>
      <div className="text-center">
        <div className="text-gray-400 text-6xl mb-4">❓</div>
        <div className="text-lg font-semibold text-gray-800 mb-1">
          Unknown Content Type
        </div>
        <div className="text-sm text-gray-500">
          The content type "{type}" is not supported yet.
        </div>
      </div>
    </div>
  )
}
