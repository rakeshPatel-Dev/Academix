// pages/Admins.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Mail,
  Edit,
  Trash2,
  Plus,
  Search,
  User,
  Calendar,
  AlertCircle,
  Loader,
  Crown,
  UserCog,
  Clock,
  AtSign,
  Hash
} from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_API_ENDPOINT;

const Admins = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  // Fetch all admins
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/users`);

        const adminsData = response.data.data || response.data.admins || response.data;
        setAdmins(Array.isArray(adminsData) ? adminsData : []);

        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch admins:', error);
        setError(error.response?.data?.message || 'Failed to load admins');
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  // Filter admins
  const filteredAdmins = admins.filter(admin =>
    admin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle delete
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name}?`)) return;

    try {
      await axios.delete(`${API_URL}/users/${id}`);
      setAdmins(admins.filter(admin => (admin._id || admin.id) !== id));
      alert('Admin deleted successfully!');
    } catch (error) {
      console.error('Failed to delete admin:', error);
      alert(error.response?.data?.message || 'Failed to delete admin');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get role badge color
  const getRoleBadge = (role) => {
    switch (role) {
      case 'superadmin':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'admin':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Get role icon
  const getRoleIcon = (role) => {
    switch (role) {
      case 'superadmin':
        return <Crown size={14} className="text-purple-600" />;
      case 'admin':
        return <UserCog size={14} className="text-blue-600" />;
      default:
        return <User size={14} className="text-gray-600" />;
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
      <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
        <AlertCircle size={48} className="mx-auto text-red-300 mb-3" />
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admins</h1>
          <p className="text-gray-500 text-sm mt-1">Manage system administrators</p>
        </div>
        <button
          onClick={() => navigate('/admins/new')}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={18} />
          <span>Add New Admin</span>
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Total Admins</p>
          <p className="text-2xl font-bold text-gray-800">{admins.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Super Admins</p>
          <p className="text-2xl font-bold text-purple-600">
            {admins.filter(a => a.role === 'superadmin').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Regular Admins</p>
          <p className="text-2xl font-bold text-blue-600">
            {admins.filter(a => a.role === 'admin').length}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search admins by name, email, or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Admins Grid */}
      {filteredAdmins.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <Shield size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg mb-2">No admins found</p>
          <p className="text-gray-400 text-sm mb-6">
            {searchTerm ? 'Try different search terms' : 'Get started by adding your first admin'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => navigate('/admins/new')}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Admin
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAdmins.map((admin) => (
            <div
              key={admin._id || admin.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group"
            >
              {/* Header with linear background */}
              <div className={`p-5 ${admin.role === 'superadmin'
                ? 'bg-linear-to-r from-purple-50 to-pink-50'
                : 'bg-linear-to-r from-blue-50 to-cyan-50'
                } border-b border-gray-100`}>
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="shrink-0">
                    {admin.avatar ? (
                      <img
                        src={admin.avatar}
                        alt={admin.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                    ) : (
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 border-white shadow-sm ${admin.role === 'superadmin'
                        ? 'bg-linear-to-br from-purple-500 to-pink-500'
                        : 'bg-linear-to-br from-blue-500 to-cyan-500'
                        }`}>
                        <span className="text-white font-bold text-xl">
                          {admin.name?.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Basic Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 truncate text-lg">
                      {admin.name}
                    </h3>

                    {/* Role Badge */}
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border mt-1 ${getRoleBadge(admin.role)}`}>
                      {getRoleIcon(admin.role)}
                      {admin.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Details Section */}
              <div className="p-5 space-y-3">
                {/* Email */}
                <div className="flex items-center gap-2 text-sm">
                  <Mail size={14} className="text-gray-400 shrink-0" />
                  <a href={`mailto:${admin.email}`} className="text-gray-600 hover:text-blue-600 truncate">
                    {admin.email}
                  </a>
                </div>

                {/* Created At */}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={14} className="text-gray-400 shrink-0" />
                  <span className="text-gray-600">
                    Joined {formatDate(admin.createdAt)}
                  </span>
                </div>

                {/* Created By - Only show if not null */}
                {admin.createdBy && (
                  <div className="flex items-center gap-2 text-sm">
                    <User size={14} className="text-gray-400 shrink-0" />
                    <span className="text-gray-600">
                      Created by: <span className="font-medium text-gray-700">
                        {admin.createdBy || 'Super Admin'}
                      </span>
                    </span>
                    {admin.createdBy.avatar && (
                      <img
                        src={admin.createdBy.avatar}
                        alt={admin.createdBy.name}
                        className="w-5 h-5 rounded-full ml-1"
                      />
                    )}
                  </div>
                )}

                {/* Admin ID (for reference) */}
                <div className="flex items-center gap-2 text-xs text-gray-400 pt-1">
                  <Hash size={12} />
                  <span className="font-mono">ID: {(admin._id || admin.id).slice(-8)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2">
                <button
                  onClick={() => navigate(`/admins/edit/${admin._id || admin.id}`)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <Edit size={14} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(admin._id || admin.id, admin.name)}
                  disabled={admin.role === 'superadmin' && filteredAdmins.filter(a => a.role === 'superadmin').length === 1}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title={admin.role === 'superadmin' && filteredAdmins.filter(a => a.role === 'superadmin').length === 1 ? 'Cannot delete the last super admin' : ''}
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admins;