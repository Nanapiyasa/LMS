import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const { user, userData, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const displayName = userData?.name || user?.email || 'User';

  return (
    <header className="bg-orange-500 text-white">
      <div className="px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Welcome, {displayName}</h1>
            <p className="text-orange-100 mt-1">We are happy to see you here. Explore your journey!</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition">
            Update Profile Picture
          </button>
          <button 
            onClick={handleLogout}
            className="px-6 py-2 bg-white text-orange-600 rounded-lg font-medium hover:bg-orange-50 transition"
          >
            Log Out
          </button>
        </div>
      </div>
    </header>
  );
}