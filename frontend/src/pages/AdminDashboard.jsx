import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard = () => {
  const { user, userData, logout } = useAuth();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {userData?.name || user?.email}!</p>
      <p>Role: {userData?.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default AdminDashboard;

