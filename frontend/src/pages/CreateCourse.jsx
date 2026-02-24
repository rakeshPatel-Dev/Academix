// pages/AddCourse.jsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  User,
  Image,
  FileText,
  ArrowLeft,
  Save,
  XCircle
} from 'lucide-react';

const AddCourse = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

  // React Hook Form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      imageUrl: '',
      teacherId: ''
    }
  });

  // Watch image URL for preview
  const watchImageUrl = watch('imageUrl');

  // Update preview when image URL changes
  useEffect(() => {
    if (watchImageUrl) {
      setImagePreview(watchImageUrl);
    } else {
      setImagePreview(null);
    }
  }, [watchImageUrl]);

  // Fetch teachers for dropdown - Replace with actual API call
  useEffect(() => {
    // Mock teacher data
    setTimeout(() => {
      setTeachers([
        { id: 1, name: 'Dr. Sarah Wilson', post: 'Professor' },
        { id: 2, name: 'Prof. James Brown', post: 'Associate Professor' },
        { id: 3, name: 'Prof. Emily Davis', post: 'Professor' },
        { id: 4, name: 'Dr. Michael Chen', post: 'Assistant Professor' },
        { id: 5, name: 'Prof. Robert Anderson', post: 'Professor' },
        { id: 6, name: 'Dr. Lisa White', post: 'Associate Professor' },
        { id: 7, name: 'Dr. Maria Garcia', post: 'Assistant Professor' },
        { id: 8, name: 'Prof. David Lee', post: 'Professor' }
      ]);
    }, 500);
  }, []);

  // Form submission handler
  const onSubmit = async (data) => {
    setLoading(true);

    try {
      // Simulate API call
      console.log('Form data:', data);

      // Show success message
      alert('Course created successfully!');

      // Redirect to courses page
      navigate('/courses');

    } catch (error) {
      console.error('Error creating course:', error);
      alert('Failed to create course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (window.confirm('Are you sure? Any unsaved changes will be lost.')) {
      navigate('/courses');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/courses')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Add New Course</h1>
          <p className="text-gray-500 text-sm mt-1">Fill in the details to create a new course</p>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="space-y-6">
          {/* Course Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Title <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BookOpen size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                {...register('title', {
                  required: 'Course title is required',
                  minLength: {
                    value: 3,
                    message: 'Title must be at least 3 characters'
                  },
                  maxLength: {
                    value: 100,
                    message: 'Title cannot exceed 100 characters'
                  }
                })}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-500' : 'border-gray-200'
                  }`}
                placeholder="e.g., Mathematics 101"
              />
            </div>
            {errors.title && (
              <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none">
                <FileText size={18} className="text-gray-400" />
              </div>
              <textarea
                {...register('description', {
                  required: 'Description is required',
                  minLength: {
                    value: 10,
                    message: 'Description must be at least 10 characters'
                  },
                  maxLength: {
                    value: 500,
                    message: 'Description cannot exceed 500 characters'
                  }
                })}
                rows="4"
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-200'
                  }`}
                placeholder="Describe what students will learn in this course..."
              />
            </div>
            {errors.description && (
              <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Image size={18} className="text-gray-400" />
              </div>
              <input
                type="url"
                {...register('imageUrl', {
                  pattern: {
                    value: /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|svg))?$/i,
                    message: 'Please enter a valid image URL'
                  }
                })}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.imageUrl ? 'border-red-500' : 'border-gray-200'
                  }`}
                placeholder="https://example.com/course-image.jpg (optional)"
              />
            </div>
            {errors.imageUrl && (
              <p className="mt-1 text-xs text-red-500">{errors.imageUrl.message}</p>
            )}

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-1">Preview:</p>
                <img
                  src={imagePreview}
                  alt="Course preview"
                  className="w-32 h-20 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/400x200/e2e8f0/64748b?text=Invalid+Image';
                  }}
                />
              </div>
            )}
          </div>

          {/* Assign Teacher */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assign Teacher <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-gray-400" />
              </div>
              <select
                {...register('teacherId', {
                  required: 'Please select a teacher'
                })}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white ${errors.teacherId ? 'border-red-500' : 'border-gray-200'
                  }`}
              >
                <option value="">Select a teacher...</option>
                {teachers.map(teacher => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name} - {teacher.post}
                  </option>
                ))}
              </select>
            </div>
            {errors.teacherId && (
              <p className="mt-1 text-xs text-red-500">{errors.teacherId.message}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Create Course</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <XCircle size={18} />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      </form>

      {/* Helpful Tips */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-100">
        <h3 className="text-sm font-medium text-blue-800 mb-2">💡 Tips for adding a course:</h3>
        <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
          <li>Course title should be clear and descriptive</li>
          <li>Include key learning outcomes in the description</li>
          <li>Use a high-quality image (recommended size: 400x200px)</li>
          <li>Assign a qualified teacher to the course</li>
        </ul>
      </div>
    </div>
  );
};

export default AddCourse;