import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedAdminRoute = ({ children }) => {
    const { user } = useSelector((state) => state.auth);

    // Check if user exists and has admin role
    if (!user) {
        // Not logged in - redirect to admin login
        return <Navigate to="/admin/login" replace />;
    }

    if (user.role !== 'admin') {
        // Logged in but not an admin - redirect to admin login
        return <Navigate to="/admin/login" replace />;
    }

    // User is authenticated and is admin - allow access
    return children;
};

export default ProtectedAdminRoute;
