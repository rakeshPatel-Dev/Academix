// pages/EditCourse.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader } from 'lucide-react';
import CourseForm from '../../components/forms/courseForm';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_BACKEND_API_ENDPOINT;

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courseData, setCourseData] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState(null);

  // Fetch teachers for dropdown
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(`${API_URL}/teachers`);
        const teachersData = response.data.data || response.data.teachers || response.data;
        setTeachers(Array.isArray(teachersData) ? teachersData : []);
      } catch (error) {
        console.error('Failed to fetch teachers:', error);
      }
    };
    fetchTeachers();
  }, []);

  // Fetch course data
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/courses/${id}`);

        console.log('🔍 Full API Response:', response.data);

        // ✅ FIXED: Extract course data properly based on your API structure
        let course;

        // Check different possible response structures
        if (response.data?.data?.course) {
          // Structure: { success: true, data: { course: {...} } }
          course = response.data.data.course;
        } else if (response.data?.data) {
          // Structure: { success: true, data: {...} }
          course = response.data.data;
        } else if (response.data?.course) {
          // Structure: { success: true, course: {...} }
          course = response.data.course;
        } else {
          // Structure: direct course object
          course = response.data;
        }

        console.log('📦 Extracted Course:', course);

        // ✅ FIXED: Handle teacher array properly
        let teacherIds = [];
        if (course.teachers && Array.isArray(course.teachers)) {
          // If teachers is an array of objects
          teacherIds = course.teachers.map(t => t._id || t).filter(id => id);
        } else if (course.teacher && Array.isArray(course.teacher)) {
          // If teacher is an array
          teacherIds = course.teacher.map(t => t._id || t).filter(id => id);
        } else if (course.teacherId) {
          // Single teacher ID
          teacherIds = [course.teacherId];
        } else if (course.teacher?._id) {
          // Single teacher object
          teacherIds = [course.teacher._id];
        }

        setCourseData({
          id: course._id || course.id,
          title: course.title || '',
          description: course.description || '',
          imageUrl: course.imageUrl || course.imageURL || '',
          teacherIds: teacherIds, // ✅ Now properly handles array
          teachers: course.teachers || course.teacher || [] // Store full teacher objects
        });

        console.log('✅ Processed CourseData:', {
          id: course._id || course.id,
          title: course.title,
          teacherIds: teacherIds
        });

        setLoading(false);
      } catch (error) {
        console.error('❌ Failed to fetch course:', error);
        setError(error.response?.data?.message || 'Failed to load course');
        setLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id]);

  // Handle form submission
  const handleSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      // ✅ FIXED: Prepare data for backend
      const apiData = {
        title: formData.title,
        description: formData.description,
        imageURL: formData.imageUrl || null,
        teacher: formData.teacherIds || [] // Send as array
      };

      console.log('📤 Submitting update:', apiData);

      const response = await axios.put(`${API_URL}/courses/${id}`, apiData);

      console.log('📥 Update response:', response.data);

      toast.success('Course updated successfully!');
      navigate('/courses');

    } catch (error) {
      console.error('❌ Error updating course:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update course. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (window.confirm('Any unsaved changes will be lost. Continue?')) {
      navigate('/courses');
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
      <div className="max-w-3xl mx-auto px-4 py-6 text-center">
        <div className="bg-red-50 rounded-lg p-6">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/courses')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <CourseForm
      mode="edit"
      initialData={courseData}
      teachers={teachers}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isSubmitting={isSubmitting}
    />
  );
};

export default EditCourse;