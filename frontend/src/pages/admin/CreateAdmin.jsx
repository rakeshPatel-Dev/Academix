// pages/CreateAdmin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminForm from '../../components/forms/AdminForm';

const API_URL = 'http://localhost:3000/api';

const CreateAdmin = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form submission
  const handleSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      console.log('📤 Creating admin:', formData);

      // Backend will handle authentication & authorization via middleware
      const response = await axios.post(`${API_URL}/users/register`, formData);

      console.log('📥 Create response:', response.data);

      alert('Admin created successfully!');
      navigate('/admins');

    } catch (error) {
      console.error('❌ Error creating admin:', error);

      // Handle unauthorized/forbidden errors
      if (error.response?.status === 401) {
        alert('Your session has expired. Please login again.');
        navigate('/login');
      } else if (error.response?.status === 403) {
        alert('You do not have permission to create admins.');
        navigate('/dashboard');
      } else {
        const errorMessage = error.response?.data?.message || 'Failed to create admin. Please try again.';
        alert(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (window.confirm('Any unsaved changes will be lost. Continue?')) {
      navigate('/admins');
    }
  };

  return (
    <AdminForm
      mode="create"
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isSubmitting={isSubmitting}
    />
  );
};

export default CreateAdmin;