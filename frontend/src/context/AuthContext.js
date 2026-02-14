import React, { createContext, useState, useEffect } from 'react';

// Create Auth Context
export const AuthContext = createContext();

/**
 * AuthProvider Component
 * Manages authentication state across the application
 * Stores user data in localStorage for persistence
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // Login function
    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    // Logout function
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    // Check if user is admin
    const isAdmin = () => {
        return user && user.role === 'admin';
    };

    const value = {
        user,
        login,
        logout,
        isAdmin,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
