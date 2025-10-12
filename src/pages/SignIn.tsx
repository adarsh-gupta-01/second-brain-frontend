import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

import Input from "../components/Input";
import Button from "../components/Button";
import Lock from "../icons/Lock";
import User from "../icons/User";
import Eye from "../icons/Eye";
import HideEye from "../icons/HideEye";

const Login = () => {
  const apiKey = import.meta.env.VITE_API_KEY;
  const { refreshUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!username.trim() && !password.trim()) {
      toast.error("⚠️ Please enter your username and password");
      setLoading(false);
      return;
    }
    
    if (!username.trim()) {
      toast.error("⚠️ Username is required");
      setLoading(false);
      return;
    }
    
    if (!password.trim()) {
      toast.error("⚠️ Password is required");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${apiKey}/login`,
        { username, password },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("✅ " + res.data.message);
        await refreshUser();
        navigate("/");
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        // Show user-friendly error message for any login failure
        const message = err.response.data?.message;
        if (message?.toLowerCase().includes("user not found") || message?.toLowerCase().includes("doesn't exist")) {
          toast.error("❌ Username not found. Please check your username or sign up.");
        } else if (message?.toLowerCase().includes("password") && message?.toLowerCase().includes("incorrect")) {
          toast.error("❌ Incorrect password. Please try again.");
        } else {
          // Generic error for any other authentication failure
          toast.error("❌ Check your username or password and try again.");
        }
      } else {
        toast.error("❌ Unable to login. Please check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-slate-50 via-blue-50 to-white">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white/70 backdrop-blur-lg border border-white/40 rounded-3xl shadow-xl p-8 space-y-6"
      >
        <div className="text-center">
          <img
            src="/image.png"
            alt="Logo"
            className="mx-auto w-16 h-16 rounded-2xl mb-4 shadow-md"
          />
          <h2 className="text-3xl font-semibold text-gray-800">Welcome Back</h2>
          <p className="text-sm text-gray-500 mt-1">Log in to access Second Brain</p>
        </div>

        <div className="space-y-4">
          <div>
            <Input 
              type="text" 
              placeholder="Username" 
              autoComplete="username" 
              onChange={(e) => setUsername(e.target.value)} 
              startIcon={<User />} 
              require 
            />
            {username.length > 0 && username.length < 5 && (
              <p className="text-xs text-amber-600 mt-1 ml-1">⚠️ Username seems too short</p>
            )}
          </div>
          
          <div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                startIcon={<Lock />}
                require
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors z-10"
                tabIndex={-1}
              >
                {showPassword ? <Eye /> : <HideEye />}
              </button>
            </div>
            {password.length > 0 && password.length < 6 && (
              <p className="text-xs text-amber-600 mt-1 ml-1">⚠️ Password seems too short</p>
            )}
          </div>
        </div>

        <div className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 font-medium hover:underline">
            Sign Up
          </Link>
        </div>

        <div className="flex justify-center">
          <Button
            text={loading ? "Logging in..." : "Login"}
            startIcon={loading ? <Loader2 className="animate-spin" /> : undefined}
            disabled={loading}
            variant="primary"
            type="submit"
            className="w-1/2 bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-90"
          />
        </div>
      </form>
    </div>
  );
};

export default Login;
