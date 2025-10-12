import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

import Input from "../components/Input";
import Button from "../components/Button";
import User from "../icons/User";
import Lock from "../icons/Lock";
import Eye from "../icons/Eye";
import HideEye from "../icons/HideEye";

const Signup = () => {
  const apiKey = import.meta.env.VITE_API_KEY;
  const { refreshUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    firstName: "",
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { placeholder, value } = e.target;
    // Convert placeholder to the expected form key. "Name" should map to "firstName"
    const lower = placeholder.toLowerCase();
    const key = lower === 'name' ? 'firstName' : lower;
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
    
    // Real-time validation
    validateField(key, value);
  };

  const validateField = (field: string, value: string) => {
    let error = "";
    
    switch (field) {
      case "firstName":
        if (value.trim().length === 0) {
          error = "Name cannot be empty";
        }
        break;
      case "username":
        if (value.trim().length === 0) {
          error = "Username is required";
        } else if (value.length < 5) {
          error = "Username must be at least 5 characters";
        } else if (!/^[a-zA-Z0-9@$!%*?&#_-]+$/.test(value)) {
          error = "Username can only contain letters, digits, and symbols";
        }
        break;
      case "password":
        if (value.length === 0) {
          error = "Password is required";
        } else if (value.length < 6) {
          error = "Password must be at least 6 characters";
        } else if (!/(?=.*[a-z])/.test(value)) {
          error = "Password must contain at least one lowercase letter";
        } else if (!/(?=.*[A-Z])/.test(value)) {
          error = "Password must contain at least one uppercase letter";
        } else if (!/(?=.*\d)/.test(value)) {
          error = "Password must contain at least one digit";
        } else if (!/(?=.*[@$!%*?&#])/.test(value)) {
          error = "Password must contain at least one special character (@$!%*?&#)";
        }
        break;
    }
    
    setValidationErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { firstName, username, password } = formData;
    
    // Validate all fields
    validateField("firstName", firstName);
    validateField("username", username);
    validateField("password", password);
    
    // Client-side validation
    if (!firstName || !username || !password) {
      toast.error("Please fill all fields");
      setIsSubmitting(false);
      return;
    }
    
    if (firstName.trim().length === 0) {
      toast.error("Name cannot be empty");
      setIsSubmitting(false);
      return;
    }
    
    if (username.trim().length < 5) {
      toast.error("Username must be at least 5 characters");
      setIsSubmitting(false);
      return;
    }
    
    if (!/^[a-zA-Z0-9@$!%*?&#_-]+$/.test(username)) {
      toast.error("Username can only contain letters, digits, and symbols");
      setIsSubmitting(false);
      return;
    }
    
    // Password validation
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      setIsSubmitting(false);
      return;
    }
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/;
    if (!passwordRegex.test(password)) {
      toast.error("Password must contain uppercase, lowercase, digit & special character (@$!%*?&#)");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await axios.post(
        `${apiKey}/signup`,
        { firstName, username, password },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("🎉 Signup successful! Welcome to Second Brain.");
        // Refresh user context to load the authenticated session
        await refreshUser();
        navigate("/");
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        const message = err.response.data.message;
        // Provide specific error messages
        if (message.toLowerCase().includes("username") && message.toLowerCase().includes("already")) {
          toast.error("❌ Username already taken. Please choose a different one.");
        } else if (message.toLowerCase().includes("exist")) {
          toast.error("❌ User already exists. Try logging in instead.");
        } else {
          toast.error(message);
        }
      } else {
        toast.error("❌ Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-white">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md bg-white/70 backdrop-blur-lg border border-white/40 rounded-3xl shadow-xl p-8 space-y-6"
      >
        <div className="text-center">
          <img
            src="/image.png"
            alt="Logo"
            className="mx-auto w-16 h-16 rounded-2xl mb-4 shadow-md"
          />
          <h2 className="text-3xl font-semibold text-gray-800">Join Second Brain</h2>
          <p className="text-sm text-gray-500 mt-1">Create your account and start storing your thoughts</p>
        </div>

        <div className="space-y-4">
          <div>
            <Input type="text" placeholder="Name" autoComplete="given-name" onChange={handleChange} startIcon={<User />} require />
            {validationErrors.firstName && (
              <p className="text-xs text-rose-600 mt-1 ml-1">⚠️ {validationErrors.firstName}</p>
            )}
          </div>
          
          <div>
            <Input type="text" placeholder="Username" autoComplete="username" onChange={handleChange} startIcon={<User />} require />
            {validationErrors.username && (
              <p className="text-xs text-rose-600 mt-1 ml-1">⚠️ {validationErrors.username}</p>
            )}
          </div>
          
          <div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                autoComplete="new-password"
                onChange={handleChange}
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
            {validationErrors.password && (
              <p className="text-xs text-rose-600 mt-1 ml-1">⚠️ {validationErrors.password}</p>
            )}
          </div>
        </div>
        
        <div className="text-xs text-slate-600 bg-slate-50 rounded-lg p-3 space-y-1.5">
          <p className="font-semibold text-slate-700 flex items-center gap-1">
            <span>📋</span> Requirements:
          </p>
          <ul className="space-y-1 ml-5">
            <li className={`flex items-start gap-2 ${formData.username.length >= 5 ? 'text-emerald-600' : 'text-slate-500'}`}>
              <span className="mt-0.5">{formData.username.length >= 5 ? '✓' : '○'}</span>
              <span>Username: min 5 characters (letters, digits, symbols allowed)</span>
            </li>
            <li className={`flex items-start gap-2 ${formData.password.length >= 6 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/.test(formData.password) ? 'text-emerald-600' : 'text-slate-500'}`}>
              <span className="mt-0.5">{formData.password.length >= 6 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/.test(formData.password) ? '✓' : '○'}</span>
              <span>Password: min 6 characters with uppercase, lowercase, digit & special character (@$!%*?&#)</span>
            </li>
          </ul>
        </div>

        <div className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Login
          </Link>
        </div>

        <div className="flex justify-center">
          <Button
            text={isSubmitting ? "Creating..." : "Sign Up"}
            startIcon={isSubmitting ? <Loader2 className="animate-spin" /> : undefined}
            disabled={isSubmitting}
            variant="primary"
            type="submit"
            className="w-1/2 bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-90"
          />
        </div>
      </form>
    </div>
  );
};

export default Signup;
