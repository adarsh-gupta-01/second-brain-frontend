import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { X, Image, Youtube, Twitter, FileText, File, Instagram } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onAdded: (content: unknown) => void;
}

export default function AddContentModal({ open, onClose, onAdded }: Props) {
  const apiKey = import.meta.env.VITE_API_KEY;
  const { isLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [type, setType] = useState("image");
  const [link, setLink] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !type) {
      toast.error("Please fill required fields");
      return;
    }
    if (!isLogin) {
      toast.error("Please login to add content");
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      const tagsArray = tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
      const data = file ? new FormData() : {
        title,
        type,
        link,
        tags: tagsArray,
        content,
      };
      if (file) {
        const fd = data as FormData;
        fd.append('title', title);
        fd.append('type', type);
        if (link) fd.append('link', link);
        fd.append('tags', JSON.stringify(tagsArray));
        if (content) fd.append('content', content);
        fd.append('file', file);
      }
      const res = await axios.post(
        `${apiKey}/content`,
        data,
        { withCredentials: true, headers: file ? { 'Content-Type': 'multipart/form-data' } : {} }
      );

      if (res.data?.content) {
        toast.success("Content added");
        onAdded(res.data.content);
        onClose();
      } else {
        toast.success(res.data?.message || "Added");
        onClose();
      }
    } catch (err) {
      console.error(err);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const resp = (err as any)?.response;
      if (resp?.status === 401) {
        toast.error("You must be logged in to add content");
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        toast.error(resp?.data?.message || "Failed to add content");
      }
    } finally {
      setLoading(false);
    }
  };

  const typeOptions = [
    { value: "image", label: "Image", icon: <Image className="w-4 h-4" /> },
    { value: "youtube", label: "YouTube", icon: <Youtube className="w-4 h-4" /> },
    { value: "tweet", label: "Twitter", icon: <Twitter className="w-4 h-4" /> },
    { value: "instagram", label: "Instagram", icon: <Instagram className="w-4 h-4" /> },
    { value: "doc", label: "Document", icon: <File className="w-4 h-4" /> },
    { value: "note", label: "Note", icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50 animate-fadeIn p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] relative border border-gray-200 transition-transform duration-300 scale-100 hover:scale-[1.01] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1 rounded-lg transition-all duration-200 z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-2rem)] p-6">
          <h3 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
            Add New Content
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
          {/* TITLE */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              value={title}
              onBlur={() => setTouched((p) => ({ ...p, title: true }))}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title..."
              className={`w-full mt-1 p-2.5 border rounded-lg outline-none transition-all duration-200 focus:ring-2 hover:shadow-lg hover:shadow-blue-200/30 bg-white text-gray-900 ${
                touched.title && !title
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-300 focus:ring-indigo-500 focus:shadow-lg focus:shadow-blue-300/40"
              }`}
            />
            {touched.title && !title && (
              <p className="text-xs text-red-500 mt-1">⚠️ Title is required</p>
            )}
          </div>

          {/* TYPE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {typeOptions.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value)}
                  title={`Select ${t.label}`}
                  className={`flex items-center justify-center gap-1 px-2 py-2 rounded-lg border transition-all duration-200 text-sm ${
                    type === t.value
                      ? "bg-gradient-to-r from-indigo-600 to-violet-500 text-white border-transparent scale-105 shadow-lg shadow-blue-300/50"
                      : "border-gray-200 text-gray-700 hover:bg-gray-100 hover:shadow-lg hover:shadow-blue-200/30"
                  }`}
                >
                  {t.icon}
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
            {!type && (
              <p className="text-xs text-red-500 mt-1">⚠️ Please select a type</p>
            )}
          </div>

          {/* LINK */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Link (optional)
            </label>
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://..."
              className="w-full mt-1 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>

          {/* TAGS */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tags (comma separated)
            </label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="design, react, learning..."
              className="w-full mt-1 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>

          {/* CONTENT */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Content / Notes
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write something..."
              className="w-full mt-1 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition resize-none"
              rows={4}
            />
          </div>

          {/* FILE */}
          {(type === 'image' || type === 'doc') && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                File
              </label>
              <input
                type="file"
                accept={type === 'image' ? 'image/*' : type === 'doc' ? '.pdf,.doc,.docx,.txt' : '*'}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                title="Choose file to upload"
                placeholder="Choose file"
                className="w-full mt-1 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>
          )}

          {/* BUTTONS */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 hover:shadow-lg hover:shadow-blue-200/30 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-500 text-white font-medium hover:opacity-90 hover:shadow-lg hover:shadow-blue-300/50 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Content"}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
