// pages/EditTeacher.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader } from 'lucide-react';
import TeacherForm from '../../components/forms/TeacherForm';

const API_URL = 'http://localhost:3000/api';

const EditTeacher = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teacherData, setTeacherData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);

  // Fetch courses for dropdown
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${API_URL}/courses/all`);
        const coursesData = response.data.data || response.data.courses || response.data;
        setCourses(Array.isArray(coursesData) ? coursesData : []);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      }
    };
    fetchCourses();
  }, []);

  // Fetch teacher data
  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/teachers/${id}`);


        // Extract teacher data properly
        let teacher;

        if (response.data?.data?.teacher) {
          teacher = response.data.data.teacher;
        } else if (response.data?.data) {
          teacher = response.data.data;
        } else if (response.data?.teacher) {
          teacher = response.data.teacher;
        } else {
          teacher = response.data;
        }


        // Extract course IDs from courseId array (your model field)
        let courseIds = [];
        if (teacher.courseId && Array.isArray(teacher.courseId)) {
          courseIds = teacher.courseId.map(c => c._id || c);
        }

        setTeacherData({
          id: teacher._id || teacher.id,
          name: teacher.name || '',
          email: teacher.email || '',
          phone: teacher.phone || '',
          address: teacher.address || '',
          post: teacher.post || '',
          avatar: teacher.avatar || '',
          courseId: courseIds, // Your model uses courseId
          courses: teacher.courses || teacher.courseId || [] // Store for reference
        });

        setLoading(false);
      } catch (error) {
        console.error('❌ Failed to fetch teacher:', error);
        setError(error.response?.data?.message || 'Failed to load teacher');
        setLoading(false);
      }
    };

    if (id) {
      fetchTeacher();
    }
  }, [id]);

  // Handle form submission
  const handleSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      // Prepare data for backend - matches your model exactly
      const apiData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        post: formData.post,
        avatar: formData.avatar, // Your model uses 'avatar'
        courseId: formData.courseId // Your model uses 'courseId' array
      };


      await axios.put(`${API_URL}/teachers/${id}`, apiData);


      alert('Teacher updated successfully!');
      navigate('/teachers');

    } catch (error) {
      console.error('❌ Error updating teacher:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update teacher. Please try again.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (window.confirm('Any unsaved changes will be lost. Continue?')) {
      navigate('/teachers');
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
            onClick={() => navigate('/teachers')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Teachers
          </button>
        </div>
      </div>
    );
  }

  return (
    <TeacherForm
      mode="edit"
      initialData={teacherData}
      courses={courses}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isSubmitting={isSubmitting}
    />
  );
};

export default EditTeacher;