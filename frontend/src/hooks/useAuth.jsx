// hooks/useAuth.js
import { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3000/api';
const AuthContext = createContext();

// Provider component to wrap your app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Initialize axios defaults
  useEffect(() => {
    // Set default config for all axios requests
    axios.defaults.withCredentials = true; // Important for cookies

    // Add token to requests if exists (alternative to cookies)
    const token = localStorage.getItem('authToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  // Check if user is already logged in on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check authentication status
  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/users/me`);

      if (response.data.success) {
        setUser(response.data.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.log('Not authenticated', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(`${API_URL}/login`, {
        email,
        password
      });

      if (response.data.success) {
        setUser(response.data.data);
        setIsAuthenticated(true);

        // Store token in localStorage as backup (optional)
        if (response.data.token) {
          localStorage.setItem('authToken', response.data.token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        }

        return { success: true, data: response.data.data };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}/logout`);

      // Clear everything
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('authToken');
      delete axios.defaults.headers.common['Authorization'];

      navigate('/login');

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: 'Logout failed' };
    } finally {
      setLoading(false);
    }
  };

  // Register new admin (super admin only)
  const registerAdmin = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(`${API_URL}/users/register`, userData);

      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Update current user profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.put(`${API_URL}/users/me`, userData);

      if (response.data.success) {
        setUser(response.data.data);
        return { success: true, data: response.data.data };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(`${API_URL}/users/change-password`, {
        currentPassword,
        newPassword
      });

      if (response.data.success) {
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Password change failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Check if user is super admin
  const isSuperAdmin = () => {
    return user?.role === 'superadmin';
  };

  // Check if user is admin (including super admin)
  const isAdmin = () => {
    return user?.role === 'admin' || user?.role === 'superadmin';
  };

  // Refresh user data
  const refreshUser = async () => {
    await checkAuthStatus();
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    registerAdmin,
    updateProfile,
    changePassword,
    hasRole,
    isSuperAdmin,
    isAdmin,
    refreshUser,
    checkAuthStatus
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};