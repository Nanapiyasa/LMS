import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import LifeSkills from "./pages/LifeSkills";
import JobRoleSimulation from "./pages/JobRoleSimulation";
import CommunicationSocial from "./pages/CommunicationSocial";
import BehaviourEmotional from "./pages/BehaviourEmotional";
import ParentDashboard from "./pages/ParentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import CSSDebugTest from "./pages/CSSDebugTest";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/css-debug" element={<CSSDebugTest />} />
          <Route path="/student/*" element={
            <ProtectedRoute requiredRole="student">
              <Routes>
                <Route path="" element={<StudentDashboard />} />
                <Route path="life-skills" element={<LifeSkills />} />
                <Route path="job-role-simulation" element={<JobRoleSimulation />} />
                <Route path="communication-social" element={<CommunicationSocial />} />
                <Route path="behaviour-emotional" element={<BehaviourEmotional />} />
              </Routes>
            </ProtectedRoute>
          } />
          <Route path="/teacher/*" element={
            <ProtectedRoute requiredRole="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          } />
          <Route path="/parent/*" element={
            <ProtectedRoute requiredRole="parent">
              <ParentDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/*" element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          {/* Default redirect - will be handled by ProtectedRoute */}
          <Route path="/" element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          } />
          <Route path="*" element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
