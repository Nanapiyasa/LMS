const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const QRCode = require('qrcode');

// Generate JWT token
const generateToken = (userId, email, role = 'teacher') => {
  return jwt.sign(
    { userId, email, role },
    process.env.JWT_SECRET || 'your-secret-key-change-this',
    { expiresIn: '7d' }
  );
};

// SAFE PARAM FOR ALL QUERIES
const safe = (value) => (value === undefined ? null : value);

// Register new teacher
const registerTeacher = async (req, res) => {
  try {
    const body = req.body || {};

    const initials = body.initials;
    const first_name = body.first_name;
    const last_name = body.last_name;
    const email = body.email;
    const username = body.username;
    const password = body.password;
    const address = body.address;
    const profile_picture = body.profile_picture; // Base64 or buffer

    // Validate required fields
    if (!email || !username || !password || !first_name || !last_name || !address) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }

    // Check for duplicate email or username
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [safe(email), safe(username)]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Email or username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Insert into users table
      const [userResult] = await connection.execute(
        'INSERT INTO users (email, username, password, role, is_active) VALUES (?, ?, ?, ?, ?)',
        [safe(email), safe(username), safe(hashedPassword), 'teacher', true]
      );

      const userId = userResult.insertId;

      // Insert into teachers table
      await connection.execute(
        `INSERT INTO teachers (user_id, initials, first_name, last_name, profile_picture, address, is_admin)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          safe(initials),
          safe(first_name),
          safe(last_name),
          safe(profile_picture),
          safe(address),
          false
        ]
      );

      await connection.commit();
      connection.release();

      const token = generateToken(userId, email, 'teacher');

      res.status(201).json({
        message: 'Teacher registered successfully',
        token,
        user: {
          id: userId,
          email,
          username,
          first_name,
          last_name,
          initials: initials || null,
          address,
          role: 'teacher'
        }
      });
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('Register teacher error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Teacher/Admin Login - accepts email or username
const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: 'Email/Username and password are required' });
    }

    const trimmedInput = String(email).trim().toLowerCase();

    // Query by email OR username
    const [users] = await pool.execute(
      `SELECT u.id, u.email, u.username, u.password, u.role, u.is_active,
              t.initials, t.first_name, t.last_name, t.address, t.is_admin
       FROM users u
       LEFT JOIN teachers t ON u.id = t.user_id
       WHERE (u.email = ? OR u.username = ?) AND u.role IN ('teacher', 'admin')`,
      [safe(trimmedInput), safe(trimmedInput)]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email/username or password' });
    }

    const user = users[0];

    if (!user.is_active) {
      return res.status(401).json({ error: 'Account is inactive' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email/username or password' });
    }

    const token = generateToken(user.id, user.email, user.role);

    await pool.execute(
      'UPDATE users SET updated_at = NOW() WHERE id = ?',
      [safe(user.id)]
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        initials: user.initials,
        address: user.address,
        role: user.role,
        is_admin: user.is_admin || false
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const [users] = await pool.execute(
      `SELECT u.id, u.email, u.username, u.role, u.is_active,
              t.initials, t.first_name, t.last_name, t.address, t.profile_picture, t.is_admin
       FROM users u
       LEFT JOIN teachers t ON u.id = t.user_id
       WHERE u.id = ?`,
      [safe(userId)]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: users[0] });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Change teacher role to admin (re-registration as admin)
const upgradeToAdmin = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const body = req.body || {};

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify password for security
    const { password } = body;
    if (!password) {
      return res.status(400).json({ error: 'Password is required for this action' });
    }

    const [users] = await pool.execute(
      'SELECT id, password, role FROM users WHERE id = ?',
      [safe(userId)]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Log role change in history
      if (user.role !== 'admin') {
        await connection.execute(
          `INSERT INTO user_role_history (user_id, previous_role, new_role, changed_by, reason)
           VALUES (?, ?, ?, ?, ?)`,
          [userId, user.role, 'admin', userId, 'Self-upgrade to admin']
        );
      }

      // Update user role
      await connection.execute(
        'UPDATE users SET role = ? WHERE id = ?',
        ['admin', userId]
      );

      // Update teacher is_admin flag
      await connection.execute(
        'UPDATE teachers SET is_admin = ? WHERE user_id = ?',
        [true, userId]
      );

      await connection.commit();
      connection.release();

      const token = generateToken(userId, user.email, 'admin');

      res.json({
        message: 'Successfully upgraded to admin',
        token,
        user: {
          id: userId,
          role: 'admin',
          is_admin: true
        }
      });
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('Upgrade to admin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Student Login
const studentLogin = async (req, res) => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const trimmedUsername = String(username).trim().toLowerCase();

    const [users] = await pool.execute(
      `SELECT u.id, u.email, u.username, u.password, u.role,
              s.first_name, s.last_name, s.class_id
       FROM users u
       LEFT JOIN students s ON u.id = s.user_id
       WHERE u.username = ? AND u.role = 'student'`,
      [safe(trimmedUsername)]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id, user.email, 'student');

    res.json({
      message: 'Student login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        role: 'student'
      }
    });
  } catch (error) {
    console.error('Student login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  registerTeacher,
  login,
  getCurrentUser,
  upgradeToAdmin,
  studentLogin
};
