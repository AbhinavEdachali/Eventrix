import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../common_components/AuthContext"; // Ensure correct import path

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const auth = useContext(AuthContext);

  // ✅ Debugging: Ensure `auth` is not undefined
  if (!auth) {
    console.error("AuthContext is not available. Ensure AuthProvider wraps the App.");
    return <Navigate to="/login" />;
  }

  const { isLoggedIn, user, loading } = auth;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ message: "You need to log in to access this page." }} />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace state={{ message: "You do not have permission to access this page." }} />;
  }

  return children;
};

export default PrivateRoute;
