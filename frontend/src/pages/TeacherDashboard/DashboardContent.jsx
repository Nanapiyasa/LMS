import React from 'react';
import Sidebar from './Sidebar';           // We'll make a pure Sidebar
import Header from './Header';               // Pure Header
import DashboardContent from './DashboardContent';

export default function LMSCrafterDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <DashboardContent />
      </div>
    </div>
  );
}