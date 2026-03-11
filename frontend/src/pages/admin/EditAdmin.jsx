// pages/EditAdmin.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader } from 'lucide-react';
import AdminForm from '../../components/forms/AdminForm';

const API_URL = 'http://localhost:3000/api';

const EditAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [error, setError] = useState(null);

  // Fetch admin data
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/users/${id}`);

        const admin = response.data.data || response.data.admin || response.data;

        setAdminData({
          _id: admin._id || admin.id,
          name: admin.name || '',
          email: admin.email || '',
          avatar: admin.avatar || '',
          role: admin.role || 'admin',
          createdBy: admin.createdBy || null
        });

        setLoading(false);
      } catch (error) {
        console.error('❌ Failed to fetch admin:', error);

        // Handle unauthorized/forbidden errors
        if (error.response?.status === 401) {
          alert('Your session has expired. Please login again.');
          navigate('/login');
        } else if (error.response?.status === 403) {
          alert('You do not have permission to view this admin.');
          navigate('/admins');
        } else {
          setError(error.response?.data?.message || 'Failed to load admin');
        }

        setLoading(false);
      }
    };

    if (id) {
      fetchAdmin();
    }
  }, [id, navigate]);

  // Handle form submission
  const handleSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      console.log('📤 Updating admin:', formData);

      const response = await axios.put(`${API_URL}/users/${id}`, formData);

      console.log('📥 Update response:', response.data);

      alert('Admin updated successfully!');
      navigate('/admins');

    } catch (error) {
      console.error('❌ Error updating admin:', error);

      if (error.response?.status === 401) {
        alert('Your session has expired. Please login again.');
        navigate('/login');
      } else if (error.response?.status === 403) {
        alert('You do not have permission to update this admin.');
      } else {
        const errorMessage = error.response?.data?.message || 'Failed to update admin. Please try again.';
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 text-center">
        <div className="bg-red-50 rounded-lg p-6">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/admins')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Admins
          </button>
        </div>
      </div>
    );
  }

  return (
    <AdminForm
      mode="edit"
      initialData={adminData}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isSubmitting={isSubmitting}
    />
  );
};

export default EditAdmin;