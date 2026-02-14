import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';

/**
 * Employee Dashboard Component
 * Shows leave statistics and recent leave applications
 */
const EmployeeDashboard = () => {
    const { user } = useContext(AuthContext);
    const [leaves, setLeaves] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const response = await API.get('/leaves/my-leaves');
            if (response.data.success) {
                const leavesData = response.data.data;
                setLeaves(leavesData.slice(0, 5)); // Show only recent 5

                // Calculate stats
                setStats({
                    total: leavesData.length,
                    pending: leavesData.filter((l) => l.status === 'Pending').length,
                    approved: leavesData.filter((l) => l.status === 'Approved').length,
                    rejected: leavesData.filter((l) => l.status === 'Rejected').length,
                });
            }
        } catch (error) {
            console.error('Error fetching leaves:', error);
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
                    <h1 className="dashboard-title">Employee Dashboard</h1>
                    <p className="dashboard-subtitle">
                        Welcome back, {user.name}! Here's your leave summary.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-label">Total Applications</div>
                        <div className="stat-value">{stats.total}</div>
                    </div>
                    <div className="stat-card warning">
                        <div className="stat-label">Pending</div>
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
                    {leaves.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">📭</div>
                            <div className="empty-state-text">
                                No leave applications yet. Click "Apply Leave" to get started.
                            </div>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Leave Type</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Days</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaves.map((leave) => (
                                        <tr key={leave._id}>
                                            <td>{leave.leaveType}</td>
                                            <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                                            <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                                            <td>{leave.totalDays}</td>
                                            <td>
                                                <span className={`badge badge-${leave.status.toLowerCase()}`}>
                                                    {leave.status}
                                                </span>
                                            </td>
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

export default EmployeeDashboard;
