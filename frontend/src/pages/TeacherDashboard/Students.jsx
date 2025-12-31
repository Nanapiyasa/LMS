import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { studentAPI, classAPI, teacherAPI } from '../../services/api';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    initials: '',
    first_name: '',
    last_name: '',
    parent_guardian_name: '',
    contact_no: '',
    address: '',
    class_id: '',
    teacher_id: ''
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStudents();
    loadClasses();
    loadTeachers();
  }, []);

  const loadStudents = async () => {
    try {
      const data = await studentAPI.getAllStudents();
      setStudents(data);
    } catch (err) {
      console.error('Error loading students:', err);
    }
  };

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          submitData.append(key, formData[key]);
        }
      });
      if (image) {
        submitData.append('image', image);
      }

      if (editingStudent) {
        await studentAPI.updateStudent(editingStudent.id, submitData);
      } else {
        await studentAPI.createStudent(submitData);
      }
      
      await loadStudents();
      closeModal();
    } catch (err) {
      setError(err.message || 'Failed to save student');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      initials: student.initials,
      first_name: student.first_name,
      last_name: student.last_name,
      parent_guardian_name: student.parent_guardian_name || '',
      contact_no: student.contact_no || '',
      address: student.address || '',
      class_id: student.class_id.toString(),
      teacher_id: student.teacher_id.toString()
    });
    setImagePreview(student.image ? `http://localhost:5000${student.image}` : null);
    setImage(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) {
      return;
    }

    try {
      await studentAPI.deleteStudent(id);
      await loadStudents();
    } catch (err) {
      alert(err.message || 'Failed to delete student');
    }
  };

  const openModal = () => {
    setEditingStudent(null);
    setFormData({
      initials: '',
      first_name: '',
      last_name: '',
      parent_guardian_name: '',
      contact_no: '',
      address: '',
      class_id: '',
      teacher_id: ''
    });
    setImage(null);
    setImagePreview(null);
    setError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingStudent(null);
    setFormData({
      initials: '',
      first_name: '',
      last_name: '',
      parent_guardian_name: '',
      contact_no: '',
      address: '',
      class_id: '',
      teacher_id: ''
    });
    setImage(null);
    setImagePreview(null);
    setError('');
  };

  // Filter teachers by selected class
  const getTeachersForClass = () => {
    if (!formData.class_id) return teachers;
    const selectedClass = classes.find(c => c.id.toString() === formData.class_id);
    if (!selectedClass) return teachers;
    return teachers.filter(t => t.id === selectedClass.teacher_id);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Students Management</h2>
            <p className="text-gray-600 mt-2">Manage student information and assignments</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Students</h3>
              <button
                onClick={openModal}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition"
              >
                Add New Student
              </button>
            </div>

            {students.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>No students yet. Add your first student to get started!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Image</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Initials</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Parent/Guardian</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Contact</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Class</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Teacher</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          {student.image ? (
                            <img
                              src={`http://localhost:5000${student.image}`}
                              alt={student.first_name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500 text-xs">
                                {student.initials}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">{student.initials}</td>
                        <td className="py-3 px-4">{student.first_name} {student.last_name}</td>
                        <td className="py-3 px-4">{student.parent_guardian_name || '-'}</td>
                        <td className="py-3 px-4">{student.contact_no || '-'}</td>
                        <td className="py-3 px-4">{student.class_name}</td>
                        <td className="py-3 px-4">{student.teacher_name}</td>
                        <td className="py-3 px-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(student)}
                              className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(student.id)}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {editingStudent ? 'Edit Student' : 'Add New Student'}
            </h3>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Initials *
                  </label>
                  <input
                    type="text"
                    name="initials"
                    value={formData.initials}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parent/Guardian Name
                  </label>
                  <input
                    type="text"
                    name="parent_guardian_name"
                    value={formData.parent_guardian_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact No
                  </label>
                  <input
                    type="tel"
                    name="contact_no"
                    value={formData.contact_no}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assigned Class *
                  </label>
                  <select
                    name="class_id"
                    value={formData.class_id}
                    onChange={(e) => {
                      handleInputChange(e);
                      // Auto-select teacher when class is selected
                      const selectedClass = classes.find(c => c.id.toString() === e.target.value);
                      if (selectedClass) {
                        setFormData(prev => ({ ...prev, teacher_id: selectedClass.teacher_id.toString() }));
                      }
                    }}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                  >
                    <option value="">Select a class</option>
                    {classes.map((classItem) => (
                      <option key={classItem.id} value={classItem.id}>
                        {classItem.class_id}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class Teacher *
                  </label>
                  <select
                    name="teacher_id"
                    value={formData.teacher_id}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                  >
                    <option value="">Select a teacher</option>
                    {getTeachersForClass().map((teacher) => {
                      const teacherClass = classes.find(c => c.teacher_id === teacher.id);
                      return (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.full_name} {teacherClass ? `(${teacherClass.class_id})` : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student Image
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                    />
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingStudent ? 'Update' : 'Create'}
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
















