// pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import AdminForm from '../components/forms/AdminForm';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await login(formData.email, formData.password);

      if (res?.success) {
        if (res.requiresOtp) {
          toast.success(res.message || 'OTP sent to your email.');
          navigate('/verify-otp', {
            state: {
              mode: 'login',
              email: res.email || formData.email,
              password: formData.password,
            },
            replace: true,
          });
          return;
        }

        toast.success('Login successful! Redirecting...');
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      // useAuth should handle error state, but log for debugging
      console.error('Login failed:', err);
      toast.error(err.message || 'Login failed');
    }
  };

  return (
    <AdminForm
      type="login"
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      formData={formData}
      setFormData={setFormData}
    />
  );
};

export default Login;