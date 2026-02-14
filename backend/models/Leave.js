const mongoose = require('mongoose');

/**
 * Leave Schema
 * Stores leave applications with status tracking
 * Status: 'pending', 'approved', or 'rejected'
 */
const leaveSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    employeeName: {
        type: String,
        required: true,
    },
    employeeEmail: {
        type: String,
        required: true,
    },
    leaveType: {
        type: String,
        required: [true, 'Please specify leave type'],
        enum: ['Sick Leave', 'Casual Leave', 'Annual Leave', 'Maternity Leave', 'Paternity Leave', 'Other'],
    },
    startDate: {
        type: Date,
        required: [true, 'Please provide start date'],
    },
    endDate: {
        type: Date,
        required: [true, 'Please provide end date'],
    },
    reason: {
        type: String,
        required: [true, 'Please provide a reason'],
        maxlength: [500, 'Reason cannot exceed 500 characters'],
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending',
    },
    adminComment: {
        type: String,
        default: '',
    },
    appliedDate: {
        type: Date,
        default: Date.now,
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    reviewedDate: {
        type: Date,
    },
});

/**
 * Calculate total days of leave
 * Virtual field that computes days between start and end date
 */
leaveSchema.virtual('totalDays').get(function () {
    const diffTime = Math.abs(this.endDate - this.startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end day
    return diffDays;
});

// Ensure virtuals are included when converting to JSON
leaveSchema.set('toJSON', { virtuals: true });
leaveSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Leave', leaveSchema);
