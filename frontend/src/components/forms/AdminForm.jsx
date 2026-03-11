// components/forms/AdminForm.jsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  User,
  Mail,
  Lock,
  Image,
  Crown,
  UserCog,
  ArrowLeft,
  Save,
  XCircle,
  Loader,
  Eye,
  EyeOff
} from 'lucide-react';

const AdminForm = ({
  mode = 'create',
  initialData = {},
  onSubmit,
  onCancel,
  isSubmitting = false
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // React Hook Form
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      avatar: '',
      role: 'admin' // ✅ Default role set here
    }
  });

  // Watch avatar URL for preview
  const watchAvatar = watch('avatar');

  // Update preview when avatar URL changes
  useEffect(() => {
    if (watchAvatar) {
      setAvatarPreview(watchAvatar);
    } else {
      setAvatarPreview(null);
    }
  }, [watchAvatar]);

  // Load initial data when it changes (for edit mode)
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      reset({
        name: initialData.name || '',
        email: initialData.email || '',
        avatar: initialData.avatar || '',
        role: initialData.role || 'admin', // ✅ Preserve existing role
      });
    }
  }, [initialData, reset]);

  // Handle form submission
  const onFormSubmit = (data) => {
    // Remove confirmPassword from data
    const { confirmPassword, ...formData } = data;

    // Only include password if it's provided
    if (!formData.password) {
      delete formData.password;
    }

    console.log('📤 Admin form submitting:', formData);
    onSubmit(formData);
  };

  // Password validation
  const validatePassword = (value) => {
    if (mode === 'create' && !value) {
      return 'Password is required';
    }
    if (value && value.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return true;
  };

  // Role options
  const roleOptions = [
    { value: 'admin', label: 'Admin', icon: UserCog, color: 'blue' },
    { value: 'superadmin', label: 'Super Admin', icon: Crown, color: 'purple' }
  ];

  // Watch role value to avoid memoization issues
  const selectedRole = watch('role');

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          type="button"
          disabled={isSubmitting}
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {mode === 'edit' ? 'Edit Admin' : 'Create New Admin'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {mode === 'edit'
              ? 'Update admin information below'
              : 'Fill in the details to create a new administrator'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onFormSubmit)} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">

        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              {...register('name', {
                required: 'Name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters'
                },
                maxLength: {
                  value: 50,
                  message: 'Name cannot exceed 50 characters'
                }
              })}
              className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-200'
                }`}
              placeholder="e.g., John Admin"
              disabled={isSubmitting}
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail size={18} className="text-gray-400" />
            </div>
            <input
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                  message: 'Please enter a valid email address'
                }
              })}
              className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-200'
                }`}
              placeholder="admin@academix.edu"
              disabled={isSubmitting}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* ✅ ROLE SELECTION - This now works! */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {roleOptions.map((option) => {
              const Icon = option.icon;
              return (
                <label
                  key={option.value}
                  className={`relative flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${watch('role') === option.value
                      ? option.value === 'superadmin'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                    }`}
                >
                  <input
                    type="radio"
                    value={option.value}
                    {...register('role', { required: 'Please select a role' })}
                    className="sr-only"
                  />
                  <Icon size={20} className={option.value === 'superadmin' ? 'text-purple-600' : 'text-blue-600'} />
                  <span className={`text-sm font-medium ${watch('role') === option.value
                      ? option.value === 'superadmin' ? 'text-purple-700' : 'text-blue-700'
                      : 'text-gray-700'
                    }`}>
                    {option.label}
                  </span>
                  {watch('role') === option.value && (
                    <div className={`absolute right-3 w-2 h-2 rounded-full ${option.value === 'superadmin' ? 'bg-purple-500' : 'bg-blue-500'
                      }`} />
                  )}
                </label>
              );
            })}
          </div>
          {errors.role && (
            <p className="mt-1 text-xs text-red-500">{errors.role.message}</p>
          )}
        </div>

        {/* 🗑️ HIDDEN INPUT REMOVED - This was the problem! */}

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password {mode === 'create' && <span className="text-red-500">*</span>}
            {mode === 'edit' && <span className="text-gray-400 text-xs ml-1">(leave blank to keep current)</span>}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock size={18} className="text-gray-400" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password', {
                validate: validatePassword,
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              className={`w-full pl-10 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-200'
                }`}
              placeholder={mode === 'create' ? 'Enter password' : 'Enter new password (optional)'}
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff size={18} className="text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye size={18} className="text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password - Only for create mode */}
        {mode === 'create' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value, { password }) =>
                    value === password || 'Passwords do not match'
                })}
                className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                  }`}
                placeholder="Re-enter password"
                disabled={isSubmitting}
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>
        )}

        {/* Avatar URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Avatar URL <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Image size={18} className="text-gray-400" />
            </div>
            <input
              type="url"
              {...register('avatar')}
              className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/avatar.jpg"
              disabled={isSubmitting}
            />
          </div>

          {/* Avatar Preview */}
          {avatarPreview && (
            <div className="mt-3 flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <img
                src={avatarPreview}
                alt="Avatar preview"
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/100/2563eb/ffffff?text=Error';
                }}
              />
              <div className="flex-1">
                <p className="text-xs text-gray-500">Preview</p>
                <p className="text-xs text-gray-700 truncate">{avatarPreview}</p>
              </div>
              {!isSubmitting && (
                <button
                  type="button"
                  onClick={() => {
                    setAvatarPreview(null);
                    setValue('avatar', '');
                  }}
                  className="text-red-500 hover:text-red-700 text-xs"
                >
                  Remove
                </button>
              )}
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          >
            {isSubmitting ? (
              <>
                <Loader size={18} className="animate-spin" />
                <span>{mode === 'edit' ? 'Updating...' : 'Creating...'}</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>{mode === 'edit' ? 'Update Admin' : 'Create Admin'}</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <XCircle size={18} />
            <span>Cancel</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminForm;