const { pool } = require('../config/database');

const safe = (value) => (value === undefined ? null : value);

// Create a new class (Admin only)
const createClass = async (req, res) => {
  try {
    const { class_name, teacher_id } = req.body;

    if (!class_name || !teacher_id) {
      return res.status(400).json({ error: 'Class name and Teacher ID are required' });
    }

    // Verify teacher exists
    const [teachers] = await pool.execute(
      'SELECT id, first_name, last_name FROM teachers WHERE id = ?',
      [teacher_id]
    );

    if (teachers.length === 0) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    const teacher = teachers[0];

    // Insert class
    const [result] = await pool.execute(
      'INSERT INTO classes (class_name, teacher_id, student_count, is_active) VALUES (?, ?, 0, TRUE)',
      [safe(class_name), safe(teacher_id)]
    );

    res.status(201).json({
      message: 'Class created successfully',
      class: {
        id: result.insertId,
        class_name,
        teacher_id,
        teacher_name: `${teacher.first_name} ${teacher.last_name}`,
        student_count: 0,
        is_active: true,
        created_at: new Date()
      }
    });
  } catch (error) {
    console.error('Create class error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all classes
const getAllClasses = async (req, res) => {
  try {
    const [classes] = await pool.execute(
      `SELECT c.id, c.class_name, c.teacher_id, c.student_count, c.is_active,
              t.initials, t.first_name, t.last_name,
              CONCAT(t.first_name, ' ', t.last_name) AS teacher_name,
              c.created_at, c.updated_at
       FROM classes c
       LEFT JOIN teachers t ON c.teacher_id = t.id
       WHERE c.is_active = TRUE
       ORDER BY c.class_name`
    );

    res.json(classes);
  } catch (error) {
    console.error('Get all classes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get class by ID
const getClassById = async (req, res) => {
  try {
    const { id } = req.params;

    const [classes] = await pool.execute(
      `SELECT c.id, c.class_name, c.teacher_id, c.student_count, c.is_active,
              t.initials, t.first_name, t.last_name,
              CONCAT(t.first_name, ' ', t.last_name) AS teacher_name
       FROM classes c
       LEFT JOIN teachers t ON c.teacher_id = t.id
       WHERE c.id = ? AND c.is_active = TRUE`,
      [id]
    );

    if (classes.length === 0) {
      return res.status(404).json({ error: 'Class not found' });
    }

    res.json(classes[0]);
  } catch (error) {
    console.error('Get class error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update class (Admin only)
const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { class_name, teacher_id } = req.body;

    // Check if class exists
    const [existingClasses] = await pool.execute(
      'SELECT id FROM classes WHERE id = ?',
      [id]
    );

    if (existingClasses.length === 0) {
      return res.status(404).json({ error: 'Class not found' });
    }

    // Verify teacher exists if being updated
    if (teacher_id) {
      const [teachers] = await pool.execute(
        'SELECT id, first_name, last_name FROM teachers WHERE id = ?',
        [teacher_id]
      );

      if (teachers.length === 0) {
        return res.status(404).json({ error: 'Teacher not found' });
      }
    }

    // Build update query
    const updates = [];
    const values = [];

    if (class_name) {
      updates.push('class_name = ?');
      values.push(class_name);
    }

    if (teacher_id) {
      updates.push('teacher_id = ?');
      values.push(teacher_id);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push('updated_at = NOW()');
    values.push(id);

    await pool.execute(
      `UPDATE classes SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    // Get updated class
    const [classes] = await pool.execute(
      `SELECT c.id, c.class_name, c.teacher_id, c.student_count, c.is_active,
              t.initials, t.first_name, t.last_name,
              CONCAT(t.first_name, ' ', t.last_name) AS teacher_name
       FROM classes c
       LEFT JOIN teachers t ON c.teacher_id = t.id
       WHERE c.id = ?`,
      [id]
    );

    res.json({
      message: 'Class updated successfully',
      class: classes[0]
    });
  } catch (error) {
    console.error('Update class error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete class (Admin only)
const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if class has students
    const [students] = await pool.execute(
      'SELECT COUNT(*) as count FROM students WHERE class_id = ?',
      [id]
    );

    if (students[0].count > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete class with assigned students. Please remove or reassign students first.' 
      });
    }

    const [result] = await pool.execute(
      'UPDATE classes SET is_active = FALSE, updated_at = NOW() WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Class not found' });
    }

    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error('Delete class error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get students in a class
const getClassStudents = async (req, res) => {
  try {
    const { id } = req.params;

    const [students] = await pool.execute(
      `SELECT s.id, s.initials, s.first_name, s.last_name, s.image, 
              s.guardian_parent_name, s.guardian_type, s.contact_no, s.address,
              u.username, u.email
       FROM students s
       LEFT JOIN users u ON s.user_id = u.id
       WHERE s.class_id = ?
       ORDER BY s.first_name, s.last_name`,
      [id]
    );

    res.json(students);
  } catch (error) {
    console.error('Get class students error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update student count for a class
const updateStudentCount = async (classId) => {
  try {
    const [students] = await pool.execute(
      'SELECT COUNT(*) as count FROM students WHERE class_id = ? AND user_id IS NOT NULL',
      [classId]
    );

    await pool.execute(
      'UPDATE classes SET student_count = ? WHERE id = ?',
      [students[0].count, classId]
    );
  } catch (error) {
    console.error('Update student count error:', error);
  }
};

module.exports = {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
  getClassStudents,
  updateStudentCount
};
















