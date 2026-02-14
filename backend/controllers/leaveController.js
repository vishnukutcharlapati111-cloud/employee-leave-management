const Leave = require('../models/Leave');
const User = require('../models/User');

/**
 * @desc    Apply for leave (Employee)
 * @route   POST /api/leaves
 * @access  Private (Employee & Admin)
 */
exports.applyLeave = async (req, res) => {
    try {
        const { leaveType, startDate, endDate, reason } = req.body;

        // Validate dates
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (end < start) {
            return res.status(400).json({
                success: false,
                message: 'End date cannot be before start date',
            });
        }

        // Create leave application
        const leave = await Leave.create({
            employee: req.user._id,
            employeeName: req.user.name,
            employeeEmail: req.user.email,
            leaveType,
            startDate: start,
            endDate: end,
            reason,
        });

        res.status(201).json({
            success: true,
            message: 'Leave application submitted successfully',
            data: leave,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error while applying for leave',
            error: error.message,
        });
    }
};

/**
 * @desc    Get all leaves for logged in employee
 * @route   GET /api/leaves/my-leaves
 * @access  Private (Employee)
 */
exports.getMyLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({ employee: req.user._id }).sort({
            appliedDate: -1,
        });

        res.status(200).json({
            success: true,
            count: leaves.length,
            data: leaves,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching leaves',
            error: error.message,
        });
    }
};

/**
 * @desc    Get all leave applications (Admin)
 * @route   GET /api/leaves/all
 * @access  Private (Admin only)
 */
exports.getAllLeaves = async (req, res) => {
    try {
        const { status } = req.query;

        // Build query
        let query = {};
        if (status) {
            query.status = status;
        }

        const leaves = await Leave.find(query)
            .populate('employee', 'name email department')
            .populate('reviewedBy', 'name')
            .sort({ appliedDate: -1 });

        res.status(200).json({
            success: true,
            count: leaves.length,
            data: leaves,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching all leaves',
            error: error.message,
        });
    }
};

/**
 * @desc    Get single leave by ID
 * @route   GET /api/leaves/:id
 * @access  Private
 */
exports.getLeaveById = async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id)
            .populate('employee', 'name email department')
            .populate('reviewedBy', 'name');

        if (!leave) {
            return res.status(404).json({
                success: false,
                message: 'Leave not found',
            });
        }

        // Check if user is authorized to view this leave
        if (
            req.user.role !== 'admin' &&
            leave.employee._id.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this leave',
            });
        }

        res.status(200).json({
            success: true,
            data: leave,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching leave',
            error: error.message,
        });
    }
};

/**
 * @desc    Update leave status (Admin)
 * @route   PUT /api/leaves/:id
 * @access  Private (Admin only)
 */
exports.updateLeaveStatus = async (req, res) => {
    try {
        const { status, adminComment } = req.body;

        // Validate status
        if (!['Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be Approved or Rejected',
            });
        }

        const leave = await Leave.findById(req.params.id);

        if (!leave) {
            return res.status(404).json({
                success: false,
                message: 'Leave not found',
            });
        }

        // Update leave
        leave.status = status;
        leave.adminComment = adminComment || '';
        leave.reviewedBy = req.user._id;
        leave.reviewedDate = Date.now();

        await leave.save();

        res.status(200).json({
            success: true,
            message: `Leave ${status.toLowerCase()} successfully`,
            data: leave,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating leave status',
            error: error.message,
        });
    }
};

/**
 * @desc    Delete leave application
 * @route   DELETE /api/leaves/:id
 * @access  Private (Employee can delete own pending leaves, Admin can delete any)
 */
exports.deleteLeave = async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id);

        if (!leave) {
            return res.status(404).json({
                success: false,
                message: 'Leave not found',
            });
        }

        // Check authorization
        if (
            req.user.role !== 'admin' &&
            (leave.employee.toString() !== req.user._id.toString() ||
                leave.status !== 'Pending')
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this leave',
            });
        }

        await leave.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Leave deleted successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting leave',
            error: error.message,
        });
    }
};

/**
 * @desc    Get leave statistics (Admin)
 * @route   GET /api/leaves/stats
 * @access  Private (Admin only)
 */
exports.getLeaveStats = async (req, res) => {
    try {
        const totalLeaves = await Leave.countDocuments();
        const pendingLeaves = await Leave.countDocuments({ status: 'Pending' });
        const approvedLeaves = await Leave.countDocuments({ status: 'Approved' });
        const rejectedLeaves = await Leave.countDocuments({ status: 'Rejected' });

        res.status(200).json({
            success: true,
            data: {
                total: totalLeaves,
                pending: pendingLeaves,
                approved: approvedLeaves,
                rejected: rejectedLeaves,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching statistics',
            error: error.message,
        });
    }
};
