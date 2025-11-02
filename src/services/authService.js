import api from './api';

const authService = {
  // Sign up new user
  signUp: async (userData) => {
    try {
      const response = await api.post('/auth/signup', userData);
      
      // Store token and user data
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error.response?.data?.message || 'Failed to sign up';
    }
  },

  // Sign in existing user
  signIn: async (credentials) => {
    try {
      const response = await api.post('/auth/signin', credentials);
      
      // Store token and user data
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error.response?.data?.message || 'Failed to sign in';
    }
  },

  // Sign out user
  signOut: async () => {
    try {
      await api.post('/auth/signout');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      return true;
    } catch (error) {
      console.error('Error signing out:', error);
      // Still remove local data even if API call fails
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      return true;
    }
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  }
};

export default authService;
