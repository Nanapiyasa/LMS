import React, { useState, useEffect } from 'react';
import { Gamepad2, Brain, Users, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function StudentDashboard() {
  const { user, userData, logout } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const modules = [
    {
      key: 'life-skills',
      title: 'Life Skills Module',
      description: 'Practice daily living and decision-making skills.',
      bg: '#ECFDF5',
      accent: '#059669',
      icon: Brain
    },
    {
      key: 'job-role-simulation',
      title: 'Job Role Simulation Module',
      description: 'Experience real-world job tasks in a safe space.',
      bg: '#EFF6FF',
      accent: '#2563EB',
      icon: Briefcase
    },
    {
      key: 'communication-social',
      title: 'Communication and Social Skills Module',
      description: 'Improve conversations, cues, and teamwork.',
      bg: '#FAF5FF',
      accent: '#7C3AED',
      icon: Users
    },
    {
      key: 'behaviour-emotional',
      title: 'Behaviour and Emotional Regulation Module',
      description: 'Build self-regulation and coping strategies.',
      bg: '#FFF7ED',
      accent: '#EA580C',
      icon: Gamepad2
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: '#F9FAFB' }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse top-0 left-0"></div>
        <div className="absolute w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse bottom-0 right-0 animation-delay-2000"></div>
      </div>

      <div className="max-w-6xl w-full relative z-10">
        {/* User info and logout */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            Welcome, {userData?.name || user?.email}!
          </h2>
          <p className="text-blue-200 mb-4">Role: {userData?.role}</p>
          <button 
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
        <div className="text-center space-y-8">
          <div className="space-y-2">
            <div className="mx-auto w-full h-px rounded-full" style={{ background: '#E5E7EB' }}></div>
            <h1 className="text-4xl md:text-5xl font-bold" style={{ color: '#111827' }}>Choose Your Module</h1>
            <p style={{ color: '#4B5563' }}>Pick a learning game to start your session</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map(({ key, title, description, bg, accent, icon: Icon }) => (
              <button
                key={key}
                onClick={() => navigate(`/student/${key}`)}
                className={`group relative overflow-hidden rounded-2xl p-5 text-left transition-all duration-200`}
                style={{
                  background: bg,
                  color: '#111827',
                  border: `1px solid ${accent}26`,
                  boxShadow: '0 4px 12px rgba(17,24,39,0.06)'
                }}
              >
                <div className="relative flex flex-col gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: '#FFFFFF', border: `1px solid ${accent}26` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: accent }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg leading-tight" style={{ color: '#111827' }}>{title}</h3>
                    <p className="text-sm mt-1" style={{ color: '#374151' }}>{description}</p>
                  </div>
                  <div className="mt-auto pt-2 text-sm" style={{ color: accent }}>Start ▶</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}