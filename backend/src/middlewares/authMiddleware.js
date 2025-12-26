const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

const verifyToken = async (req, res, next) => {
  try {
    // Extract token from "Bearer <token>"
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key-change-this'
    );

    // From your generateToken: payload is { teacherId, email, role }
    const teacherId = decoded.teacherId;
    if (!teacherId) {
      return res.status(401).json({ error: 'Invalid token payload' });
    }

    // Fetch teacher from database
    const [teachers] = await pool.execute(
      `SELECT 
         teacher_id,
         email,
         username,
         first_name,
         last_name,
         initials,
         mobile_no,
         role 
       FROM teachers 
       WHERE teacher_id = ?`,
      [teacherId]
    );

    if (teachers.length === 0) {
      return res.status(403).json({ error: 'User not found' });
    }

    const teacher = teachers[0];

    // Attach to req.user (you can customize what you include)
    req.user = {
      teacherId: teacher.teacher_id,
      email: teacher.email,
      username: teacher.username,
      firstName: teacher.first_name,
      lastName: teacher.last_name,
      initials: teacher.initials,
      mobileNo: teacher.mobile_no,
      role: teacher.role || 'teacher'  // fallback if column is NULL
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }

    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Role-based authorization (optional, for future use if you add admin/student roles)
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied: insufficient role' });
    }
    next();
  };
};

module.exports = {
  verifyToken,
  authorizeRoles
};