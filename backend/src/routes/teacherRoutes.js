const express = require('express');
const router = express.Router();
const { signup, getAllTeachers, getTeacherById } = require('../controllers/teacherController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Public routes
router.post('/signup', signup);

// Protected routes
router.get('/', verifyToken, getAllTeachers);
router.get('/:id', verifyToken, getTeacherById);

module.exports = router;






