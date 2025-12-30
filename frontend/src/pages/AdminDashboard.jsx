import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { teacherAPI } from '../services/api';

const AdminDashboard = () => {
  const { user, userData, logout } = useAuth();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const data = await teacherAPI.getAllTeachers();
        setTeachers(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch teachers:', err);
        setError('Failed to load registered teachers');
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {userData?.name || user?.email}!</p>
      <p>Role: {userData?.role}</p>

      <hr />

      <section style={{ marginTop: '30px' }}>
        <h2>Register Teachers</h2>
        
        {loading && <p>Loading teachers...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        {!loading && !error && (
          <div style={{ overflowX: 'auto' }}>
            {teachers.length === 0 ? (
              <p>No registered teachers yet.</p>
            ) : (
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                marginTop: '15px'
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#f0f0f0', borderBottom: '2px solid #ddd' }}>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Name</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Email</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Username</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Address</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Admin</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((teacher, index) => (
                    <tr 
                      key={teacher.id} 
                      style={{ 
                        borderBottom: '1px solid #ddd',
                        backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9'
                      }}
                    >
                      <td style={{ padding: '10px' }}>
                        {teacher.first_name} {teacher.last_name}
                      </td>
                      <td style={{ padding: '10px' }}>{teacher.email}</td>
                      <td style={{ padding: '10px' }}>{teacher.username}</td>
                      <td style={{ padding: '10px' }}>{teacher.address}</td>
                      <td style={{ padding: '10px' }}>
                        <span style={{ 
                          padding: '4px 8px',
                          borderRadius: '4px',
                          backgroundColor: teacher.is_active ? '#d4edda' : '#f8d7da',
                          color: teacher.is_active ? '#155724' : '#721c24',
                          fontSize: '12px'
                        }}>
                          {teacher.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ padding: '10px' }}>
                        {teacher.is_admin ? 'Yes' : 'No'}
                      </td>
                      <td style={{ padding: '10px' }}>
                        {new Date(teacher.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </section>

      <hr />

      <button onClick={logout} style={{ marginTop: '20px', padding: '10px 20px' }}>
        Logout
      </button>
    </div>
  );
};

export default AdminDashboard;

