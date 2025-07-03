import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import logo from "../assets/logo.svg";
import lock_icon from "../assets/lock_icon.svg";
import { useApp } from "../Context/AppContext";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { BACKEND_URL } = useApp();

  // Get token and email from URL query parameters
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    const validateToken = async () => {
      if (!token || !email) {
        navigate("/forgot-password");
        return;
      }

      try {
        const res = await axios.get(
          `${BACKEND_URL}/auth/validate-resetToken/${token}`,
          {
            params: {
              email: decodeURIComponent(email),
            },
          }
        );

        if (res.data.valid) {
          setIsValidToken(true);
        } else {
          setIsValidToken(false);
          toast.error(res.data.message || "Invalid or expired reset link");
          navigate("/forgot-password");
        }
      } catch (err) {
        setIsValidToken(false);
        console.error("Validation error:", err);

        // More specific error handling
        if (err.response) {
          if (err.response.status === 404) {
            toast.error("Validation endpoint not found - contact support");
          } else {
            toast.error(err.response.data?.message || "Error validating token");
          }
        } else {
          toast.error("Network error - please check your connection");
        }

        navigate("/forgot-password");
      }
    };

    validateToken();
  }, [token, email, navigate, BACKEND_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setIsLoading(true);
      const res = await axios.post(`${BACKEND_URL}/auth/reset-password`, {
        resetToken: token,
        email: decodeURIComponent(email),
        newPassword: password,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login?mode=login");
      } else {
        toast.error(res.data.message || "Password reset failed");
        if (res.data.invalidToken) {
          navigate("/forgot-password");
        }
      }
    } catch (error) {
      console.error("Reset error:", error);
      toast.error(
        error.response?.data?.message ||
          "Password reset failed. Please try again."
      );
      if (error.response?.data?.invalidToken) {
        navigate("/forgot-password");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidToken === false) {
    return (
      <div className="flex items-center justify-center min-h-screen px-6 bg-gradient-to-br from-blue-200 to-purple-400">
        <div className="bg-slate-900 shadow-lg rounded-lg p-10 sm:p-12 w-full sm:w-96 text-center">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Invalid Reset Link
          </h2>
          <p className="text-gray-400 mb-6">
            This password reset link has expired or is invalid.
          </p>
          <button
            onClick={() => navigate("/forgot-password")}
            className="w-full bg-gradient-to-br from-indigo-500 to-indigo-900 text-white py-2.5 rounded-full font-medium hover:opacity-90 transition-opacity flex items-center justify-center disabled:opacity-50"
          >
            Get New Reset Link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={logo}
        alt="Logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      <div className="bg-slate-900 shadow-lg rounded-lg p-10 sm:p-12 w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          Reset Password
        </h2>
        {email && (
          <p className="text-gray-400 text-center mb-2 text-sm">
            For: {decodeURIComponent(email)}
          </p>
        )}
        <p className="text-gray-400 text-center mb-6 text-xs">
          Enter your new password below
        </p>

        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-3 w-full rounded-full px-5 py-2.5 mb-4 bg-[#333A52]">
            <img src={lock_icon} alt="Password" className="w-4 h-4" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent outline-none text-white flex-1 min-w-0 placeholder-gray-400"
              placeholder="New Password"
              required
            />
          </div>

          <div className="flex items-center gap-3 w-full rounded-full px-5 py-2.5 mb-4 bg-[#333A52]">
            <img src={lock_icon} alt="Confirm Password" className="w-4 h-4" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-transparent outline-none text-white flex-1 min-w-0 placeholder-gray-400"
              placeholder="Confirm Password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-br from-indigo-500 to-indigo-900 text-white py-2.5 rounded-full font-medium hover:opacity-90 transition-opacity flex items-center justify-center disabled:opacity-50 hover:cursor-pointer"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Resetting...
              </span>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-400">
          <p>
            Remember your password?{" "}
            <span
              className="text-indigo-400 hover:text-indigo-300 cursor-pointer"
              onClick={() =>navigate("/login?mode=login")}
            >
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
