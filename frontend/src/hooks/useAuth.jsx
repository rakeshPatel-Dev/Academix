// hooks/useAuth.js
import { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = `${import.meta.env.VITE_BACKEND_API_ENDPOINT}/admins`;
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
  }, []);

  // Check if user is already logged in on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check authentication status
  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/profile`, { withCredentials: true });

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
      }, { withCredentials: true });

      if (response.data.success) {
        setUser(response.data.data);
        setIsAuthenticated(true);
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };


  // forget password function
  const forgetPassword = async (email) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(`${API_URL}/forget-password`, {
        email
      }, { withCredentials: true });

      if (response.data.success) {
        // Don't set user or authenticate - this is just a password reset request
        return { success: true, message: response.data.message || 'Password reset email sent' };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Password reset request failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(`${API_URL}/register`, userData, { withCredentials: true });

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

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });

      // Clear everything
      setUser(null);
      setIsAuthenticated(false);
      navigate('/login');

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      // Clear state even if server fails
      setUser(null);
      setIsAuthenticated(false);
      navigate('/login');
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  // hooks/useAuth.js - Add this function inside your AuthProvider
  const deleteAccount = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.delete(`${API_URL}/delete`, {
        withCredentials: true
      });

      if (response.data.success) {
        // Clear user data
        setUser(null);
        setIsAuthenticated(false);
        // Navigate to login or home page
        navigate('/login');
        return { success: true, message: response.data.message || 'Account deleted successfully' };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Account deletion failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    forgetPassword,
    register,
    deleteAccount,
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