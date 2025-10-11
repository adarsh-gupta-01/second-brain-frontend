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

    if (!username.trim() || !password.trim()) {
      toast.error("Please fill all fields");
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
        toast.success(res.data.message);
        await refreshUser();
        navigate("/");
      }
    } catch (err) {
      const message = (axios.isAxiosError(err) && err.response?.data?.message) ? err.response.data.message : "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-purple-50 via-indigo-50 to-white">
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
          <Input type="text" placeholder="Username" autoComplete="username" onChange={(e) => setUsername(e.target.value)} startIcon={<User />} require />
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            startIcon={<Lock />}
            endIcon={showPassword ? <Eye onClick={() => setShowPassword(false)} /> : <HideEye onClick={() => setShowPassword(true)} />}
            require
          />
        </div>

        <div className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-indigo-600 font-medium hover:underline">
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
            className="w-1/2 bg-gradient-to-r from-indigo-500 to-blue-500 hover:opacity-90"
          />
        </div>
      </form>
    </div>
  );
};

export default Login;
