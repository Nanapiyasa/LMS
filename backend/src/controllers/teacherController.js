const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for teacher profile images
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
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed!'));
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

// Teacher Signup (Registration)
const signup = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const {
        initials,
        first_name,
        last_name,
        address,
        mobile_no,
        email,
        password
      } = req.body;

      // Image path (if uploaded)
      const imagePath = req.file ? `/uploads/teachers/${req.file.filename}` : null;

      // Required fields
      if (!first_name || !last_name || !mobile_no || !email || !password) {
        if (req.file) fs.unlinkSync(req.file.path); // cleanup
        return res.status(400).json({ error: 'Required fields are missing' });
      }

      // Check if email already exists
      const [existing] = await pool.execute(
        'SELECT teacher_id FROM teachers WHERE email = ?',
        [email]
      );

      if (existing.length > 0) {
        if (req.file) fs.unlinkSync(req.file.path); // cleanup
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new teacher
      const [result] = await pool.execute(
        `INSERT INTO teachers 
         (initials, first_name, last_name, image_base64, address, mobile_no, email, password, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          initials || null,
          first_name,
          last_name,
          imagePath,           // stored as file path string, not base64
          address || null,
          mobile_no,
          email,
          hashedPassword
        ]
      );

      const teacherId = result.insertId;
      const token = generateToken(teacherId, email);

      // Fetch created teacher (without password)
      const [newTeacher] = await pool.execute(
        `SELECT 
           teacher_id,
           initials,
           first_name,
           last_name,
           image_base64 AS image,
           address,
           mobile_no,
           email,
           created_at
         FROM teachers 
         WHERE teacher_id = ?`,
        [teacherId]
      );

      res.status(201).json({
        message: 'Teacher registered successfully',
        token,
        teacher: newTeacher[0]
      });

    } catch (error) {
      // Cleanup uploaded file on any error
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Failed to delete uploaded file:', err);
        });
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
      `SELECT 
         teacher_id,
         initials,
         first_name,
         last_name,
         CONCAT(first_name, ' ', last_name) AS full_name,
         image_base64 AS image,
         email,
         mobile_no,
         created_at
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
      `SELECT 
         teacher_id,
         initials,
         first_name,
         last_name,
         image_base64 AS image,
         address,
         mobile_no,
         email,
         created_at
       FROM teachers 
       WHERE teacher_id = ?`,
      [id]
    );

    if (teachers.length === 0) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    res.json(teachers[0]);
  } catch (error) {
    console.error('Get teacher by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  signup,
  getAllTeachers,
  getTeacherById,
  upload // exported in case you need middleware access elsewhere
};