import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { classAPI, teacherAPI } from '../../services/api';

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({
    class_id: '',
    teacher_id: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadClasses();
    loadTeachers();
  }, []);

  const loadClasses = async () => {
    try {
      const data = await classAPI.getAllClasses();
      setClasses(data);
    } catch (err) {
      console.error('Error loading classes:', err);
    }
  };

  const loadTeachers = async () => {
    try {
      const data = await teacherAPI.getAllTeachers();
      setTeachers(data);
    } catch (err) {
      console.error('Error loading teachers:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (editingClass) {
        await classAPI.updateClass(editingClass.id, formData);
      } else {
        await classAPI.createClass(formData);
      }
      await loadClasses();
      setShowModal(false);
      setFormData({ class_id: '', teacher_id: '' });
      setEditingClass(null);
    } catch (err) {
      setError(err.message || 'Failed to save class');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (classItem) => {
    setEditingClass(classItem);
    setFormData({
      class_id: classItem.class_id,
      teacher_id: classItem.teacher_id.toString()
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this class?')) {
      return;
    }

    try {
      await classAPI.deleteClass(id);
      await loadClasses();
    } catch (err) {
      alert(err.message || 'Failed to delete class');
    }
  };

  const openModal = () => {
    setEditingClass(null);
    setFormData({ class_id: '', teacher_id: '' });
    setError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingClass(null);
    setFormData({ class_id: '', teacher_id: '' });
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">My Classes</h2>
            <p className="text-gray-600 mt-2">Manage your classes and students</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Classes</h3>
              <button
                onClick={openModal}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition"
              >
                Create New Class
              </button>
            </div>

            {classes.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>No classes yet. Create your first class to get started!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Class ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Teacher Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Student Count</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classes.map((classItem) => (
                      <tr key={classItem.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">{classItem.class_id}</td>
                        <td className="py-3 px-4">{classItem.teacher_name}</td>
                        <td className="py-3 px-4">{classItem.student_count}</td>
                        <td className="py-3 px-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(classItem)}
                              className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(classItem.id)}
                              className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {editingClass ? 'Edit Class' : 'Create New Class'}
            </h3>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class ID *
                  </label>
                  <input
                    type="text"
                    value={formData.class_id}
                    onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teacher Name *
                  </label>
                  <select
                    value={formData.teacher_id}
                    onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select a teacher</option>
                    {teachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.full_name} ({teacher.initials})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingClass ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
