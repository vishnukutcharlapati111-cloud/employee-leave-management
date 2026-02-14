import React, { useState, useEffect } from 'react';
import API from '../api/axios';

/**
 * Leave History Component
 * Shows all leave applications for the logged-in employee
 */
const LeaveHistory = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const response = await API.get('/leaves/my-leaves');
            if (response.data.success) {
                setLeaves(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching leaves:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this leave application?')) {
            try {
                const response = await API.delete(`/leaves/${id}`);
                if (response.data.success) {
                    setLeaves(leaves.filter((leave) => leave._id !== id));
                    alert('Leave application deleted successfully');
                }
            } catch (error) {
                alert(error.response?.data?.message || 'Failed to delete leave application');
            }
        }
    };

    // Filter leaves based on status
    const filteredLeaves = filter === 'all'
        ? leaves
        : leaves.filter((leave) => leave.status.toLowerCase() === filter);

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
                    <h1 className="dashboard-title">My Leave History</h1>
                    <p className="dashboard-subtitle">
                        View and manage all your leave applications
                    </p>
                </div>

                {/* Filter Buttons */}
                <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
                    <button
                        className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'} btn-sm`}
                        onClick={() => setFilter('all')}
                    >
                        All ({leaves.length})
                    </button>
                    <button
                        className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-outline'} btn-sm`}
                        onClick={() => setFilter('pending')}
                    >
                        Pending ({leaves.filter((l) => l.status === 'Pending').length})
                    </button>
                    <button
                        className={`btn ${filter === 'approved' ? 'btn-primary' : 'btn-outline'} btn-sm`}
                        onClick={() => setFilter('approved')}
                    >
                        Approved ({leaves.filter((l) => l.status === 'Approved').length})
                    </button>
                    <button
                        className={`btn ${filter === 'rejected' ? 'btn-primary' : 'btn-outline'} btn-sm`}
                        onClick={() => setFilter('rejected')}
                    >
                        Rejected ({leaves.filter((l) => l.status === 'Rejected').length})
                    </button>
                </div>

                {/* Leaves Table */}
                {filteredLeaves.length === 0 ? (
                    <div className="card">
                        <div className="empty-state">
                            <div className="empty-state-icon">📭</div>
                            <div className="empty-state-text">
                                {filter === 'all'
                                    ? 'No leave applications found'
                                    : `No ${filter} leave applications`}
                            </div>
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
                                    <th>Reason</th>
                                    <th>Status</th>
                                    <th>Applied On</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLeaves.map((leave) => (
                                    <tr key={leave._id}>
                                        <td>{leave.leaveType}</td>
                                        <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                                        <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                                        <td>{leave.totalDays}</td>
                                        <td style={{ maxWidth: '200px' }}>
                                            {leave.reason.length > 50
                                                ? leave.reason.substring(0, 50) + '...'
                                                : leave.reason}
                                        </td>
                                        <td>
                                            <span className={`badge badge-${leave.status.toLowerCase()}`}>
                                                {leave.status}
                                            </span>
                                        </td>
                                        <td>{new Date(leave.appliedDate).toLocaleDateString()}</td>
                                        <td>
                                            {leave.status === 'Pending' && (
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDelete(leave._id)}
                                                >
                                                    Delete
                                                </button>
                                            )}
                                            {leave.adminComment && (
                                                <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: 'var(--text-secondary)' }}>
                                                    Note: {leave.adminComment}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeaveHistory;
