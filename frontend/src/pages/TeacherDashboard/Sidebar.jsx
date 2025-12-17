import React from 'react';
import { BookOpen, BarChart3, FileText, Users, Home, LogOut } from 'lucide-react';

export default function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-sm">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-800">Nnapiyasa Edu</span>
        </div>

        <nav className="space-y-1">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-orange-50 text-orange-600 rounded-lg font-medium">
            <Home className="w-5 h-5" />
            Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
            <Users className="w-5 h-5" />
            Students
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
            <BarChart3 className="w-5 h-5" />
            Reports
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
            <FileText className="w-5 h-5" />
            Learning Section
          </a>
        </nav>

        <div className="mt-12">
          <div className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Day Schedule
          </div>
          <nav className="space-y-1">
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-orange-600" />
              </div>
              Day Schedule
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                <FileText className="w-4 h-4 text-purple-600" />
              </div>
              My Quizzes
            </a>
          </nav>
        </div>

        <a href="#" className="flex items-center gap-3 px-4 py-4 mt-8 text-red-600 hover:bg-red-50 rounded-lg">
          <LogOut className="w-5 h-5" />
          Contact US
        </a>
      </div>
    </div>
  );
}