import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';

/**
 * Apply Leave Component
 * Form for employees to submit leave applications
 */
const ApplyLeave = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        leaveType: '',
        startDate: '',
        endDate: '',
        reason: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [duration, setDuration] = useState(0);

    // Calculate duration whenever dates change
    useEffect(() => {
        if (formData.startDate && formData.endDate) {
            const start = new Date(formData.startDate);
            const end = new Date(formData.endDate);

            if (!isNaN(start) && !isNaN(end) && start <= end) {
                const diffTime = Math.abs(end - start);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                setDuration(diffDays);
            } else {
                setDuration(0);
            }
        } else {
            setDuration(0);
        }
    }, [formData.startDate, formData.endDate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validate dates
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (end < start) {
            setError('End date cannot be before start date');
            return;
        }

        if (start < today) {
            setError('Cannot apply for leave in the past');
            return;
        }

        setLoading(true);

        try {
            const response = await API.post('/leaves', formData);

            if (response.data.success) {
                setSuccess('Leave application submitted successfully!');
                setFormData({
                    leaveType: '',
                    startDate: '',
                    endDate: '',
                    reason: '',
                });

                // Redirect to leave history after 2 seconds
                setTimeout(() => {
                    navigate('/employee/leave-history');
                }, 2000);
            }
        } catch (err) {
            setError(
                err.response?.data?.message || 'Failed to submit leave application'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard">
            <div className="container">
                <div className="dashboard-header" style={{ textAlign: 'center' }}>
                    <h1 className="dashboard-title">✨ Apply for Leave</h1>
                    <p className="dashboard-subtitle">
                        Plan your time off effectively
                    </p>
                </div>

                <div className="card" style={{ maxWidth: '600px', margin: '0 auto', borderTop: '4px solid var(--primary-color)' }}>
                    <div className="card-header" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                        New Leave Request
                    </div>

                    {error && <div className="alert alert-error">⚠️ {error}</div>}
                    {success && <div className="alert alert-success">✅ {success}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Leave Type</label>
                            <select
                                name="leaveType"
                                className="form-select"
                                value={formData.leaveType}
                                onChange={handleChange}
                                required
                                style={{ height: '48px' }}
                            >
                                <option value="">Select a category...</option>
                                <option value="Sick Leave">🤒 Sick Leave</option>
                                <option value="Casual Leave">🏖️ Casual Leave</option>
                                <option value="Annual Leave">📅 Annual Leave</option>
                                <option value="Maternity Leave">🤰 Maternity Leave</option>
                                <option value="Paternity Leave">👨‍🍼 Paternity Leave</option>
                                <option value="Work from Home">🏠 Work from Home</option>
                                <option value="Other">❓ Other</option>
                            </select>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label">From Date</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    className="form-input"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">To Date</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    className="form-input"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {duration > 0 && (
                            <div style={{
                                backgroundColor: 'var(--light-bg)',
                                padding: '0.75rem',
                                borderRadius: '0.5rem',
                                marginBottom: '1.25rem',
                                color: 'var(--text-secondary)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <span>⏱️ Total Duration:</span>
                                <strong style={{ color: 'var(--primary-color)' }}>
                                    {duration} {duration === 1 ? 'Day' : 'Days'}
                                </strong>
                            </div>
                        )}

                        <div className="form-group">
                            <label className="form-label">Reason for Leave</label>
                            <textarea
                                name="reason"
                                className="form-textarea"
                                placeholder="Please provide a detailed reason..."
                                value={formData.reason}
                                onChange={handleChange}
                                required
                                maxLength="500"
                                style={{ minHeight: '120px' }}
                            ></textarea>
                            <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                                {formData.reason.length}/500 characters
                            </div>
                        </div>

                        <div className="action-buttons" style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                            >
                                {loading ? (
                                    <>⏳ Applying...</>
                                ) : (
                                    <>✈️ Apply Leave</>
                                )}
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline"
                                onClick={() => navigate('/employee/dashboard')}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ApplyLeave;
