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

    // From your generateToken: payload is { userId, email, role }
    const userId = decoded.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Invalid token payload' });
    }

    // Fetch user from database
    const [users] = await pool.execute(
      `SELECT 
         id,
         email,
         username,
         role,
         is_active
       FROM users 
       WHERE id = ?`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(403).json({ error: 'User not found' });
    }

    const user = users[0];

    if (!user.is_active) {
      return res.status(403).json({ error: 'User account is inactive' });
    }

    // Attach to req.user
    req.user = {
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role
    };

    // Fetch additional data based on role
    if (user.role === 'teacher' || user.role === 'admin') {
      const [teachers] = await pool.execute(
        `SELECT id, initials, first_name, last_name, address, profile_picture, is_admin
         FROM teachers WHERE user_id = ?`,
        [userId]
      );

      if (teachers.length > 0) {
        const teacher = teachers[0];
        req.user = {
          ...req.user,
          teacherId: teacher.id,
          firstName: teacher.first_name,
          lastName: teacher.last_name,
          initials: teacher.initials,
          address: teacher.address,
          is_admin: teacher.is_admin
        };
      }
    }

    if (user.role === 'student') {
      const [students] = await pool.execute(
        `SELECT id, initials, first_name, last_name, address, class_id
         FROM students WHERE user_id = ?`,
        [userId]
      );

      if (students.length > 0) {
        const student = students[0];
        req.user = {
          ...req.user,
          studentId: student.id,
          firstName: student.first_name,
          lastName: student.last_name,
          initials: student.initials,
          class_id: student.class_id
        };
      }
    }

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

// Role-based authorization middleware
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied: insufficient permissions' });
    }
    next();
  };
};

// Admin-only middleware
const requireAdmin = (req, res, next) => {
  if (!req.user || (req.user.role !== 'admin' && !req.user.is_admin)) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

module.exports = {
  verifyToken,
  authorizeRoles,
  requireAdmin
};