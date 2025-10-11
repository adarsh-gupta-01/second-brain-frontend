import { X, LogOut } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface LogoutModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LogoutModal({ open, onClose }: LogoutModalProps) {
  const apiKey = import.meta.env.VITE_API_KEY;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleLogout = async () => {
    setLoading(true);
    try {
      await axios.post(`${apiKey}/logout`, {}, { withCredentials: true });
      toast.success("Logged out successfully");
      onClose();
      navigate("/login");
    } catch (err) {
      console.error(err);
      const resp = (err as { response?: { data?: { message?: string } } }).response;
      toast.error(resp?.data?.message || "Failed to logout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50 animate-fadeIn">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl w-full max-w-md p-6 relative border border-white/30">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
          title="Close dialog"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-red-50 rounded-full">
            <LogOut className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Confirm Logout</h3>
        </div>

        <p className="text-gray-600 mb-6">
          Are you sure you want to log out? You'll need to sign in again to access your content.
        </p>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition font-medium"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            {loading ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </div>
  );
}
