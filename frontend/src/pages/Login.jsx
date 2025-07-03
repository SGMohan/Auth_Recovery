import { useState, useEffect } from "react";
import logo from "../assets/logo.svg";
import person_icon from "../assets/person_icon.svg";
import mail_icon from "../assets/mail_icon.svg";
import lock_icon from "../assets/lock_icon.svg";
import { useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const { BACKEND_URL, setUserDetails, setIsLogin, fetchUserDetails } =
    useApp();
  const [state, setState] = useState(`Sign Up`);
  const [name, setName] = useState(``);
  const [email, setEmail] = useState(``);
  const [password, setPassword] = useState(``);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const mode = query.get("mode");
    if (mode === "login") {
      setState("Login");
    }
  }, [location.search]);
  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      if (state === "Sign Up") {
        const res = await axios.post(`${BACKEND_URL}/auth/register`, {
          name,
          email,
          password,
        });
        if (res.data.success) {
          toast.success("Signup successful");
          setUserDetails(res.data.data);
          setIsLogin(true);
          localStorage.setItem("token", res.data.token);
          navigate("/");
        } else {
          toast.error(res.data.message);
        }
      } else {
        const res = await axios.post(`${BACKEND_URL}/auth/login`, {
          email,
          password,
        });
        if (res.data.success) {
          toast.success("Login successful");
          localStorage.setItem("token", res.data.token);
          await fetchUserDetails();
          navigate("/");
        } else {
          toast.error(res.data.message);

        }
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
        <img
          onClick={() => navigate("/")}
          src={logo}
          alt="Login"
          className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
        />
        <div className="bg-slate-900 shadow-lg rounded-lg p-10 sm:p-12 w-full sm:w-96 text-indigo-300 text-sm">
          <h2 className="text-3xl font-semibold text-white text-center mb-3 ">
            {state === "Sign Up" ? "Create Account" : "Login"}
          </h2>
          <p className="text-gray-400 text-center mb-6 text-sm ">
            {state === "Sign Up" ? "Create your account" : "Login your account"}
          </p>
          <form onSubmit={onSubmitHandler}>
            {state === "Sign Up" && (
              <div className="flex items-center gap-3 w-full rounded-full px-5 py-2.5 mb-4 bg-[#333A52]">
                <img src={person_icon} alt="Person Icon" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-transparent outline-none text-white flex-1 min-w-0"
                  placeholder="Full Name"
                  required
                />
              </div>
            )}
            <div className="flex items-center gap-3 w-full rounded-full px-5 py-2.5 mb-4 bg-[#333A52]">
              <img src={mail_icon} alt="Mail Icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent outline-none text-white flex-1 min-w-0"
                placeholder="Email Address"
                required
              />
            </div>
            <div className="flex items-center gap-3 w-full rounded-full px-5 py-2.5 mb-4 bg-[#333A52]">
              <img src={lock_icon} alt="Lock Icon" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent outline-none text-white flex-1 min-w-0"
                placeholder="Password"
                required
              />
            </div>
            <p
              onClick={() => navigate("/forgot-password")}
              className="text-indigo-500 mb-4 cursor-pointer text-xs"
            >
              Forgot Password ?
            </p>
            <button className="w-full bg-gradient-to-br from-indigo-500 to-indigo-900 text-white py-2.5 rounded-full font-medium hover:cursor-pointer">
              {state}
            </button>
          </form>
          {state === "Sign Up" ? (
            <p className="text-center mt-4 text-gray-500 text-xs ">
              Already have an account?{" "}
              <span
                onClick={() => setState("Login")}
                className="text-indigo-500 cursor-pointer underline "
              >
                Login
              </span>
            </p>
          ) : (
            <p className="text-center mt-4 text-gray-500 text-xs ">
              Don't have an account?{" "}
              <span
                onClick={() => setState("Sign Up")}
                className="text-indigo-500 cursor-pointer underline "
              >
                Sign Up
              </span>
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Login;
