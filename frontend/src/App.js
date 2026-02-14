import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ApplyLeave from './pages/ApplyLeave';
import LeaveHistory from './pages/LeaveHistory';
import AdminDashboard from './pages/AdminDashboard';
import ManageLeaves from './pages/ManageLeaves';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import './index.css';

/**
 * Main App Component
 * Sets up routing and authentication context
 */
function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/passwordreset/:resettoken" element={<ResetPassword />} />

                    {/* Employee Routes */}
                    <Route
                        path="/employee/dashboard"
                        element={
                            <PrivateRoute>
                                <EmployeeDashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/employee/apply-leave"
                        element={
                            <PrivateRoute>
                                <ApplyLeave />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/employee/leave-history"
                        element={
                            <PrivateRoute>
                                <LeaveHistory />
                            </PrivateRoute>
                        }
                    />

                    {/* Admin Routes */}
                    <Route
                        path="/admin/dashboard"
                        element={
                            <PrivateRoute>
                                <AdminDashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/admin/leaves"
                        element={
                            <PrivateRoute>
                                <ManageLeaves />
                            </PrivateRoute>
                        }
                    />

                    {/* Default Route */}
                    <Route path="/" element={<Navigate to="/login" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
