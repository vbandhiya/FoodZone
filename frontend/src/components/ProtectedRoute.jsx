import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false, allowAdmin = true, requireAuth = true }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-white dark:bg-gray-950">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>;
  }

  // If page requires Auth but no user is logged in
  if (requireAuth && !currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If user is logged in but the page is strictly for Non-Admins (like Home/Cart/Profile)
  if (currentUser && !allowAdmin && currentUser.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  // If page requires Admin but logged-in user is a standard User
  if (requireAdmin && currentUser?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
