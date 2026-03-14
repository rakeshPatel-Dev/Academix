// pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import AdminForm from '../components/forms/AdminForm';

const Register = () => {
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
    avatar: ''
  });

  const validateForm = () => {
    if (!formData.name.trim()) {
      throw new Error('Name is required');
    }
    if (!formData.email.trim()) {
      throw new Error('Email is required');
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      throw new Error('Please enter a valid email address');
    }
    if (!formData.password) {
      throw new Error('Password is required');
    }
    if (formData.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    if (formData.password !== formData.confirmPassword) {
      throw new Error('Passwords do not match');
    }
    if (!formData.avatar.trim()) {
      throw new Error('Avatar is required');
    }
    try {
      new URL(formData.avatar);
    } catch {
      throw new Error('Please enter a valid URL');
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      validateForm();

      const registrationData = {
        email: formData.email,
        name: formData.name,
        password: formData.password,
        avatar: formData.avatar,
        confirmPassword: formData.confirmPassword
      };

      const res = await register(registrationData);
      if (res.success) {
        toast.success('Registration successful! Please login to continue.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <AdminForm
      type="register"
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      formData={formData}
      setFormData={setFormData}
      imagePreview={imagePreview}
      setImagePreview={setImagePreview}
    />
  );
};

export default Register;