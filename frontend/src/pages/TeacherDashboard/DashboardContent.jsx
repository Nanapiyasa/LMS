import React from 'react';
import { BarChart3, User, ChevronRight } from 'lucide-react';

export default function DashboardContent() {
  return (
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
  );
}