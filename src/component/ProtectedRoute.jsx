import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const getAuth = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("accessToken");
  return user && token;
};

const ProtectedRoute = () => {
  const isAuthenticated = getAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
