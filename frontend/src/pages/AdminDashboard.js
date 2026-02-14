import React, { useState, useEffect } from 'react';
import API from '../api/axios';

/**
 * Admin Dashboard Component
 * Shows overall leave statistics for all employees
 */
const AdminDashboard = () => {
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
    });
    const [recentLeaves, setRecentLeaves] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch statistics
            const statsResponse = await API.get('/leaves/stats');
            if (statsResponse.data.success) {
                setStats(statsResponse.data.data);
            }

            // Fetch recent leaves
            const leavesResponse = await API.get('/leaves/all');
            if (leavesResponse.data.success) {
                setRecentLeaves(leavesResponse.data.data.slice(0, 5));
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <div className="container">
                <div className="dashboard-header">
                    <h1 className="dashboard-title">Admin Dashboard</h1>
                    <p className="dashboard-subtitle">
                        Overview of all employee leave applications
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-label">Total Applications</div>
                        <div className="stat-value">{stats.total}</div>
                    </div>
                    <div className="stat-card warning">
                        <div className="stat-label">Pending Review</div>
                        <div className="stat-value">{stats.pending}</div>
                    </div>
                    <div className="stat-card success">
                        <div className="stat-label">Approved</div>
                        <div className="stat-value">{stats.approved}</div>
                    </div>
                    <div className="stat-card danger">
                        <div className="stat-label">Rejected</div>
                        <div className="stat-value">{stats.rejected}</div>
                    </div>
                </div>

                {/* Recent Leaves */}
                <div className="card">
                    <h2 className="card-header">Recent Leave Applications</h2>
                    {recentLeaves.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">📭</div>
                            <div className="empty-state-text">No leave applications yet</div>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Employee</th>
                                        <th>Department</th>
                                        <th>Leave Type</th>
                                        <th>Duration</th>
                                        <th>Status</th>
                                        <th>Applied On</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentLeaves.map((leave) => (
                                        <tr key={leave._id}>
                                            <td>
                                                <strong>{leave.employeeName}</strong>
                                                <br />
                                                <small style={{ color: 'var(--text-secondary)' }}>
                                                    {leave.employeeEmail}
                                                </small>
                                            </td>
                                            <td>{leave.employee?.department || 'N/A'}</td>
                                            <td>{leave.leaveType}</td>
                                            <td>
                                                {new Date(leave.startDate).toLocaleDateString()} -{' '}
                                                {new Date(leave.endDate).toLocaleDateString()}
                                                <br />
                                                <small style={{ color: 'var(--text-secondary)' }}>
                                                    ({leave.totalDays} days)
                                                </small>
                                            </td>
                                            <td>
                                                <span className={`badge badge-${leave.status.toLowerCase()}`}>
                                                    {leave.status}
                                                </span>
                                            </td>
                                            <td>{new Date(leave.appliedDate).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
