const express = require('express');
const router = express.Router();
const { createStudent, getAllStudents, getStudentById, updateStudent, deleteStudent } = require('../controllers/studentController');
const { verifyToken, requireAdmin } = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(verifyToken);

// Public routes (teachers and admins can view)
router.get('/', getAllStudents);
router.get('/:id', getStudentById);

// Admin-only routes
router.post('/', requireAdmin, createStudent);
router.put('/:id', requireAdmin, updateStudent);
router.delete('/:id', requireAdmin, deleteStudent);

module.exports = router;
















