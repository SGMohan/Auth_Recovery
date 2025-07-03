import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import mail_icon from "../assets/mail_icon.svg";
import { useState } from "react";
import axios from "axios";
import { useApp } from "../Context/AppContext";
import Loading from "../Components/Loading"; // Import the Loading component

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { BACKEND_URL } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(`${BACKEND_URL}/auth/forgot-password`, {
        email: email,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setEmailSent(true);
      } else {
        toast.success("If this email exists, a reset link has been sent");
        setEmailSent(true);
      }
    } catch (error) {
      console.error("Password reset error:", error);
      if (error.response) {
        if (error.response.status === 500) {
          toast.error("Password reset service is currently unavailable");
        } else {
          toast.error(
            error.response.data?.message || "Failed to send reset link"
          );
        }
      } else {
        toast.error("Network error. Please check your connection");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={logo}
        alt="Login"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      <div className="bg-slate-900 shadow-lg rounded-lg p-10 sm:p-12 w-full sm:w-96 text-indigo-300 text-sm">
        {!emailSent ? (
          <>
            <h2 className="text-3xl font-semibold text-white text-center mb-3">
              Forgot Password ?
            </h2>

            <p className="text-gray-400 text-center mb-6 text-xs">
              Enter your email address and we'll send you a link to reset your
              password
            </p>

            <form onSubmit={handleSubmit}>
              <div className="flex items-center gap-3 w-full rounded-full px-5 py-2.5 mb-4 bg-[#333A52]">
                <img src={mail_icon} alt="Mail Icon" className="w-4 h-4" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent outline-none text-white flex-1 min-w-0 placeholder-gray-400"
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-gradient-to-br from-indigo-500 to-indigo-900 text-white py-2.5 rounded-full font-medium ${
                  isLoading
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:opacity-90"
                } transition-opacity flex items-center justify-center hover:cursor-pointer`}
              >
                {isLoading ? (
                  <>
                    <Loading size="sm" color="white" />
                    <span className="ml-2">Sending...</span>
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-gray-400">
              <p>
                Remember your password?
                <span
                  className="text-indigo-400 hover:text-indigo-300 cursor-pointer ml-1 hover:cursor-pointer"
                  onClick={() => navigate("/login?mode=login")}
                >
                  Sign in
                </span>
              </p>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center justify-center h-12 w-12">
                <img src={mail_icon} alt="Mail Icon" className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-semibold text-white">
                Check Your Email
              </h2>
            </div>

            <p className="text-gray-300 mb-4 text-sm">
              We've sent a password reset link to{" "}
              <span className="text-white font-medium">{email}</span>
            </p>

            <p className="text-gray-400 text-xs mb-6">
              The link will expire in 15 minutes. If you don't see the email,
              check your spam folder.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setEmailSent(false);
                  setEmail("");
                }}
                className="text-indigo-400 hover:text-indigo-300 text-sm font-medium hover:cursor-pointer"
              >
                Resend Email
              </button>

              <button
                onClick={() => navigate("/login?mode=login")}
                className="text-indigo-400 hover:text-indigo-300 text-sm font-medium hover:cursor-pointer"
              >
                Back to Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
