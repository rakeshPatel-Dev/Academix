// components/forms/TeacherForm.jsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  BookOpen,
  Image,
  ArrowLeft,
  Save,
  XCircle,
  Loader
} from 'lucide-react';

const TeacherForm = ({
  mode = 'create',
  initialData = {},
  courses = [],
  onSubmit,
  onCancel,
  isSubmitting = false
}) => {
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [selectedCourses, setSelectedCourses] = useState([]);

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
      phone: '',
      address: '',
      post: '',
      avatar: '',
      courseId: [] // ✅ Matches your model field name
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

  // Load initial data when it changes
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {

      // Extract course IDs from initial data - your model uses courseId array
      let courseIds = [];
      if (initialData.courseId && Array.isArray(initialData.courseId)) {
        courseIds = initialData.courseId.map(c => c._id || c);
      } else if (initialData.courseId) {
        courseIds = initialData.courseId;
      }

      // Reset form with initial data
      reset({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        address: initialData.address || '',
        post: initialData.post || '',
        avatar: initialData.avatar || '',
        courseId: courseIds
      });

      // Set selected courses for UI
      setSelectedCourses(courseIds);
    }
  }, [initialData, reset]);

  // Handle course selection
  const handleCourseSelect = (courseId) => {
    setSelectedCourses(prev => {
      if (prev.includes(courseId)) {
        return prev.filter(id => id !== courseId);
      } else {
        return [...prev, courseId];
      }
    });

    // Update form value
    const newSelection = selectedCourses.includes(courseId)
      ? selectedCourses.filter(id => id !== courseId)
      : [...selectedCourses, courseId];

    setValue('courseId', newSelection); // ✅ Using courseId field name
  };

  // Post options for dropdown
  const postOptions = [
    'Professor',
    'Associate Professor',
    'Assistant Professor',
    'Lecturer',
    'Senior Lecturer',
    'Head of Department'
  ];

  // Handle form submission
  const onFormSubmit = (data) => {
    // Prepare data for parent component - using courseId to match your model
    const formData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address || null,
      post: data.post,
      avatar: data.avatar || null,
      courseId: selectedCourses // ✅ This matches your model field name
    };

    onSubmit(formData);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
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
            {mode === 'edit' ? 'Edit Teacher' : 'Add New Teacher'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {mode === 'edit'
              ? 'Update teacher information below'
              : 'Fill in the details to add a new teacher'}
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
                }
              })}
              className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-200'
                }`}
              placeholder="e.g., Dr. Sarah Wilson"
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
              placeholder="sarah.wilson@academix.edu"
              disabled={isSubmitting}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Phone Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone size={18} className="text-gray-400" />
            </div>
            <input
              type="tel"
              {...register('phone', {
                required: 'Phone number is required',
                pattern: {
                  value: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/,
                  message: 'Please enter a valid phone number'
                }
              })}
              className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-200'
                }`}
              placeholder="+1 (555) 123-4567"
              disabled={isSubmitting}
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
          )}
        </div>

        {/* Avatar URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Avatar URL
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

        {/* Address Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3 pointer-events-none">
              <MapPin size={18} className="text-gray-400" />
            </div>
            <textarea
              {...register('address')}
              rows="2"
              className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="123 University Ave, Boston, MA 02115"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Post Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Post/Designation <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Briefcase size={18} className="text-gray-400" />
            </div>
            <select
              {...register('post', { required: 'Please select a post' })}
              className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white ${errors.post ? 'border-red-500' : 'border-gray-200'
                }`}
              disabled={isSubmitting}
            >
              <option value="">Select a post...</option>
              {postOptions.map((post) => (
                <option key={post} value={post}>
                  {post}
                </option>
              ))}
            </select>
          </div>
          {errors.post && (
            <p className="mt-1 text-xs text-red-500">{errors.post.message}</p>
          )}
        </div>

        {/* Course Assignment - Multiple Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assign Courses{" "}
            <span className="text-gray-400 text-xs">(optional)</span>
          </label>

          <div className="relative">
            {/* Header Icon */}
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={16} className="text-blue-500" />
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                Available Courses
              </span>
              {selectedCourses.length > 0 && (
                <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                  {selectedCourses.length} selected
                </span>
              )}
            </div>

            {/* Course List Container */}
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-400 transition-all duration-200">
              {courses.length > 0 ? (
                <div className="max-h-56 overflow-y-auto divide-y divide-gray-100">
                  {courses.map((course) => {
                    const courseId = course._id || course.id;
                    const isChecked = selectedCourses.includes(courseId);

                    return (
                      <label
                        key={courseId}
                        className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-150 group
                  ${isChecked
                            ? "bg-blue-50 hover:bg-blue-100"
                            : "bg-white hover:bg-gray-50"
                          }
                  ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
                `}
                      >
                        {/* Course Thumbnail */}
                        <div className="relative flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                          {course.imageURL ? (
                            <img
                              src={course.imageURL}
                              alt={course.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                              <BookOpen size={16} className="text-white" />
                            </div>
                          )}
                          {/* Checked overlay on image */}
                          {isChecked && (
                            <div className="absolute inset-0 bg-blue-600/30 flex items-center justify-center">
                              <svg className="w-4 h-4 text-white drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Course Info */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate transition-colors duration-150
                    ${isChecked ? "text-blue-700" : "text-gray-800 group-hover:text-gray-900"}
                  `}>
                            {course.title}
                          </p>
                          {course.category && (
                            <p className="text-xs text-gray-400 truncate mt-0.5">
                              {course.category}
                            </p>
                          )}
                        </div>

                        {/* Custom Checkbox */}
                        <div className="flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleCourseSelect(courseId)}
                            className="sr-only"
                            disabled={isSubmitting}
                          />
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 shadow-sm
                    ${isChecked
                              ? "bg-blue-600 border-blue-600 scale-110"
                              : "bg-white border-gray-300 group-hover:border-blue-400"
                            }
                  `}>
                            {isChecked && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 px-4 bg-gray-50">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                    <BookOpen size={18} className="text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-400 italic">No courses available</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer hint */}
          <p className="mt-1.5 text-xs text-gray-400">
            Select multiple courses or leave empty
          </p>
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
                <span>{mode === 'edit' ? 'Update Teacher' : 'Create Teacher'}</span>
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

export default TeacherForm;