import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../Context/AppContext";
import logo from "../assets/logo.svg";
import arrow_icon from "../assets/arrow_icon.svg";
import axios from "axios";

const AppHeader = () => {
  const { userDetails, isLogin, BACKEND_URL, setIsLogin, setUserDetails } =
    useApp();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${BACKEND_URL}/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear client-side state
      localStorage.removeItem("token");
      setIsLogin(false);
      setUserDetails(null);
      navigate("/");
    }
  };

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0 left-0">
      <img
        src={logo}
        alt="App Logo"
        className="w-24 sm:w-32 cursor-pointer"
        onClick={() => navigate("/")}
      />

      {isLogin && userDetails?.name ? (
        <div className="relative">
          <button
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black text-white flex items-center justify-center hover:opacity-80 transition-opacity hover:cursor-pointer"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {userDetails.name.charAt(0).toUpperCase()}
            <div
              className={`absolute right-0 top-0 z-10 pt-10 ${
                showDropdown ? "block" : "hidden"
              } text-gray-800 rounded-lg shadow-lg w-40`}
            >
              <ul className="text-sm list-none p-2 m-0 bg-gray-100">
                <li
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </li>
              </ul>
            </div>
          </button>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 px-4 py-1.5 sm:px-6 sm:py-2 rounded-full border border-gray-600 hover:bg-gray-100 hover:cursor-pointer transition-all text-gray-800 text-sm sm:text-base"
        >
          Login
          <img src={arrow_icon} alt="Arrow" className="w-3 sm:w-4" />
        </button>
      )}
    </div>
  );
};

export default AppHeader;
