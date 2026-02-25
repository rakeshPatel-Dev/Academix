// pages/EditCourse.jsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import {
  BookOpen,
  User,
  Image,
  FileText,
  ArrowLeft,
  Save,
  XCircle
} from 'lucide-react';
import axios from 'axios';

const EditCourse = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // React Hook Form
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm();

  // Watch image URL for preview
  const watchimageURL = watch('imageURL');

  // Update preview when image URL changes
  useEffect(() => {
    if (watchimageURL) {
      setImagePreview(watchimageURL);
    } else {
      setImagePreview(null);
    }
  }, [watchimageURL]);

  // Fetch teachers for dropdown
  // useEffect(() => {
  //   const fetchTeachers = async () => {
  //     try {
  //       const response = await axios.get('http://localhost:3000/api/teachers');
  //       // Adjust based on your API response structure
  //       const teachersData = response.data.data || response.data;
  //       setTeachers(Array.isArray(teachersData) ? teachersData : []);
  //     } catch (error) {
  //       console.error("Failed to fetch teachers:", error);
  //       setTeachers([]);
  //     }
  //   };

  //   fetchTeachers();
  // }, []);

  // Fetch course data
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setFetchError(null);

        const response = await axios.get(`http://localhost:3000/api/courses/${id}`);

        // Extract course data based on your API structure
        const courseData = response.data.data.course;

        // Reset form with course data
        reset({
          title: courseData.title || '',
          description: courseData.description || '',
          imageURL: courseData.imageURL || courseData.imageURL || '',
        });

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch course:", error);
        setFetchError(error.response?.data?.message || "Failed to load course");
        setLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id, reset]);

  // Form submission handler
  const onSubmit = async (data) => {
    setSaving(true);

    try {
      // Remove empty values
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([v]) => v !== '')
      );

      await axios.put(`http://localhost:3000/api/courses/${id}`, cleanData);

      // Show success message
      alert('Course updated successfully!');

      // Redirect to courses page
      navigate('/courses');

    } catch (error) {
      console.error('Error updating course:', error);
      alert(error.response?.data?.message || 'Failed to update course. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (window.confirm('Are you sure? Any unsaved changes will be lost.')) {
      navigate('/courses');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <p className="text-red-600 mb-4">{fetchError}</p>
        <button
          onClick={() => navigate('/courses')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/courses')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          type="button"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Edit Course</h1>
          <p className="text-gray-500 text-sm mt-1">Update the course information</p>
        </div>
      </div>

      {/* Edit Form */}
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
                placeholder="Describe what students will learn..."
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
                {...register('imageURL')}
                className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg (optional)"
              />
            </div>
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
              Assign Teacher
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-gray-400" />
              </div>
              <select
                {...register('teacherId')}
                className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                <option value="">-- No teacher assigned --</option>
                {teachers.length > 0 ? (
                  teachers.map((teacher) => (
                    <option key={teacher.id || teacher._id} value={teacher.id || teacher._id}>
                      {teacher.name} {teacher.post ? `- ${teacher.post}` : ''}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No teachers available</option>
                )}
              </select>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              You can assign a teacher now or do it later
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Update Course</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <XCircle size={18} />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditCourse;