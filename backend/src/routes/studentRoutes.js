const express = require('express');
const router = express.Router();
const { createStudent, getAllStudents, getStudentById, updateStudent, deleteStudent } = require('../controllers/studentController');
const { verifyToken } = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(verifyToken);

router.post('/', createStudent);
router.get('/', getAllStudents);
router.get('/:id', getStudentById);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);

module.exports = router;






