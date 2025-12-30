const express = require('express');
const router = express.Router();
const { registerTeacher, login, getCurrentUser, upgradeToAdmin, studentLogin } = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Public routes
router.post('/register', registerTeacher);
router.post('/login', login);
router.post('/student-login', studentLogin);

// Protected routes
router.get('/me', verifyToken, getCurrentUser);
router.post('/upgrade-to-admin', verifyToken, upgradeToAdmin);

module.exports = router;
















