// components/forms/StudentForm.jsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  User,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Clock,
  Image,        // Make sure Image is imported
  ArrowLeft,
  Save,
  XCircle,
  Loader,
  Sun,
  Moon
} from 'lucide-react';

const StudentForm = ({
  mode = 'create',
  initialData = {},
  courses = [],
  onSubmit,
  onCancel,
  isSubmitting = false
}) => {
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [avatarPreview, setAvatarPreview] = useState(null); // Add this state

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
      shift: 'morning',
      avatar: '',      // Make sure avatar is in defaultValues
      courses: []
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
      console.log('📥 Form loading initial student data:', initialData);

      // Extract course IDs from initial data
      let courseIds = [];
      if (initialData.courses && Array.isArray(initialData.courses)) {
        courseIds = initialData.courses.map(c => c._id || c);
      }

      // Reset form with initial data - INCLUDING AVATAR
      reset({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        address: initialData.address || '',
        shift: initialData.shift || 'morning',
        avatar: initialData.avatar || initialData.imageURL || initialData.imageUrl || '', // Add avatar here
        courses: courseIds
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

    setValue('courses', newSelection);
  };

  // Handle form submission
  const onFormSubmit = (data) => {
    // Prepare data for parent component - INCLUDING AVATAR
    const formData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address || null,
      shift: data.shift,
      avatar: data.avatar || null,     // Make sure avatar is included
      courses: selectedCourses
    };

    console.log('📤 Student form submitting:', formData);
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
            {mode === 'edit' ? 'Edit Student' : 'Add New Student'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {mode === 'edit'
              ? 'Update student information below'
              : 'Fill in the details to enroll a new student'}
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
              placeholder="e.g., John Smith"
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
              placeholder="john.smith@student.academix.edu"
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
              placeholder="123 College Ave, Boston, MA 02115"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Shift Field - Modern Premium Radio Buttons */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-4">
            Shift <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4">
            <label className="flex-1 relative cursor-pointer group">
              <input
                type="radio"
                value="morning"
                {...register('shift', { required: 'Please select a shift' })}
                className="sr-only peer"
                disabled={isSubmitting}
              />
              <div className="peer-checked:ring-2 peer-checked:ring-offset-2 peer-checked:ring-amber-500 peer-checked:bg-amber-50 peer-checked:border-amber-300 p-4 rounded-xl border-2 border-gray-200 transition-all duration-200 hover:border-amber-300 hover:shadow-md bg-white">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 group-hover:shadow-lg transition-shadow">
                    <Sun size={20} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Morning Shift</p>
                    <p className="text-xs text-gray-500">6:00 AM - 2:00 PM</p>
                  </div>
                </div>
              </div>
            </label>

            <label className="flex-1 relative cursor-pointer group">
              <input
                type="radio"
                value="evening"
                {...register('shift', { required: 'Please select a shift' })}
                className="sr-only peer"
                disabled={isSubmitting}
              />
              <div className="peer-checked:ring-2 peer-checked:ring-offset-2 peer-checked:ring-indigo-500 peer-checked:bg-indigo-50 peer-checked:border-indigo-300 p-4 rounded-xl border-2 border-gray-200 transition-all duration-200 hover:border-indigo-300 hover:shadow-md bg-white">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-linear-to-br from-indigo-100 to-purple-100 group-hover:shadow-lg transition-shadow">
                    <Moon size={20} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Evening Shift</p>
                    <p className="text-xs text-gray-500">2:00 PM - 10:00 PM</p>
                  </div>
                </div>
              </div>
            </label>
          </div>
          {errors.shift && (
            <p className="mt-3 text-xs font-medium text-red-500 flex items-center gap-1">
              <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
              {errors.shift.message}
            </p>
          )}
        </div>

        {/* Course Selection - Multiple Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Enroll in Courses{" "}
            <span className="text-gray-400 text-xs">(optional)</span>
          </label>

          <div className="relative">
            {/* Header bar */}
            <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-t-xl border-b-0">
              <BookOpen size={16} className="text-blue-500" />
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Available Courses
              </span>
              {selectedCourses.length > 0 && (
                <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                  {selectedCourses.length} selected
                </span>
              )}
            </div>

            {/* Course list */}
            <div className="border border-gray-200 rounded-b-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
              {courses.length > 0 ? (
                <div className="max-h-52 overflow-y-auto divide-y divide-gray-100">
                  {courses.map((course) => {
                    const id = course._id || course.id;
                    const isChecked = selectedCourses.includes(id);

                    return (
                      <label
                        key={id}
                        className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors duration-150
                  ${isChecked
                            ? "bg-blue-50 hover:bg-blue-100"
                            : "bg-white hover:bg-gray-50"
                          }
                  ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
                `}
                      >
                        {/* Custom Checkbox */}
                        <div className="relative shrink-0">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleCourseSelect(id)}
                            className="sr-only"
                            disabled={isSubmitting}
                          />
                          <div
                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200
                      ${isChecked
                                ? "bg-blue-600 border-blue-600 shadow-sm shadow-blue-200"
                                : "bg-white border-gray-300 hover:border-blue-400"
                              }
                    `}
                          >
                            {isChecked && (
                              <svg
                                className="w-3 h-3 text-white"
                                viewBox="0 0 12 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M2 6l3 3 5-5"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </div>
                        </div>

                        {/* Course Info */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {course.imageURL ? (
                            <img
                              src={course.imageURL}
                              alt={course.title}
                              className="w-8 h-8 rounded-lg object-cover shrink-0 shadow-sm"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-400 to-indigo-500 flex items-center justify-center shrink-0 shadow-sm">
                              <BookOpen size={14} className="text-white" />
                            </div>
                          )}
                          <span
                            className={`text-sm font-medium truncate transition-colors duration-150
                      ${isChecked ? "text-blue-700" : "text-gray-700"}
                    `}
                          >
                            {course.title}
                          </span>
                        </div>

                        {/* Checked indicator pill */}
                        {isChecked && (
                          <span className="shrink-0 text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                            ✓ Added
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 bg-white">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                    <BookOpen size={18} className="text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-400 italic">No courses available</p>
                </div>
              )}
            </div>
          </div>

          <p className="mt-1.5 text-xs text-gray-400">
            Select multiple courses or leave empty to enroll later.
          </p>
        </div>

        {/* ===== AVATAR FIELD - ADD THIS SECTION ===== */}
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
              placeholder="https://example.com/student-avatar.jpg"
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
                <span>{mode === 'edit' ? 'Update Student' : 'Create Student'}</span>
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

export default StudentForm;