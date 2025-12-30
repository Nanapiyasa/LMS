const express = require('express');
const router = express.Router();
const { createClass, getAllClasses, getClassById, updateClass, deleteClass, getClassStudents } = require('../controllers/classController');
const { verifyToken, requireAdmin } = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(verifyToken);

// Public routes (teachers can view)
router.get('/', getAllClasses);
router.get('/:id', getClassById);
router.get('/:id/students', getClassStudents);

// Admin-only routes
router.post('/', requireAdmin, createClass);
router.put('/:id', requireAdmin, updateClass);
router.delete('/:id', requireAdmin, deleteClass);

module.exports = router;
















