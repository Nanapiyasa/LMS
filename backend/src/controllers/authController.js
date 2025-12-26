const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (teacherId, email, role = 'teacher') => {
  return jwt.sign(
    { teacherId, email, role },
    process.env.JWT_SECRET || 'your-secret-key-change-this',
    { expiresIn: '7d' }
  );
};

// SAFE PARAM FOR ALL QUERIES
const safe = (value) => (value === undefined ? null : value);

// Register new teacher - FULLY PROTECTED
const register = async (req, res) => {
  try {
    const body = req.body || {};

    const initials     = body.initials;
    const first_name   = body.first_name;
    const last_name    = body.last_name;
    const image_base64 = body.image_base64;
    const address      = body.address;
    const mobile_no    = body.mobile_no;
    const email        = body.email;
    const username     = body.username;
    const password     = body.password;

    if (!email || !password || !username || !first_name || !last_name || !mobile_no) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }

    // PROTECTED: duplicate check
    const [existingTeachers] = await pool.execute(
      'SELECT teacher_id FROM teachers WHERE email = ? OR username = ?',
      [safe(email), safe(username)]
    );

    if (existingTeachers.length > 0) {
      return res.status(400).json({ error: 'Email or username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // PROTECTED: insert query
    const [result] = await pool.execute(
      `INSERT INTO teachers 
       (initials, first_name, last_name, image_base64, address, mobile_no, email, username, password, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        safe(initials),
        safe(first_name),
        safe(last_name),
        safe(image_base64),
        safe(address),
        safe(mobile_no),
        safe(email),
        safe(username),
        safe(hashedPassword)
      ]
    );

    const teacherId = result.insertId;
    const token = generateToken(teacherId, email);

    res.status(201).json({
      message: 'Teacher registered successfully',
      token,
      user: {
        teacher_id: teacherId,
        email,
        username,
        first_name,
        last_name,
        initials: initials || null,
        mobile_no,
        role: 'teacher'
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Login - also protected
const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const trimmedEmail = String(email).trim();

    const [teachers] = await pool.execute(
      `SELECT teacher_id, email, password, first_name, last_name, initials, mobile_no, username 
       FROM teachers WHERE email = ?`,
      [safe(trimmedEmail)]
    );

    if (teachers.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const teacher = teachers[0];
    const isValidPassword = await bcrypt.compare(password, teacher.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(teacher.teacher_id, teacher.email);

    await pool.execute(
      'UPDATE teachers SET updated_at = NOW() WHERE teacher_id = ?',
      [safe(teacher.teacher_id)]
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        teacher_id: teacher.teacher_id,
        email: teacher.email,
        username: teacher.username,
        first_name: teacher.first_name,
        last_name: teacher.last_name,
        initials: teacher.initials,
        mobile_no: teacher.mobile_no,
        role: 'teacher'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// getCurrentUser - protected
const getCurrentUser = async (req, res) => {
  try {
    const teacherId = req.user?.teacherId;

    if (!teacherId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const [teachers] = await pool.execute(
      `SELECT teacher_id, email, username, first_name, last_name, initials, mobile_no, 
       address, image_base64, role, created_at, updated_at 
       FROM teachers WHERE teacher_id = ?`,
      [safe(teacherId)]
    );

    if (teachers.length === 0) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    res.json({ user: teachers[0] });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser
};
