const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/teachers');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'teacher-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
}).single('image');

// Generate JWT token
const generateToken = (teacherId, email) => {
  return jwt.sign(
    { teacherId, email, role: 'teacher' },
    process.env.JWT_SECRET || 'your-secret-key-change-this',
    { expiresIn: '7d' }
  );
};

// Teacher signup
const signup = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const { initials, first_name, last_name, address, mobile_no, email, password } = req.body;
      const image = req.file ? `/uploads/teachers/${req.file.filename}` : null;

      if (!initials || !first_name || !last_name || !email || !password) {
        return res.status(400).json({ error: 'Required fields are missing' });
      }

      // Check if teacher already exists
      const [existingTeachers] = await pool.execute(
        'SELECT id FROM teachers WHERE email = ?',
        [email]
      );

      if (existingTeachers.length > 0) {
        // Delete uploaded file if user exists
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({ error: 'Teacher with this email already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert teacher into database
      const [result] = await pool.execute(
        `INSERT INTO teachers (initials, first_name, last_name, image, address, mobile_no, email, password) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [initials, first_name, last_name, image, address || null, mobile_no || null, email, hashedPassword]
      );

      const teacherId = result.insertId;

      // Generate token
      const token = generateToken(teacherId, email);

      // Get teacher data
      const [teachers] = await pool.execute(
        'SELECT id, initials, first_name, last_name, image, address, mobile_no, email, created_at FROM teachers WHERE id = ?',
        [teacherId]
      );

      res.status(201).json({
        message: 'Teacher registered successfully',
        token,
        teacher: teachers[0]
      });
    } catch (error) {
      // Delete uploaded file on error
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      console.error('Teacher signup error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
};

// Get all teachers
const getAllTeachers = async (req, res) => {
  try {
    const [teachers] = await pool.execute(
      `SELECT id, initials, first_name, last_name, 
       CONCAT(first_name, ' ', last_name) AS full_name,
       image, email, mobile_no, created_at 
       FROM teachers 
       ORDER BY first_name, last_name`
    );

    res.json(teachers);
  } catch (error) {
    console.error('Get all teachers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get teacher by ID
const getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;
    const [teachers] = await pool.execute(
      'SELECT id, initials, first_name, last_name, image, address, mobile_no, email, created_at FROM teachers WHERE id = ?',
      [id]
    );

    if (teachers.length === 0) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    res.json(teachers[0]);
  } catch (error) {
    console.error('Get teacher error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  signup,
  getAllTeachers,
  getTeacherById,
  upload
};

