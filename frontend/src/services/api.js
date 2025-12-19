// API service layer to replace Supabase calls
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Helper function to set auth token in localStorage
const setToken = (token) => {
  localStorage.setItem('token', token);
};

// Helper function to remove auth token from localStorage
const removeToken = () => {
  localStorage.removeItem('token');
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  // Remove Content-Type for FormData
  if (options.body instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (data.token) {
      setToken(data.token);
    }
    
    return data;
  },

  register: async (email, password, name, role = 'student') => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, role }),
    });
    
    if (data.token) {
      setToken(data.token);
    }
    
    return data;
  },

  logout: () => {
    removeToken();
  },

  getCurrentUser: async () => {
    return await apiRequest('/auth/me');
  },
};

// Teacher API
export const teacherAPI = {
  signup: async (formData) => {
    const data = await apiRequest('/teachers/signup', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
    
    if (data.token) {
      setToken(data.token);
    }
    
    return data;
  },

  getAllTeachers: async () => {
    return await apiRequest('/teachers');
  },

  getTeacherById: async (id) => {
    return await apiRequest(`/teachers/${id}`);
  },
};

// Class API
export const classAPI = {
  createClass: async (classData) => {
    return await apiRequest('/classes', {
      method: 'POST',
      body: JSON.stringify(classData),
    });
  },

  getAllClasses: async () => {
    return await apiRequest('/classes');
  },

  getClassById: async (id) => {
    return await apiRequest(`/classes/${id}`);
  },

  updateClass: async (id, classData) => {
    return await apiRequest(`/classes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(classData),
    });
  },

  deleteClass: async (id) => {
    return await apiRequest(`/classes/${id}`, {
      method: 'DELETE',
    });
  },
};

// Student API
export const studentAPI = {
  createStudent: async (formData) => {
    return await apiRequest('/students', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  },

  getAllStudents: async () => {
    return await apiRequest('/students');
  },

  getStudentById: async (id) => {
    return await apiRequest(`/students/${id}`);
  },

  updateStudent: async (id, formData) => {
    return await apiRequest(`/students/${id}`, {
      method: 'PUT',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  },

  deleteStudent: async (id) => {
    return await apiRequest(`/students/${id}`, {
      method: 'DELETE',
    });
  },
};

// User API
export const userAPI = {
  getUserProfile: async (userId) => {
    return await apiRequest(`/users/profile/${userId}`);
  },

  updateUserProfile: async (updates) => {
    return await apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },
};

// Export token management functions
export { getToken, setToken, removeToken };
