// components/EditProfileModal.jsx
import React, { useState, useEffect } from 'react';
import { User, Mail, Image, X, Loader, AlertCircle, CheckCircle, BrushCleaning } from 'lucide-react';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_API_ENDPOINT}/admins`;

const EditProfileModal = ({ isOpen, onClose, user, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageError, setImageError] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        avatar: user.avatar || ''
      });
      setImagePreview(user.avatar || '');
      setImageError(false);
      setError('');
      setSuccess('');
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');

    if (name === 'avatar') {
      setImagePreview(value);
      setImageError(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const removeAvatarUrl = () => {
    formData.avatar = "";
  }

  const isValidUrl = (string) => {
    try {
      const url = new URL(string);
      return ['http:', 'https:'].includes(url.protocol);
    } catch (_) {
      return false;
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (formData.avatar && !isValidUrl(formData.avatar)) {
      setError('Please enter a valid image URL');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.put(
        `${API_URL}/profile`,
        formData,
        { withCredentials: true }
      );

      if (response.data.success) {
        setSuccess('Profile updated successfully!');
        setTimeout(() => {
          onUpdate(response.data.user || response.data.data || formData);
          onClose();
        }, 1500);
      } else {
        setError(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Edit Profile</h3>
              <button
                onClick={onClose}
                className="rounded-lg p-1 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Success Message */}
            {success && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <CheckCircle size={18} />
                {success}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <div className="space-y-4">
              {/* Avatar Preview */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200">
                    {imagePreview && !imageError ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <User size={32} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Name Field */}
              <div>
                <label htmlFor="modal-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={16} className="text-gray-400" />
                  </div>
                  <input
                    id="modal-name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="John Doe"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="modal-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={16} className="text-gray-400" />
                  </div>
                  <input
                    id="modal-email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="admin@academix.edu"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Avatar URL Field */}
              <div>
                <label htmlFor="modal-avatar" className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Image URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Image size={16} className="text-gray-400" />
                  </div>
                  <input
                    id="modal-avatar"
                    name="avatar"
                    type="url"
                    value={formData.avatar}
                    onChange={handleChange}
                    className="w-full pl-9 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="https://example.com/image.jpg"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, avatar: "" }))}
                    disabled={!formData.avatar || loading}
                    className="absolute top-1/2 -translate-y-1/2 right-2 p-1.5 rounded-md
                 bg-red-100 text-red-400
                 hover:bg-red-500 hover:text-white hover:shadow-md
                 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-red-100 disabled:hover:text-red-400 disabled:hover:shadow-none
                 transition-all duration-200 cursor-pointer"
                    title="Clear image URL"
                  >
                    <BrushCleaning size={16} />
                  </button>
                </div>
              </div>

              {/* Image Error Warning */}
              {imageError && (
                <div className="text-xs text-yellow-600 bg-yellow-50 p-2 rounded-lg">
                  ⚠️ Unable to load image from the provided URL
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;