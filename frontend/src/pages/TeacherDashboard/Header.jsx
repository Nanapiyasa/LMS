import React from 'react';
import { User } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-orange-500 text-white">
      <div className="px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Welcome, LMS Crafter</h1>
            <p className="text-orange-100 mt-1">We are happy to see you here. Explore your journey!</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition">
            Update Profile Picture
          </button>
          <button className="px-6 py-2 bg-white text-orange-600 rounded-lg font-medium hover:bg-orange-50 transition">
            Log Out
          </button>
        </div>
      </div>
    </header>
  );
}