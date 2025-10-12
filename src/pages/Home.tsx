import { useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useModal } from "../context/useModal";
import axios from "axios";
import TwitterIcon from "../icons/TwitterIcon";
import YouTubeIcon from "../icons/YouTubeIcon";
import DocumentsIcon from "../icons/DocumentsIcon";
import LinksIcon from "../icons/LinksIcon";
import InstagramIcon from "../icons/InstagramIcon";
import ImageIcon from "../icons/ImageIcon";
import NotesIcon from "../icons/NotesIcon";
import ProfileIcon from "../icons/ProfileIcon";
import LogoutIcon from "../icons/LogoutIcon";
import MenuIcon from "../icons/MenuIcon";
import Plus from "../icons/PlusIcon";
import AddContentModal from "../components/AddContentModal";
import Card from "../components/Card";
import Share from "../icons/ShareIcon";
import { AuthContext } from "../context/AuthContext";
import { SidebarItem } from "../components/SidebarItem";

const sidebarItems = [
  { key: 'all', label: "All", icon: <LinksIcon /> },
  { key: 'tweet', label: "Twitter", icon: <TwitterIcon /> },
  { key: 'youtube', label: "YouTube", icon: <YouTubeIcon /> },
  { key: 'instagram', label: "Instagram", icon: <InstagramIcon /> },
  { key: 'image', label: "Images", icon: <ImageIcon /> },
  { key: 'doc', label: "Documents", icon: <DocumentsIcon /> },
  { key: 'note', label: "Notes", icon: <NotesIcon /> },
  { key: 'links', label: "Links", icon: <LinksIcon /> },
  // { key: 'tags', label: "Tags", icon: <TagsIcon /> }, // optional: needs tag picker UI
];

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selected, setSelected] = useState('all')
  const [counts, setCounts] = useState<Record<string, number>>({})
  const { isAddOpen, setIsAddOpen, setIsProfileOpen, setIsShareOpen, setIsLogoutOpen } = useModal();
  const { username, firstName, avatar } = useContext(AuthContext)
  type ContentItem = {
    _id?: string;
    id?: string;
    title: string;
    type: string;
    link?: string;
    tags?: string[];
    createdAt?: string;
    date?: string;
    content?: string;
    category?: "link" | "note";
  };

  const [contents, setContents] = useState<ContentItem[]>([]);

  // helper: load counts
  const fetchCounts = async () => {
    try {
      const apiKey = import.meta.env.VITE_API_KEY
      const res = await axios.get(`${apiKey}/content/stats?t=${Date.now()}`, { withCredentials: true })
      if (res.data?.counts) setCounts(res.data.counts)
    } catch (err) {
      console.error('Failed to load counts', err)
    }
  }

  // sync selected with current route
  useEffect(() => {
    const path = location.pathname.toLowerCase();
    const pathToKey: Record<string, string> = {
      "/": "all",
      "/twitter": "tweet",
      "/youtube": "youtube",
      "/instagram": "instagram",
      "/images": "image",
      "/documents": "doc",
      "/notes": "note",
      "/links": "links",
    };
    const newKey = pathToKey[path] ?? "all";
    setSelected(newKey);
  }, [location.pathname]);

  // fetch contents when selected category changes
  useEffect(() => {
    const load = async () => {
      try {
        const apiKey = import.meta.env.VITE_API_KEY
        const typeQuery = (() => {
          if (selected === 'all') return ''
          if (selected === 'links') return 'type=image,youtube,tweet,instagram,doc'
          return `type=${selected}`
        })()
        const url = `${apiKey}/content${typeQuery ? `?${typeQuery}` : ''}`
        const res = await axios.get(url, { withCredentials: true })
        if (res.data?.content) setContents(res.data.content)
      } catch (err) {
        console.error('Failed to load contents', err)
      }
    }
    load()
    // also refresh counts on category change so badges stay fresh
    fetchCounts()
  }, [selected])

  // fetch counts
  useEffect(() => {
    fetchCounts()
  }, [])

  const getCountFor = useMemo(() => (key: string) => {
    if (key === 'all') return (counts.image||0)+(counts.youtube||0)+(counts.tweet||0)+(counts.instagram||0)+(counts.doc||0)+(counts.note||0)
    if (key === 'links') return counts.links || 0
    return counts[key] || 0
  }, [counts])

  const currentLabel = useMemo(() => {
    const found = sidebarItems.find(i => i.key === selected)
    return found?.label ?? 'All'
  }, [selected])

  return (
    <div className="min-h-screen bg-slate-50 transition-colors duration-300">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-50 flex items-center justify-between px-2 sm:px-4 md:px-6 transition-colors duration-300">
        {/* Left Section: Logo and Title */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-1.5 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
            aria-label="Toggle menu"
          >
            <MenuIcon />
          </button>

          {/* Logo and Title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Logo with soft glow */}
            <div className="relative group flex-shrink-0">
              {/* Subtle neutral glow behind logo */}
              <div className="absolute -inset-1 rounded-xl sm:rounded-2xl bg-white/10 blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              <img
                src="./image.png"
                alt="Second Brain Logo"
                className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl object-cover shadow-md ring-1 ring-white/20 transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Title & Subtitle */}
            <div className="flex flex-col min-w-0">
              <h1 className="font-extrabold text-sm sm:text-base md:text-lg lg:text-2xl bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent truncate">
                Second Brain
              </h1>
              <p className="text-xs sm:text-xs md:text-sm text-slate-500 font-medium hidden sm:block lg:block">
                Never lose a thought again
              </p>
            </div>
          </div>
        </div>

        {/* Right Section: Action Buttons */}
        <div className="flex gap-1.5 sm:gap-2 md:gap-3 items-center flex-shrink-0">
          {/* Add Content Button - Primary */}
          <button
            onClick={() => setIsAddOpen(true)}
            className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3 sm:px-3 md:px-4 py-2.5 sm:py-2.5 rounded-lg font-medium text-xs sm:text-sm shadow-md hover:shadow-lg hover:shadow-blue-300/50 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-1.5 sm:gap-2"
            aria-label="Add new content"
          >
            <Plus className="w-4 h-4 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Add Content</span>
          </button>

          {/* Share Brain Button - Secondary */}
          <button
            onClick={() => setIsShareOpen(true)}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3 md:px-4 py-2.5 sm:py-2.5 rounded-lg font-medium text-xs sm:text-sm border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 hover:shadow-lg hover:shadow-blue-200/40 transition-all duration-200"
            aria-label="Share your brain"
          >
            <Share className="w-4 h-4 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Share Brain</span>
          </button>

          {/* Profile Button */}
          <button
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-xl hover:bg-slate-100 hover:shadow-lg hover:shadow-blue-200/30 transition-all duration-200"
            title={firstName || username || 'Profile'}
            aria-label="View profile"
          >
            <div className="relative">
              <img
                src={avatar || '/logo.png'}
                alt="Profile"
                className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-lg sm:rounded-xl object-cover border-2 border-slate-200 shadow-sm"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/logo.png' }}
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="hidden md:flex flex-col items-start">
              <span className="text-xs sm:text-sm font-semibold text-slate-800 max-w-[80px] sm:max-w-[120px] truncate">
                {firstName || username || 'User'}
              </span>
              <span className="text-xs text-slate-500">
                View Profile
              </span>
            </div>
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-slate-200 z-40 transform transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex flex-col h-full p-4">
          {/* Sidebar Navigation Items */}
          <nav className="flex-grow space-y-1">
            {sidebarItems.map((item) => (
              <SidebarItem
                key={item.key}
                icon={item.icon}
                label={item.label}
                active={selected === item.key}
                count={getCountFor(item.key)}
                onClick={() => {
                  // navigate to dedicated route for each category
                  const keyToPath: Record<string, string> = {
                    all: "/",
                    tweet: "/twitter",
                    youtube: "/youtube",
                    instagram: "/instagram",
                    image: "/images",
                    doc: "/documents",
                    note: "/notes",
                    links: "/links",
                  };
                  const to = keyToPath[item.key as keyof typeof keyToPath] ?? "/";
                  navigate(to);
                  setIsSidebarOpen(false)
                }}
              />
            ))}
          </nav>

          {/* Add Content Button */}
          <div className="py-3">
            <button
              onClick={() => {
                setIsAddOpen(true);
                setIsSidebarOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-blue-300/50 transform hover:-translate-y-0.5"
              aria-label="Add new content"
            >
              <Plus className="w-4 h-4" />
              <span>Add Content</span>
            </button>
          </div>

          {/* Bottom Section: Profile and Logout */}
          <div className="border-t border-slate-200 pt-4 space-y-1">
            <SidebarItem
              icon={<ProfileIcon />}
              label="Profile"
              itemKey="profile"
              onClick={() => {
                setIsProfileOpen(true);
                setIsSidebarOpen(false);
              }}
            />
            {/* Custom Logout Button with Red Hover */}
            <button
              onClick={() => {
                setIsLogoutOpen(true);
                setIsSidebarOpen(false);
              }}
              className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 w-full text-left group text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100 border border-transparent"
              aria-label="Logout from account"
            >
              <div className="flex items-center gap-3">
                <span className="transition-colors duration-200 group-hover:text-red-500">
                  <LogoutIcon />
                </span>
                <span className="font-medium">Logout</span>
              </div>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 top-16 bg-black/30 z-30 md:hidden transition-colors duration-300"
          onClick={() => setIsSidebarOpen(false)}
          role="button"
          aria-label="Close sidebar"
        />
      )}

      {/* Main Content Area */}
      <main className="pt-16 md:pl-64">
        <div className="p-4 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6">
            {currentLabel} Notes
          </h2>
          {/* Content list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {contents.length === 0 ? (
              <div className="col-span-full text-slate-500 text-center py-12">
                Your content cards will appear here
              </div>
            ) : (
              contents.map((c, i) => {
                const contentId = c._id || c.id || i;
                const category =
                  c.category || (c.type === "note" ? "note" : "link");
                const tags = c.tags || [];
                const date = new Date(
                  c.createdAt || c.date || Date.now()
                ).toLocaleDateString();
                return (
                  <div key={String(contentId)}>
                    <Card
                      contentId={contentId}
                      category={category}
                      type={
                        c.type as
                          | "image"
                          | "youtube"
                          | "tweet"
                          | "instagram"
                          | "doc"
                          | "note"
                      }
                      title={c.title}
                      link={c.link}
                      tags={tags}
                      date={date}
                      content={c.content}
                      onDelete={(id) => {
                        // remove from current list
                        setContents(prev => prev.filter(x => (x._id || x.id) !== id))
                        // refresh counts
                        fetchCounts()
                      }}
                    />
                  </div>
                );
              })
            )}
          </div>

          {/* Add Content Modal */}
          {isAddOpen && (
            <AddContentModal
              open={isAddOpen}
              onClose={() => setIsAddOpen(false)}
              onAdded={(c) => {
                // decide if the newly added content should appear in current view
                const content = c as ContentItem
                const type = (content?.type ?? '').toLowerCase()
                const isLinkType = ['image','youtube','tweet','instagram','doc'].includes(type)
                const shouldShow = (
                  selected === 'all' ||
                  (selected === 'links' && isLinkType) ||
                  selected === type
                )
                if (shouldShow) setContents(prev => [content, ...prev])
                // always refresh counts
                fetchCounts()
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
