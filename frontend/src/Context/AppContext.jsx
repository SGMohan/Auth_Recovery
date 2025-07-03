import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const AppContext = createContext();
export const useApp = () => useContext(AppContext);

const AppProvider = ({ children }) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [userDetails, setUserDetails] = useState(null);
  const [isLogin, setIsLogin] = useState(false);

  // Add user persistence on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserDetails();
    }
  }, []);

  const fetchUserDetails = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/auth/user/:_id`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setUserDetails(res.data.data);
        setIsLogin(true);
      }
    } catch (error) {
      localStorage.removeItem("token");
      setUserDetails(null);
      setIsLogin(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        BACKEND_URL,
        userDetails,
        setUserDetails,
        isLogin,
        setIsLogin,
        fetchUserDetails,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppProvider;
