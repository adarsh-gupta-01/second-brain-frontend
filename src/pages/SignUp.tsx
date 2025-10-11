import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

import Input from "../components/Input";
import Button from "../components/Button";
import User from "../icons/User";
import Lock from "../icons/Lock";
import Eye from "../icons/Eye";
import HideEye from "../icons/HideEye";

const Signup = () => {
  const apiKey = import.meta.env.VITE_API_KEY;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { placeholder, value } = e.target;
    // Convert placeholder to the expected form key. "FirstName" should map to "firstName"
    const lower = placeholder.toLowerCase();
    const key = lower === 'firstname' ? 'firstName' : lower;
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { firstName, username, password } = formData;
    if (!firstName || !username || !password) {
      toast.error("Please fill all fields");
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
        toast.success("Signup successful! Please login.");
        navigate("/login");
      }
    } catch (err) {
      const message = (axios.isAxiosError(err) && err.response?.data?.message) ? err.response.data.message : "Something went wrong";
      toast.error(message);
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
          <Input type="text" placeholder="FirstName" autoComplete="given-name" onChange={handleChange} startIcon={<User />} require />
          <Input type="text" placeholder="Username" autoComplete="username" onChange={handleChange} startIcon={<User />} require />
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            autoComplete="new-password"
            onChange={handleChange}
            startIcon={<Lock />}
            endIcon={showPassword ? <Eye onClick={() => setShowPassword(false)} /> : <HideEye onClick={() => setShowPassword(true)} />}
            require
          />
        </div>

        <div className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 font-medium hover:underline">
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
            className="w-1/2 bg-gradient-to-r from-indigo-500 to-blue-500 hover:opacity-90"
          />
        </div>
      </form>
    </div>
  );
};

export default Signup;
