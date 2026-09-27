import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiEye,
  FiEyeOff,
  FiMail,
  FiLock,
  FiUser,
  FiCheck,
} from "react-icons/fi";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const {
      name,
      email,
      password,
      confirmPassword,
    } = formData;

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          name,
          email,
          password,
        }
      );

      console.log("Registration successful:", response.data);

      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Registration error:", error);

      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch =
    formData.confirmPassword &&
    formData.password === formData.confirmPassword;

  return (
    <div className="min-h-screen bg-[#f8f7f2] flex items-center justify-center px-6 py-10 relative overflow-hidden">

      {/* Decorative backgrounds */}
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-[#e8def8] rounded-full opacity-70" />

      <div className="absolute -bottom-24 -left-20 w-80 h-80 bg-[#dcebdc] rounded-full opacity-70" />

      <div className="w-full max-w-md relative z-10">

        {/* Logo */}
        <div className="text-center mb-8">

          <Link
            to="/"
            className="text-3xl font-bold text-[#355c4a]"
          >
            Smart<span className="text-[#8b6bb1]">
              Money
            </span>
          </Link>

          <p className="text-gray-500 mt-2">
            Start your smarter financial journey
          </p>
        </div>

        {/* Register card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">

          <h1 className="text-2xl font-bold text-gray-800">
            Create your account
          </h1>

          <p className="text-gray-500 mt-1 mb-6">
            Start managing your money with SmartMoney.
          </p>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>

              <div className="relative">

                <FiUser
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#6f9f83] focus:ring-2 focus:ring-[#6f9f83]/20"
                />

              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>

              <div className="relative">

                <FiMail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#6f9f83] focus:ring-2 focus:ring-[#6f9f83]/20"
                />

              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <div className="relative">

                <FiLock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  className="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#6f9f83] focus:ring-2 focus:ring-[#6f9f83]/20"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#355c4a]"
                >
                  {showPassword ? (
                    <FiEyeOff size={18} />
                  ) : (
                    <FiEye size={18} />
                  )}
                </button>

              </div>

              <p className="text-xs text-gray-400 mt-2">
                Use at least 6 characters.
              </p>
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>

              <div className="relative">

                <FiLock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  className="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#6f9f83] focus:ring-2 focus:ring-[#6f9f83]/20"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#355c4a]"
                >
                  {showConfirmPassword ? (
                    <FiEyeOff size={18} />
                  ) : (
                    <FiEye size={18} />
                  )}
                </button>

              </div>

              {passwordsMatch && (
                <div className="flex items-center gap-1.5 mt-2 text-xs text-[#5D8B68]">
                  <FiCheck size={13} />
                  Passwords match
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#355c4a] hover:bg-[#2d4f40] text-white py-3.5 rounded-xl font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? "Creating account..."
                : "Create Account"}
            </button>
          </form>

          {/* Benefits */}
          <div className="mt-6 rounded-2xl bg-[#f7faf7] border border-[#e5eee6] p-4">

            <p className="text-xs font-semibold text-[#526057] mb-3">
              Why SmartMoney?
            </p>

            <div className="space-y-2">

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e4f0e5] text-[#5d8b68]">
                  <FiCheck size={11} />
                </span>
                Track income and expenses
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#eee9f8] text-[#806ba7]">
                  <FiCheck size={11} />
                </span>
                Create budgets and goals
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#fce9de] text-[#c17b55]">
                  <FiCheck size={11} />
                </span>
                Understand your financial progress
              </div>

            </div>
          </div>

          {/* Login */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}

            <Link
              to="/login"
              className="font-semibold text-[#6f9f83] hover:underline"
            >
              Login
            </Link>
          </p>

        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Smart money. Smarter decisions. ✨
        </p>

      </div>
    </div>
  );
}

export default Register;
