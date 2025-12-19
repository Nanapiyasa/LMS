import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, getToken } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Check if user is already logged in (has token)
    const checkAuth = async () => {
      const safety = setTimeout(() => setLoading(false), 4000);
      try {
        const token = getToken();
        if (token) {
          // Fetch current user data
          const response = await authAPI.getCurrentUser();
          if (response.user) {
            setUser({ id: response.user.id, email: response.user.email });
            setUserData(response.user);
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        // Token might be invalid, clear it
        authAPI.logout();
      } finally {
        clearTimeout(safety);
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authAPI.login(email, password);
      
      if (response.user && response.token) {
        setUser({ id: response.user.id, email: response.user.email });
        setUserData(response.user);
      }

      return { data: response, error: null };
    } catch (error) {
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      authAPI.logout();
      setUser(null);
      setUserData(null);
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    userData,
    loading,
    login,
    logout,
    isAuthenticated: !!user && !!getToken(),
    userRole: userData?.role || 'teacher'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

