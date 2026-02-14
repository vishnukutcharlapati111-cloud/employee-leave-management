import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * PrivateRoute Component
 * Protects routes that require authentication
 * Redirects to login if user is not authenticated
 */
const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
