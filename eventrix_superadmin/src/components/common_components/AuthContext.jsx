import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

// Create AuthContext
export const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token); // ✅ Decode token properly
        setUser(decoded);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Failed to decode token:", error);
        localStorage.removeItem("token");
        setUser(null);
        setIsLoggedIn(false);
      }
    }

    const storedAuthToken = localStorage.getItem("authToken");
    const storedUserRole = localStorage.getItem("userRole");
    if (storedAuthToken && storedUserRole) {
      setAuthToken(storedAuthToken);
      setUserRole(storedUserRole);
    }

    setLoading(false);
  }, []);

  // ✅ Automatically update Header.jsx when login occurs
  useEffect(() => {
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  const syncAuth = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Failed to decode token:", error);
        localStorage.removeItem("token");
        setUser(null);
        setIsLoggedIn(false);
      }
    }
  };

  const login = (token, role = null) => {
    localStorage.setItem("token", token);
    window.dispatchEvent(new Event("storage")); // ✅ Force header update

    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
      setIsLoggedIn(true);

      // ✅ Store user details in localStorage
      localStorage.setItem("user", JSON.stringify(decoded));

      if (role) {
        setAuthToken(token);
        setUserRole(role);
        localStorage.setItem("authToken", token);
        localStorage.setItem("userRole", role);
      }
    } catch (error) {
      console.error("Invalid token on login:", error);
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession("current"); // Clear Appwrite session
      console.log("Appwrite session cleared successfully");
    } catch (error) {
      console.error("Failed to clear Appwrite session:", error.message);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    setAuthToken(null);
    setUserRole(null);
    setUser(null);
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("storage")); // ✅ Ensure header updates on logout
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        login,
        logout,
        loading,
        authToken,
        userRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
