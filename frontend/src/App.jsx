import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./supabaseConfig";
import { getUserData, initializeSupabase, testSupabaseConnection } from "./utils/supabaseHelpers";

import AdminDashboard from "./pages/AdminDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ParentDashboard from "./pages/ParentDashboard";
import Login from "./pages/Login";
import Profile from "./pages/Profile";

function App() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasResolvedRole, setHasResolvedRole] = useState(false);

  useEffect(() => {
    console.log('App useEffect started');
    
    // Check if Supabase is configured
    try {
      console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
      console.log('Supabase Anon Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
      
      // Initialize Supabase connection monitoring
      initializeSupabase();
      
      // Test Supabase connection on app start
      testSupabaseConnection().then(result => {
        console.log('Supabase connection test result:', result);
        if (!result.success) {
          setError(`Supabase connection failed: ${result.message}`);
          setLoading(false);
          return;
        }
      });
      
      // Listen for auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        try {
          setError(null);
          if (session?.user) {
            console.log("User authenticated:", session.user.id);
            
            // Get user data from our users table
            try {
              const userData = await getUserData(session.user.id);
              
              if (userData) {
                console.log("User data retrieved:", userData);
                const normalizedRole = String(userData.role || 'student').toLowerCase().trim();
                setRole(normalizedRole);
                setHasResolvedRole(true);
              } else {
                console.warn("User document not found, setting default role");
                setRole((prev) => prev ?? 'student');
              }
            } catch (supabaseError) {
              console.warn("Supabase access failed, using default role:", supabaseError.message);
              setRole((prev) => prev ?? 'student');
            }
          } else {
            console.log("No user session");
            setRole(null);
          }
        } catch (error) {
          console.error("Auth state change error:", error);
          setError(error.message);
          setRole(null);
        } finally {
          setLoading(false);
        }
      });

      return () => subscription.unsubscribe();
    } catch (configError) {
      console.error('Supabase configuration error:', configError);
      setError(`Configuration error: ${configError.message}`);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column'
      }}>
        <h2>Loading...</h2>
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={role ? <Navigate to="/" /> : <Login />} />
        <Route path="/profile" element={<Profile />} />
        {role === "admin" && <Route path="/*" element={<AdminDashboard />} />}
        {role === "teacher" && <Route path="/*" element={<TeacherDashboard />} />}
        {role === "student" && <Route path="/*" element={<StudentDashboard />} />}
        {role === "parent" && <Route path="/*" element={<ParentDashboard />} />}
        {!role && <Route path="*" element={<Navigate to="/login" />} />}
      </Routes>
    </Router>
  );
}

export default App;
