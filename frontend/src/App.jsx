import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import TeacherDashboard from "./pages/TeacherDashboard/TeacherDashboard";
import Classes from "./pages/TeacherDashboard/Classes";
import Students from "./pages/TeacherDashboard/Students";
import TeacherSignup from "./pages/TeacherSignup";
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
          <Route path="/teacher/signup" element={<TeacherSignup />} />

          {/* Protected routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/css-debug" element={<CSSDebugTest />} />
          <Route
            path="/teacher/*"
            element={
              <ProtectedRoute requiredRole="teacher">
                <Routes>
                  <Route path="" element={<TeacherDashboard />} />
                  <Route path="classes" element={<Classes />} />
                  <Route path="students" element={<Students />} />
                </Routes>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Default redirect - will be handled by ProtectedRoute */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
