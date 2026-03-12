// pages/AdminProfile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  User,
  Mail,
  Shield,
  Edit2,
  LogOut,
  Camera,
  Calendar,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EditProfileModal from './admin/EditAdmin';

const AdminProfile = () => {
  const { user, logout, loading: authLoading, checkAuthStatus } = useAuth();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (user) {
      setCurrentUser(user);
    }
  }, [user]);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleUpdateSuccess = (updatedData) => {
    setCurrentUser(prev => ({
      ...prev,
      ...updatedData
    }));
    checkAuthStatus(); // Refresh auth context
    setImageError(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Shield size={48} className="text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Not Authenticated</h2>
          <p className="text-gray-600 mb-4">Please log in to view your profile</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
              <p className="text-gray-600 mt-1">Manage your account information</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-8">
              <div className="flex items-center gap-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur flex items-center justify-center overflow-hidden border-4 border-white/50">
                    {currentUser.avatar && !imageError ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                      />
                    ) : (
                      <User size={40} className="text-white" />
                    )}
                  </div>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                  >
                    <Camera size={16} className="text-gray-600" />
                  </button>
                </div>

                {/* User Info */}
                <div className="flex-1 text-white">
                  <h2 className="text-2xl font-bold mb-1">{currentUser.name}</h2>
                  <p className="text-blue-100 flex items-center gap-2">
                    <Mail size={16} />
                    {currentUser.email}
                  </p>
                  <p className="text-blue-100 text-sm mt-1 flex items-center gap-2">
                    <Shield size={14} />
                    Administrator
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-6">
              {/* Profile Info Display */}
              <div className="space-y-6">
                {/* Name Display */}
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User size={20} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">Full Name</p>
                    <p className="text-lg font-medium text-gray-900">{currentUser.name}</p>
                  </div>
                </div>

                {/* Email Display */}
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Mail size={20} className="text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">Email Address</p>
                    <p className="text-lg font-medium text-gray-900">{currentUser.email}</p>
                  </div>
                </div>

                {/* Avatar URL Display (if exists) */}
                {currentUser.avatar && (
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Camera size={20} className="text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-500 mb-1">Profile Image</p>
                      <p className="text-sm text-gray-900 truncate">{currentUser.avatar}</p>
                    </div>
                  </div>
                )}

                {/* Account Info Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center gap-3 text-gray-600 mb-2">
                      <Calendar size={18} />
                      <span className="text-sm font-medium">Member Since</span>
                    </div>
                    <p className="text-gray-900 font-medium">
                      {currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'N/A'}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center gap-3 text-gray-600 mb-2">
                      <Clock size={18} />
                      <span className="text-sm font-medium">Last Updated</span>
                    </div>
                    <p className="text-gray-900 font-medium">
                      {currentUser.updatedAt ? new Date(currentUser.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Edit Button */}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200"
                >
                  <Edit2 size={18} />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-gray-500 mt-8">
            © {new Date().getFullYear()} AcademiX. All rights reserved.
          </p>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={currentUser}
        onUpdate={handleUpdateSuccess}
      />
    </>
  );
};

export default AdminProfile;