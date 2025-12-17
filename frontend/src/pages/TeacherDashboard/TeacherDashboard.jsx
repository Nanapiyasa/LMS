import React from 'react';
import { BookOpen, BarChart3, FileText, Users, Home, Menu, LogOut, User, ChevronRight } from 'lucide-react';

export default function LMSCrafterDashboard() {
  return (
    <>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
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

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
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

          <div className="p-8">
            <div className="flex gap-8">
              {/* My Courses Section */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">My Schedule</h2>

                <div className="space-y-6">
                  {/* Course 1 */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300"></div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">CTP - 2</h3>
                        <div className="mt-3">
                          <div className="flex items-center gap-3 text-sm">
                            <span className="text-gray-500">0% Complete</span>
                            <div className="w-48 bg-gray-200 rounded-full h-2">
                              <div className="bg-orange-500 h-2 rounded-full" style={{width: '0%'}}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button className="px-8 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition">
                      Enrolled
                    </button>
                  </div>

                  {/* Course 2 */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300"></div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">FC CMA Part 2 - June 2025</h3>
                        <div className="mt-3">
                          <div className="flex items-center gap-3 text-sm">
                            <span className="text-gray-500">0% Complete</span>
                            <div className="w-48 bg-gray-200 rounded-full h-2">
                              <div className="bg-orange-500 h-2 rounded-full" style={{width: '0%'}}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button className="px-8 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition">
                      Enrolled
                    </button>
                  </div>
                </div>

                <button className="mt-8 px-8 py-3 bg-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition">
                  Load More
                </button>
              </div>

              {/* Right Sidebar */}
              <div className="w-80 space-y-6">
                {/* Activities */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Activities</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">All Courses</p>
                        <p className="text-sm text-gray-500">Your gateway to all the courses you've ever enrolled in</p>
                      </div>
                    </div>
                    <button className="w-full mt-4 px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition flex items-center justify-center gap-2">
                      Click Here
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* My Account */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <User className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">My Account</p>
                      <p className="text-sm text-gray-500">Manage your account, preferences, and settings</p>
                    </div>
                  </div>
                  <button className="w-full px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition flex items-center justify-center gap-2">
                    Click Here
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}