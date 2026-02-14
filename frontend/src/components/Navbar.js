import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * Navbar Component
 * Navigation bar with role-based menu items
 * Shows different options for admin and employee users
 */
const Navbar = () => {
    const { user, logout, isAdmin } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) {
        return null;
    }

    return (
        <nav className="navbar">
            <div className="container">
                <div className="navbar-content">
                    <Link to="/" className="navbar-brand">
                        📋 Leave Management
                    </Link>
                    <div className="navbar-menu">
                        <span style={{ opacity: 0.9 }}>
                            Welcome, <strong>{user.name}</strong> ({user.role})
                        </span>
                        {isAdmin() ? (
                            <>
                                <Link to="/admin/dashboard" className="navbar-link">
                                    Dashboard
                                </Link>
                                <Link to="/admin/leaves" className="navbar-link">
                                    All Leaves
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/employee/dashboard" className="navbar-link">
                                    Dashboard
                                </Link>
                                <Link to="/employee/apply-leave" className="navbar-link">
                                    Apply Leave
                                </Link>
                                <Link to="/employee/leave-history" className="navbar-link">
                                    My Leaves
                                </Link>
                            </>
                        )}
                        <button onClick={handleLogout} className="btn btn-logout btn-sm">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
