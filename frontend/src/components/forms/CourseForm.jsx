// components/forms/courseForm.jsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  BookOpen,
  FileText,
  Image,
  Users,
  ArrowLeft,
  Save,
  XCircle,
  Loader
} from 'lucide-react';

const CourseForm = ({
  mode = 'create',
  initialData = {},
  teachers = [],
  onSubmit,
  onCancel,
  isSubmitting = false
}) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedTeachers, setSelectedTeachers] = useState([]);

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
      title: '',
      description: '',
      imageUrl: '',
      teacherIds: []
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

  // Load initial data when it changes
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      console.log('📥 Form loading initial data:', initialData);

      // Reset form with initial data
      reset({
        title: initialData.title || '',
        description: initialData.description || '',
        imageUrl: initialData.imageUrl || '',
        teacherIds: initialData.teacherIds || []
      });

      // Set selected teachers for UI
      setSelectedTeachers(initialData.teacherIds || []);
    }
  }, [initialData, reset]);

  // Handle teacher selection
  const handleTeacherSelect = (teacherId) => {
    setSelectedTeachers(prev => {
      if (prev.includes(teacherId)) {
        return prev.filter(id => id !== teacherId);
      } else {
        return [...prev, teacherId];
      }
    });

    // Update form value
    const newSelection = selectedTeachers.includes(teacherId)
      ? selectedTeachers.filter(id => id !== teacherId)
      : [...selectedTeachers, teacherId];

    setValue('teacherIds', newSelection);
  };

  // Handle form submission
  const onFormSubmit = (data) => {
    // Prepare data for parent component
    const formData = {
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl || null,
      teacherIds: selectedTeachers
    };

    console.log('📤 Form submitting:', formData);
    onSubmit(formData);
  };

  return (
    <div className="max-w-3xl mx-auto">
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
            {mode === 'edit' ? 'Edit Course' : 'Create New Course'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {mode === 'edit'
              ? 'Update the course information below'
              : 'Fill in the details to create a new course'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onFormSubmit)} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">

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
                }
              })}
              className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-500' : 'border-gray-200'
                }`}
              placeholder="e.g., Mathematics 101"
              disabled={isSubmitting}
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
                }
              })}
              rows="4"
              className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-200'
                }`}
              placeholder="Describe what students will learn in this course..."
              disabled={isSubmitting}
            />
          </div>
          {errors.description && (
            <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
          )}
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Course Image URL
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Image size={18} className="text-gray-400" />
            </div>
            <input
              type="url"
              {...register('imageUrl')}
              className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/course-image.jpg"
              disabled={isSubmitting}
            />
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="mt-3 flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <img
                src={imagePreview}
                alt="Course preview"
                className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/400x200/e2e8f0/64748b?text=Invalid+Image';
                }}
              />
              <div className="flex-1">
                <p className="text-xs text-gray-500">Preview</p>
              </div>
              {!isSubmitting && (
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setValue('imageUrl', '');
                  }}
                  className="text-red-500 hover:text-red-700 text-xs"
                >
                  Remove
                </button>
              )}
            </div>
          )}
        </div>

        {/* Teacher Assignment - Multiple Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assign Teachers
          </label>

          <div className="relative">
            {/* Header with icon and selected count */}
            <div className="flex items-center gap-2 mb-2">
              <Users size={16} className="text-blue-500" />
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                Faculty Members
              </span>
              {selectedTeachers.length > 0 && (
                <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                  {selectedTeachers.length} selected
                </span>
              )}
            </div>

            {/* Teachers List Container */}
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-400 transition-all duration-200">
              {teachers.length > 0 ? (
                <div className="max-h-56 overflow-y-auto divide-y divide-gray-100">
                  {teachers.map((teacher) => {
                    const teacherId = teacher._id || teacher.id;
                    const isChecked = selectedTeachers.includes(teacherId);

                    return (
                      <label
                        key={teacherId}
                        className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-150 group
                  ${isChecked
                            ? "bg-blue-50 hover:bg-blue-100"
                            : "bg-white hover:bg-gray-50"
                          }
                  ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
                `}
                      >
                        {/* Avatar */}
                        <div className="relative shrink-0">
                          <div className={`w-10 h-10 rounded-full overflow-hidden border-2 flex items-center justify-center shadow-sm transition-all duration-200
                    ${isChecked
                              ? "border-blue-500 ring-2 ring-blue-200 scale-110"
                              : "border-gray-200 group-hover:border-blue-300"
                            }
                  `}>
                            {teacher.avatar ? (
                              <img
                                src={teacher.avatar}
                                alt={teacher.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-linear-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                                <span className="text-xs font-bold text-white">
                                  {teacher.name
                                    .split(" ")
                                    .map((n) => n)
                                    .join("")
                                    .toUpperCase()
                                    .slice(0, 2)}
                                </span>
                              </div>
                            )}
                          </div>
                          {/* Checked indicator on avatar */}
                          {isChecked && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center shadow-md">
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Teacher Info */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold truncate transition-colors duration-150
                    ${isChecked ? "text-blue-700" : "text-gray-800 group-hover:text-gray-900"}
                  `}>
                            {teacher.name}
                          </p>
                          {teacher.post && (
                            <p className="text-xs text-gray-500 truncate mt-0.5">
                              {teacher.post}
                            </p>
                          )}
                        </div>

                        {/* Custom Checkbox */}
                        <div className="flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleTeacherSelect(teacherId)}
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
                    <Users size={18} className="text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-400 italic">No teachers available</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer hint */}
          <p className="mt-1.5 text-xs text-gray-400">
            Select multiple teachers or leave empty
          </p>
        </div>

        {/* Form Actions */}
        <div div className="flex gap-3 pt-4 border-t border-gray-100">
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
                <span>{mode === 'edit' ? 'Update Course' : 'Create Course'}</span>
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

export default CourseForm;