const express = require('express');
const router = express.Router();
const {
    applyLeave,
    getMyLeaves,
    getAllLeaves,
    getLeaveById,
    updateLeaveStatus,
    deleteLeave,
    getLeaveStats,
} = require('../controllers/leaveController');
const { protect, admin } = require('../middleware/auth');

// Employee routes (protected)
router.post('/', protect, applyLeave);
router.get('/my-leaves', protect, getMyLeaves);

// Admin routes (protected + admin only)
router.get('/all', protect, admin, getAllLeaves);
router.get('/stats', protect, admin, getLeaveStats);

// Shared routes (authorization checked in controller)
router.get('/:id', protect, getLeaveById);
router.put('/:id', protect, admin, updateLeaveStatus);
router.delete('/:id', protect, deleteLeave);

module.exports = router;
