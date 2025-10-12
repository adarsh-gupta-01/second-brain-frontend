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
            className="max-w-full max-h-[300px] object-contain rounded-md shadow-sm"
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
    
    return (
      <div className={`${containerClass} p-4`}>
        {link ? (
          isPDF ? (
            <div className="w-full flex flex-col items-center justify-center space-y-4 bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">PDF Document</h3>
                <p className="text-sm text-gray-600 mb-4">Click below to view the PDF document</p>
              </div>
              
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Open PDF
              </a>
              
              {/* Try to show PDF in iframe as fallback */}
              <div className="w-full">
                <iframe 
                  src={`https://docs.google.com/gview?url=${encodeURIComponent(link)}&embedded=true`} 
                  title="PDF Preview" 
                  className="w-full h-[300px] border rounded"
                  onError={(e) => {
                    // Hide iframe if it fails to load
                    (e.target as HTMLIFrameElement).style.display = 'none'
                  }}
                />
              </div>
            </div>
          ) : (
            <iframe 
              src={`https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(link)}`} 
              title="Document" 
              className="w-full h-[420px] border rounded" 
            />
          )
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
        <div className="w-full bg-yellow-50 border border-yellow-200 rounded-lg p-4 overflow-y-auto shadow-sm">
          <div className="flex items-center mb-3">
            <span className="text-yellow-600 text-2xl mr-2">📝</span>
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

    return (
      <div className={`${containerClass} p-4`}>
        <div className="w-full flex flex-col items-center text-center">
          {isImage && link && (
            <img src={link} alt="Uploaded" className="w-full max-w-sm rounded shadow-sm mb-3 object-contain" />
          )}
          {isVideo && link && (
            <video src={link} controls className="w-full max-w-lg rounded mb-3" />
          )}
          {isAudio && link && (
            <audio src={link} controls className="w-full max-w-lg mb-3" />
          )}
          {isPDF && link && (
            <div className="w-full flex flex-col items-center space-y-3">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-2">
                <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 font-medium">PDF Document</p>
              {/* Try to embed PDF with Google Docs Viewer */}
              <iframe 
                src={`https://docs.google.com/gview?url=${encodeURIComponent(link)}&embedded=true`}
                className="w-full h-[300px] border rounded mb-3" 
                title="PDF Preview"
                onError={(e) => {
                  // Hide iframe if it fails to load
                  (e.target as HTMLIFrameElement).style.display = 'none'
                }}
              />
            </div>
          )}
          {!link && <div className="text-gray-400">No file available</div>}
          {link && (
            <a 
              href={link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Open File
            </a>
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
