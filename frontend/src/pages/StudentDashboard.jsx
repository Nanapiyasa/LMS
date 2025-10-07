import React, { useState, useEffect } from 'react';
import { Clock, Mail, Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function StudentDashboard() {
  const { user, userData, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 45,
    hours: 12,
    minutes: 30,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse top-0 left-0"></div>
        <div className="absolute w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse bottom-0 right-0 animation-delay-2000"></div>
      </div>

      <div className="max-w-4xl w-full relative z-10">
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
          {/* Icon */}
          <div className="flex justify-center">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-full p-6 border border-white border-opacity-20">
              <Clock className="w-16 h-16 text-white" />
            </div>
          </div>

          {/* Main heading */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tight">
              Coming Soon
            </h1>
            <p className="text-xl md:text-2xl text-blue-200 max-w-2xl mx-auto">
              Something amazing is on the way. Get ready for an experience like no other.
            </p>
          </div>

          {/* Countdown timer */}
          <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds }
            ].map((item, i) => (
              <div key={i} className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {String(item.value).padStart(2, '0')}
                </div>
                <div className="text-sm md:text-base text-blue-200 uppercase tracking-wider">
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          {/* Email subscription */}
          <div className="max-w-md mx-auto">
            {!subscribed ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-12 pr-4 py-4 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                  >
                    <Bell className="w-5 h-5" />
                    Notify Me
                  </button>
                </div>
                <p className="text-sm text-blue-200">
                  Be the first to know when we launch
                </p>
              </form>
            ) : (
              <div className="bg-green-500 bg-opacity-20 backdrop-blur-lg border border-green-400 border-opacity-30 rounded-xl p-6 animate-pulse">
                <p className="text-white font-semibold text-lg">
                  🎉 Thank you! You'll be notified when we launch.
                </p>
              </div>
            )}
          </div>

          {/* Social links placeholder */}
          <div className="flex justify-center gap-6 pt-8">
            {['Twitter', 'Facebook', 'Instagram'].map((social, i) => (
              <button
                key={i}
                className="w-12 h-12 bg-white bg-opacity-10 backdrop-blur-lg rounded-full border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center text-white hover:scale-110 transform"
              >
                {social[0]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}