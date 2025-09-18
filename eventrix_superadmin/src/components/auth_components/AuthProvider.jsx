import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import backendGlobalRoute from "../../config/config";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        fetchUserData(decodedUser.id);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Failed to decode token:", error);
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setUser(null);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
    setLoading(false);
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(
        `${backendGlobalRoute}/api/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const login = (token) => {
    localStorage.setItem("token", token);
    try {
      const decodedUser = jwtDecode(token);
      fetchUserData(decodedUser.id);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Failed to decode token:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
