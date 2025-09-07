import { supabase } from '../supabaseConfig';

// Retry wrapper for Supabase operations
export const withRetry = async (operation, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      console.warn(`Attempt ${i + 1} failed:`, error.message);
      
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError;
};

// Get user data with proper error handling
export const getUserData = async (userId) => {
  try {
    console.log('getUserData called with userId:', userId);
    
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Query timeout after 10 seconds')), 10000)
    );
    
    const queryPromise = supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    console.log('Query started, waiting for response...');
    const { data, error } = await Promise.race([queryPromise, timeoutPromise]);
    
    console.log('getUserData response:', { data, error });
    
    if (error) {
      console.warn('User document not found for:', userId, 'Error:', error);
      return null;
    }
    
    console.log('getUserData success:', data);
    return data;
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};

// Get current user from Supabase Auth
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Sign in with email and password
export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

// Sign up with email and password
export const signUp = async (email, password, userData = {}) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
};

// Sign out
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

// Update user profile in users table
export const updateUserProfile = async (userId, updates) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

// Test Supabase connection
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) throw error;
    
    return {
      success: true,
      message: 'Supabase connection successful',
      data
    };
  } catch (error) {
    return {
      success: false,
      message: 'Supabase connection failed',
      error: error.message
    };
  }
};

// Connection state monitoring
export const monitorConnection = () => {
  if (typeof window !== 'undefined') {
    console.log('Supabase connection monitoring enabled');
    
    // Monitor for network connectivity changes
    window.addEventListener('online', () => {
      console.log('Network connection restored');
    });
    
    window.addEventListener('offline', () => {
      console.log('Network connection lost');
    });
  }
};

// Initialize connection monitoring
export const initializeSupabase = () => {
  monitorConnection();
  console.log('Supabase connection monitoring initialized');
};
