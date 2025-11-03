// Admin/src/components/AdminLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const AdminLayout = () => {
  const { isAuthenticated } = useAuth();

  // Only show the layout if authenticated
  if (!isAuthenticated) {
    return null; // Or a loading spinner, but ProtectedRoute should handle redirect
  }

  return (
    <div className="admin-layout">
      <Navbar />
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

