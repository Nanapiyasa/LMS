const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const QRCode = require('qrcode');
const { updateStudentCount } = require('./classController');

const safe = (value) => (value === undefined ? null : value);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/students');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'student-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Only image files are allowed'));
  }
}).single('image');

// Generate QR code with login credentials
const generateQRCode = async (username, password, studentId) => {
  try {
    const qrData = JSON.stringify({ username, password, studentId, type: 'mobile_app_credentials' });
    return await QRCode.toDataURL(qrData);
  } catch (error) {
    console.error('QR Code generation error:', error);
    return null;
  }
};

// Create student, getAll, getById, update, delete implementations (cleaned)
const createStudent = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });
    try {
      const { initials, first_name, last_name, guardian_parent_name, guardian_type, contact_no, address, class_id, teacher_id, username, password } = req.body;
      const image = req.file ? `/uploads/students/${req.file.filename}` : null;
      
      // Only admins may create students
      const userRole = req.user?.role;
      if (userRole !== 'admin') {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(403).json({ error: 'Admin access required to create students' });
      }
      
      if (!first_name || !last_name || !guardian_parent_name || !contact_no || !address || !username || !password) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: 'All required fields must be filled' });
      }

      const [existingUsers] = await pool.execute('SELECT id FROM users WHERE username = ?', [safe(username)]);
      if (existingUsers.length > 0) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: 'Username already exists' });
      }

      if (class_id) {
        const [classes] = await pool.execute('SELECT id FROM classes WHERE id = ? AND is_active = TRUE', [class_id]);
        if (classes.length === 0) { if (req.file) fs.unlinkSync(req.file.path); return res.status(404).json({ error: 'Class not found' }); }
      }

      if (teacher_id) {
        const [teachers] = await pool.execute('SELECT id FROM teachers WHERE id = ?', [teacher_id]);
        if (teachers.length === 0) { if (req.file) fs.unlinkSync(req.file.path); return res.status(404).json({ error: 'Teacher not found' }); }
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const connection = await pool.getConnection();
      await connection.beginTransaction();
      try {
        const [userResult] = await connection.execute('INSERT INTO users (email, username, password, role, is_active) VALUES (?, ?, ?, ?, ?)', [safe(`${username}@student.local`), safe(username), safe(hashedPassword), 'student', true]);
        const userId = userResult.insertId;
        const qrCode = await generateQRCode(username, password, null);
        const [studentResult] = await connection.execute(`INSERT INTO students (user_id, initials, first_name, last_name, image, guardian_parent_name, guardian_type, contact_no, address, class_id, teacher_id, qr_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [userId, safe(initials), safe(first_name), safe(last_name), safe(image), safe(guardian_parent_name), safe(guardian_type || 'parent'), safe(contact_no), safe(address), safe(class_id), safe(teacher_id), safe(qrCode)]);
        await connection.commit();
        connection.release();
        const studentId = studentResult.insertId;
        if (class_id) await updateStudentCount(class_id);
        return res.status(201).json({ message: 'Student created successfully', student: { id: studentId, user_id: userId, username, first_name, last_name, initials: initials || null, image, guardian_parent_name, guardian_type: guardian_type || 'parent', contact_no, address, class_id: class_id || null, teacher_id: teacher_id || null, qr_code: qrCode } });
      } catch (error) {
        await connection.rollback();
        connection.release();
        throw error;
      }
    } catch (error) {
      if (req.file) fs.unlink(req.file.path, (e) => e && console.error('Failed to delete uploaded file:', e));
      console.error('Create student error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
};

const getAllStudents = async (req, res) => {
  try {
    const [students] = await pool.execute(`SELECT s.id, s.initials, s.first_name, s.last_name, s.image, s.guardian_parent_name, s.guardian_type, s.contact_no, s.address, s.class_id, s.teacher_id, s.qr_code, u.username, u.email, c.class_name, CONCAT(t.first_name, ' ', t.last_name) AS teacher_name FROM students s LEFT JOIN users u ON s.user_id = u.id LEFT JOIN classes c ON s.class_id = c.id LEFT JOIN teachers t ON s.teacher_id = t.id ORDER BY s.first_name, s.last_name`);
    res.json(students);
  } catch (error) { console.error('Get all students error:', error); res.status(500).json({ error: 'Internal server error' }); }
};

const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const [students] = await pool.execute(`SELECT s.id, s.initials, s.first_name, s.last_name, s.image, s.guardian_parent_name, s.guardian_type, s.contact_no, s.address, s.class_id, s.teacher_id, s.qr_code, u.username, u.email, c.class_name, CONCAT(t.first_name, ' ', t.last_name) AS teacher_name FROM students s LEFT JOIN users u ON s.user_id = u.id LEFT JOIN classes c ON s.class_id = c.id LEFT JOIN teachers t ON s.teacher_id = t.id WHERE s.id = ?`, [id]);
    if (students.length === 0) return res.status(404).json({ error: 'Student not found' });
    res.json(students[0]);
  } catch (error) { console.error('Get student error:', error); res.status(500).json({ error: 'Internal server error' }); }
};

const updateStudent = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });
    try {
      const { id } = req.params;
      const { initials, first_name, last_name, guardian_parent_name, guardian_type, contact_no, address, class_id, teacher_id } = req.body;
      const image = req.file ? `/uploads/students/${req.file.filename}` : null;
      
      const [existingStudents] = await pool.execute('SELECT id, image, class_id, teacher_id FROM students WHERE id = ?', [id]);
      if (existingStudents.length === 0) { if (req.file) fs.unlinkSync(req.file.path); return res.status(404).json({ error: 'Student not found' }); }
      
      // Authorization check: Teachers can only update students they teach
      const userRole = req.user?.role;
      const userTeacherId = req.user?.teacherId;
      const studentTeacherId = existingStudents[0].teacher_id;
      if (userRole === 'teacher' && studentTeacherId && studentTeacherId !== userTeacherId) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(403).json({ error: 'Teachers can only update their own students' });
      }
      
      const oldImage = existingStudents[0].image; 
      const oldClassId = existingStudents[0].class_id;
      if (class_id) { const [classes] = await pool.execute('SELECT id FROM classes WHERE id = ? AND is_active = TRUE', [class_id]); if (classes.length === 0) { if (req.file) fs.unlinkSync(req.file.path); return res.status(404).json({ error: 'Class not found' }); } }
      if (teacher_id) { const [teachers] = await pool.execute('SELECT id FROM teachers WHERE id = ?', [teacher_id]); if (teachers.length === 0) { if (req.file) fs.unlinkSync(req.file.path); return res.status(404).json({ error: 'Teacher not found' }); } }
      const updates = []; const values = [];
      if (initials !== undefined) { updates.push('initials = ?'); values.push(safe(initials)); }
      if (first_name !== undefined) { updates.push('first_name = ?'); values.push(safe(first_name)); }
      if (last_name !== undefined) { updates.push('last_name = ?'); values.push(safe(last_name)); }
      if (image) { updates.push('image = ?'); values.push(image); if (oldImage) { const oldImagePath = path.join(__dirname, '../../', oldImage.replace('/uploads/', 'uploads/')); if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath); } }
      if (guardian_parent_name !== undefined) { updates.push('guardian_parent_name = ?'); values.push(safe(guardian_parent_name)); }
      if (guardian_type !== undefined) { updates.push('guardian_type = ?'); values.push(safe(guardian_type)); }
      if (contact_no !== undefined) { updates.push('contact_no = ?'); values.push(safe(contact_no)); }
      if (address !== undefined) { updates.push('address = ?'); values.push(safe(address)); }
      if (class_id !== undefined) { updates.push('class_id = ?'); values.push(safe(class_id)); }
      if (teacher_id !== undefined) { updates.push('teacher_id = ?'); values.push(safe(teacher_id)); }
      if (updates.length === 0) { if (req.file) fs.unlinkSync(req.file.path); return res.status(400).json({ error: 'No fields to update' }); }
      updates.push('updated_at = NOW()'); values.push(id);
      await pool.execute(`UPDATE students SET ${updates.join(', ')} WHERE id = ?`, values);
      if ((class_id || class_id === null) && oldClassId !== class_id) { if (oldClassId) await updateStudentCount(oldClassId); if (class_id) await updateStudentCount(class_id); }
      const [students] = await pool.execute(`SELECT s.id, s.initials, s.first_name, s.last_name, s.image, s.guardian_parent_name, s.guardian_type, s.contact_no, s.address, s.class_id, s.teacher_id, s.qr_code, u.username, u.email, c.class_name, CONCAT(t.first_name, ' ', t.last_name) AS teacher_name FROM students s LEFT JOIN users u ON s.user_id = u.id LEFT JOIN classes c ON s.class_id = c.id LEFT JOIN teachers t ON s.teacher_id = t.id WHERE s.id = ?`, [id]);
      res.json({ message: 'Student updated successfully', student: students[0] });
    } catch (error) { if (req.file) fs.unlink(req.file.path, (e) => e && console.error('Failed to delete uploaded file:', e)); console.error('Update student error:', error); res.status(500).json({ error: 'Internal server error' }); }
  });
};

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const [students] = await pool.execute('SELECT id, class_id, image, user_id, teacher_id FROM students WHERE id = ?', [id]);
    if (students.length === 0) return res.status(404).json({ error: 'Student not found' });
    
    // Only admins may delete students
    const userRole = req.user?.role;
    if (userRole !== 'admin') {
      return res.status(403).json({ error: 'Admin access required to delete students' });
    }
    
    const studentClassId = students[0].class_id; 
    const image = students[0].image; 
    const user_id = students[0].user_id;
    const connection = await pool.getConnection(); await connection.beginTransaction();
    try {
      await connection.execute('DELETE FROM students WHERE id = ?', [id]);
      if (user_id) await connection.execute('DELETE FROM users WHERE id = ?', [user_id]);
      await connection.commit(); connection.release();
      if (image) { const imagePath = path.join(__dirname, '../../', image.replace('/uploads/', 'uploads/')); if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath); }
      if (studentClassId) await updateStudentCount(studentClassId);
      res.json({ message: 'Student deleted successfully' });
    } catch (error) { await connection.rollback(); connection.release(); throw error; }
  } catch (error) { console.error('Delete student error:', error); res.status(500).json({ error: 'Internal server error' }); }
};

module.exports = { createStudent, getAllStudents, getStudentById, updateStudent, deleteStudent, upload };

