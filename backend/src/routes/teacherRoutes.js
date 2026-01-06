const express = require('express');
const router = express.Router();
const { signup, getAllTeachers, getTeacherById, updateTeacher } = require('../controllers/teacherController');
const { verifyToken, requireAdmin } = require('../middlewares/authMiddleware');

// Public routes
router.post('/signup', signup);

// Protected routes
router.get('/', verifyToken, getAllTeachers);
router.get('/:id', verifyToken, getTeacherById);

// Admin-only routes
router.put('/:id', verifyToken, requireAdmin, updateTeacher);

module.exports = router;
















