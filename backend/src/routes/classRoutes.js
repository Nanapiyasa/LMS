const express = require('express');
const router = express.Router();
const { createClass, getAllClasses, getClassById, updateClass, deleteClass } = require('../controllers/classController');
const { verifyToken } = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(verifyToken);

router.post('/', createClass);
router.get('/', getAllClasses);
router.get('/:id', getClassById);
router.put('/:id', updateClass);
router.delete('/:id', deleteClass);

module.exports = router;






