import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { resettoken } = useParams();
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await API.put(`/auth/resetpassword/${resettoken}`, { password });

            if (response.data.success) {
                setMessage('Password Reset Successful! Logging you in...');

                // Auto login with new token
                login(response.data.data.user, response.data.data.token);

                setTimeout(() => {
                    const role = response.data.data.user.role;
                    if (role === 'admin') {
                        navigate('/admin/dashboard');
                    } else {
                        navigate('/employee/dashboard');
                    }
                }, 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. Link may be invalid or expired.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Reset Password 🔑</h2>

                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">New Password</label>
                        <input
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter new password"
                            minLength="6"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Confirm New Password</label>
                        <input
                            type="password"
                            className="form-input"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            minLength="6"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        disabled={loading}
                    >
                        {loading ? 'Resetting...' : 'Set New Password'}
                    </button>
                </form>

                <div className="auth-link">
                    <Link to="/login">Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
