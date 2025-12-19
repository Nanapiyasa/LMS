const { pool } = require('../config/database');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { updateStudentCount } = require('./classController');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/students');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'student-' + uniqueSuffix + path.extname(file.originalname));
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

// Create a new student
const createStudent = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const { initials, first_name, last_name, parent_guardian_name, contact_no, address, class_id, teacher_id } = req.body;
      const image = req.file ? `/uploads/students/${req.file.filename}` : null;

      if (!initials || !first_name || !last_name || !class_id || !teacher_id) {
        // Delete uploaded file if validation fails
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({ error: 'Required fields are missing' });
      }

      // Verify class exists
      const [classes] = await pool.execute(
        'SELECT id, teacher_id FROM classes WHERE id = ?',
        [class_id]
      );

      if (classes.length === 0) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(404).json({ error: 'Class not found' });
      }

      // Verify teacher exists and matches class teacher
      const [teachers] = await pool.execute(
        'SELECT id FROM teachers WHERE id = ?',
        [teacher_id]
      );

      if (teachers.length === 0) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(404).json({ error: 'Teacher not found' });
      }

      // Insert student
      const [result] = await pool.execute(
        `INSERT INTO students (initials, first_name, last_name, image, parent_guardian_name, contact_no, address, class_id, teacher_id) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [initials, first_name, last_name, image, parent_guardian_name || null, contact_no || null, address || null, class_id, teacher_id]
      );

      // Update student count for the class
      await updateStudentCount(class_id);

      // Get created student with class and teacher details
      const [students] = await pool.execute(
        `SELECT s.id, s.initials, s.first_name, s.last_name, s.image, s.parent_guardian_name, s.contact_no, s.address,
         s.class_id, s.teacher_id,
         c.class_id AS class_name,
         CONCAT(t.first_name, ' ', t.last_name) AS teacher_name
         FROM students s
         JOIN classes c ON s.class_id = c.id
         JOIN teachers t ON s.teacher_id = t.id
         WHERE s.id = ?`,
        [result.insertId]
      );

      res.status(201).json({
        message: 'Student created successfully',
        student: students[0]
      });
    } catch (error) {
      // Delete uploaded file on error
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      console.error('Create student error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
};

// Get all students
const getAllStudents = async (req, res) => {
  try {
    const [students] = await pool.execute(
      `SELECT s.id, s.initials, s.first_name, s.last_name, s.image, s.parent_guardian_name, s.contact_no, s.address,
       s.class_id, s.teacher_id,
       c.class_id AS class_name,
       CONCAT(t.first_name, ' ', t.last_name) AS teacher_name
       FROM students s
       JOIN classes c ON s.class_id = c.id
       JOIN teachers t ON s.teacher_id = t.id
       ORDER BY s.first_name, s.last_name`
    );

    res.json(students);
  } catch (error) {
    console.error('Get all students error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get student by ID
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const [students] = await pool.execute(
      `SELECT s.id, s.initials, s.first_name, s.last_name, s.image, s.parent_guardian_name, s.contact_no, s.address,
       s.class_id, s.teacher_id,
       c.class_id AS class_name,
       CONCAT(t.first_name, ' ', t.last_name) AS teacher_name
       FROM students s
       JOIN classes c ON s.class_id = c.id
       JOIN teachers t ON s.teacher_id = t.id
       WHERE s.id = ?`,
      [id]
    );

    if (students.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(students[0]);
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update student
const updateStudent = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const { id } = req.params;
      const { initials, first_name, last_name, parent_guardian_name, contact_no, address, class_id, teacher_id } = req.body;
      const image = req.file ? `/uploads/students/${req.file.filename}` : null;

      // Check if student exists
      const [existingStudents] = await pool.execute(
        'SELECT id, image FROM students WHERE id = ?',
        [id]
      );

      if (existingStudents.length === 0) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(404).json({ error: 'Student not found' });
      }

      const oldImage = existingStudents[0].image;

      // Verify class exists if being updated
      if (class_id) {
        const [classes] = await pool.execute(
          'SELECT id FROM classes WHERE id = ?',
          [class_id]
        );

        if (classes.length === 0) {
          if (req.file) {
            fs.unlinkSync(req.file.path);
          }
          return res.status(404).json({ error: 'Class not found' });
        }
      }

      // Verify teacher exists if being updated
      if (teacher_id) {
        const [teachers] = await pool.execute(
          'SELECT id FROM teachers WHERE id = ?',
          [teacher_id]
        );

        if (teachers.length === 0) {
          if (req.file) {
            fs.unlinkSync(req.file.path);
          }
          return res.status(404).json({ error: 'Teacher not found' });
        }
      }

      // Build update query
      const updates = [];
      const values = [];

      if (initials) {
        updates.push('initials = ?');
        values.push(initials);
      }

      if (first_name) {
        updates.push('first_name = ?');
        values.push(first_name);
      }

      if (last_name) {
        updates.push('last_name = ?');
        values.push(last_name);
      }

      if (image) {
        updates.push('image = ?');
        values.push(image);
        // Delete old image
        if (oldImage) {
          const oldImagePath = path.join(__dirname, '../../', oldImage.replace('/uploads/', 'uploads/'));
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
      }

      if (parent_guardian_name !== undefined) {
        updates.push('parent_guardian_name = ?');
        values.push(parent_guardian_name);
      }

      if (contact_no !== undefined) {
        updates.push('contact_no = ?');
        values.push(contact_no);
      }

      if (address !== undefined) {
        updates.push('address = ?');
        values.push(address);
      }

      if (class_id) {
        updates.push('class_id = ?');
        values.push(class_id);
      }

      if (teacher_id) {
        updates.push('teacher_id = ?');
        values.push(teacher_id);
      }

      if (updates.length === 0) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({ error: 'No fields to update' });
      }

      updates.push('updated_at = NOW()');
      values.push(id);

      await pool.execute(
        `UPDATE students SET ${updates.join(', ')} WHERE id = ?`,
        values
      );

      // Update student count for old and new class if class changed
      if (class_id && existingStudents[0].class_id !== class_id) {
        await updateStudentCount(existingStudents[0].class_id);
        await updateStudentCount(class_id);
      }

      // Get updated student
      const [students] = await pool.execute(
        `SELECT s.id, s.initials, s.first_name, s.last_name, s.image, s.parent_guardian_name, s.contact_no, s.address,
         s.class_id, s.teacher_id,
         c.class_id AS class_name,
         CONCAT(t.first_name, ' ', t.last_name) AS teacher_name
         FROM students s
         JOIN classes c ON s.class_id = c.id
         JOIN teachers t ON s.teacher_id = t.id
         WHERE s.id = ?`,
        [id]
      );

      res.json({
        message: 'Student updated successfully',
        student: students[0]
      });
    } catch (error) {
      // Delete uploaded file on error
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      console.error('Update student error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
};

// Delete student
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // Get student to get class_id for updating count
    const [students] = await pool.execute(
      'SELECT id, class_id, image FROM students WHERE id = ?',
      [id]
    );

    if (students.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const classId = students[0].class_id;
    const image = students[0].image;

    // Delete student
    const [result] = await pool.execute(
      'DELETE FROM students WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Delete image file
    if (image) {
      const imagePath = path.join(__dirname, '../../', image.replace('/uploads/', 'uploads/'));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Update student count
    await updateStudentCount(classId);

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  upload
};

