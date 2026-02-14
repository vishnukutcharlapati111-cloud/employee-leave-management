import React, { useState, useEffect } from 'react';
import API from '../api/axios';

/**
 * Manage Leaves Component (Admin)
 * Allows admin to view, approve, or reject leave applications
 */
const ManageLeaves = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [adminComment, setAdminComment] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const response = await API.get('/leaves/all');
            if (response.data.success) {
                setLeaves(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching leaves:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (leaveId, status) => {
        setActionLoading(true);
        try {
            const response = await API.put(`/leaves/${leaveId}`, {
                status,
                adminComment,
            });

            if (response.data.success) {
                // Update the leave in the list
                setLeaves(
                    leaves.map((leave) =>
                        leave._id === leaveId ? response.data.data : leave
                    )
                );
                setSelectedLeave(null);
                setAdminComment('');
                alert(`Leave ${status.toLowerCase()} successfully!`);
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update leave status');
        } finally {
            setActionLoading(false);
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
                    <h1 className="dashboard-title">Manage Leave Applications</h1>
                    <p className="dashboard-subtitle">
                        Review and manage all employee leave requests
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
                                    <th>Employee</th>
                                    <th>Department</th>
                                    <th>Leave Type</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Days</th>
                                    <th>Reason</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLeaves.map((leave) => (
                                    <React.Fragment key={leave._id}>
                                        <tr>
                                            <td>
                                                <strong>{leave.employeeName}</strong>
                                                <br />
                                                <small style={{ color: 'var(--text-secondary)' }}>
                                                    {leave.employeeEmail}
                                                </small>
                                            </td>
                                            <td>{leave.employee?.department || 'N/A'}</td>
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
                                            <td>
                                                {leave.status === 'Pending' ? (
                                                    <div className="action-buttons">
                                                        <button
                                                            className="btn btn-secondary btn-sm"
                                                            onClick={() => setSelectedLeave(leave._id)}
                                                        >
                                                            Review
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <small style={{ color: 'var(--text-secondary)' }}>
                                                        {leave.status}
                                                    </small>
                                                )}
                                            </td>
                                        </tr>
                                        {selectedLeave === leave._id && (
                                            <tr>
                                                <td colSpan="9" style={{ backgroundColor: 'var(--light-bg)' }}>
                                                    <div style={{ padding: '1rem' }}>
                                                        <h4 style={{ marginBottom: '1rem' }}>Review Leave Application</h4>
                                                        <div style={{ marginBottom: '1rem' }}>
                                                            <strong>Full Reason:</strong>
                                                            <p style={{ marginTop: '0.5rem' }}>{leave.reason}</p>
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="form-label">Admin Comment (Optional)</label>
                                                            <textarea
                                                                className="form-textarea"
                                                                placeholder="Add a comment for the employee..."
                                                                value={adminComment}
                                                                onChange={(e) => setAdminComment(e.target.value)}
                                                                rows="3"
                                                            ></textarea>
                                                        </div>
                                                        <div className="action-buttons">
                                                            <button
                                                                className="btn btn-secondary"
                                                                onClick={() => handleAction(leave._id, 'Approved')}
                                                                disabled={actionLoading}
                                                            >
                                                                {actionLoading ? 'Processing...' : 'Approve'}
                                                            </button>
                                                            <button
                                                                className="btn btn-danger"
                                                                onClick={() => handleAction(leave._id, 'Rejected')}
                                                                disabled={actionLoading}
                                                            >
                                                                {actionLoading ? 'Processing...' : 'Reject'}
                                                            </button>
                                                            <button
                                                                className="btn btn-outline"
                                                                onClick={() => {
                                                                    setSelectedLeave(null);
                                                                    setAdminComment('');
                                                                }}
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageLeaves;
