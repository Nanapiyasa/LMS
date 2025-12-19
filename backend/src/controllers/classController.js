const { pool } = require('../config/database');

// Create a new class
const createClass = async (req, res) => {
  try {
    const { class_id, teacher_id } = req.body;

    if (!class_id || !teacher_id) {
      return res.status(400).json({ error: 'Class ID and Teacher ID are required' });
    }

    // Check if class_id already exists
    const [existingClasses] = await pool.execute(
      'SELECT id FROM classes WHERE class_id = ?',
      [class_id]
    );

    if (existingClasses.length > 0) {
      return res.status(400).json({ error: 'Class ID already exists' });
    }

    // Verify teacher exists
    const [teachers] = await pool.execute(
      'SELECT id FROM teachers WHERE id = ?',
      [teacher_id]
    );

    if (teachers.length === 0) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    // Insert class
    const [result] = await pool.execute(
      'INSERT INTO classes (class_id, teacher_id, student_count) VALUES (?, ?, 0)',
      [class_id, teacher_id]
    );

    // Get created class with teacher details
    const [classes] = await pool.execute(
      `SELECT c.id, c.class_id, c.teacher_id, c.student_count,
       t.initials, t.first_name, t.last_name,
       CONCAT(t.first_name, ' ', t.last_name) AS teacher_name
       FROM classes c
       JOIN teachers t ON c.teacher_id = t.id
       WHERE c.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      message: 'Class created successfully',
      class: classes[0]
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
      `SELECT c.id, c.class_id, c.teacher_id, c.student_count,
       t.initials, t.first_name, t.last_name,
       CONCAT(t.first_name, ' ', t.last_name) AS teacher_name
       FROM classes c
       JOIN teachers t ON c.teacher_id = t.id
       ORDER BY c.class_id`
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
      `SELECT c.id, c.class_id, c.teacher_id, c.student_count,
       t.initials, t.first_name, t.last_name,
       CONCAT(t.first_name, ' ', t.last_name) AS teacher_name
       FROM classes c
       JOIN teachers t ON c.teacher_id = t.id
       WHERE c.id = ?`,
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

// Update class
const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { class_id, teacher_id } = req.body;

    // Check if class exists
    const [existingClasses] = await pool.execute(
      'SELECT id FROM classes WHERE id = ?',
      [id]
    );

    if (existingClasses.length === 0) {
      return res.status(404).json({ error: 'Class not found' });
    }

    // If class_id is being updated, check for duplicates
    if (class_id) {
      const [duplicateClasses] = await pool.execute(
        'SELECT id FROM classes WHERE class_id = ? AND id != ?',
        [class_id, id]
      );

      if (duplicateClasses.length > 0) {
        return res.status(400).json({ error: 'Class ID already exists' });
      }
    }

    // Verify teacher exists if being updated
    if (teacher_id) {
      const [teachers] = await pool.execute(
        'SELECT id FROM teachers WHERE id = ?',
        [teacher_id]
      );

      if (teachers.length === 0) {
        return res.status(404).json({ error: 'Teacher not found' });
      }
    }

    // Build update query
    const updates = [];
    const values = [];

    if (class_id) {
      updates.push('class_id = ?');
      values.push(class_id);
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
      `SELECT c.id, c.class_id, c.teacher_id, c.student_count,
       t.initials, t.first_name, t.last_name,
       CONCAT(t.first_name, ' ', t.last_name) AS teacher_name
       FROM classes c
       JOIN teachers t ON c.teacher_id = t.id
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

// Delete class
const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      'DELETE FROM classes WHERE id = ?',
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

// Update student count for a class
const updateStudentCount = async (classId) => {
  try {
    const [students] = await pool.execute(
      'SELECT COUNT(*) as count FROM students WHERE class_id = ?',
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
  updateStudentCount
};






