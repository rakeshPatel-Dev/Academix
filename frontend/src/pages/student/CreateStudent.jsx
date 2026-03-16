// pages/CreateStudent.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StudentForm from '../../components/forms/StudentForm';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_BACKEND_API_ENDPOINT;

const CreateStudent = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courses, setCourses] = useState([]);

  // Fetch all courses for dropdown
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${API_URL}/courses/all`);
        const coursesData = response.data.data || response.data.courses || response.data;
        setCourses(Array.isArray(coursesData) ? coursesData : []);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        try {
          const fallbackResponse = await axios.get(`${API_URL}/courses`, {
            params: { limit: 100 }
          });
          const fallbackData = fallbackResponse.data.data || fallbackResponse.data;
          setCourses(Array.isArray(fallbackData) ? fallbackData : []);
        } catch (fallbackError) {
          console.error('Fallback fetch also failed:', fallbackError);
        }
      }
    };
    fetchCourses();
  }, []);

  // Handle form submission
  const handleSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      // Prepare data for backend - INCLUDES AVATAR
      const apiData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        shift: formData.shift,
        avatar: formData.avatar, // Make sure avatar is included
        courses: formData.courses
      };

      console.log('📤 Creating student:', apiData);

      const response = await axios.post(`${API_URL}/students`, apiData);

      console.log('📥 Create response:', response.data);

      toast.success('Student created successfully!');
      navigate('/students');

    } catch (error) {
      console.error('❌ Error creating student:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create student. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (window.confirm('Any unsaved changes will be lost. Continue?')) {
      navigate('/students');
    }
  };

  return (
    <StudentForm
      mode="create"
      courses={courses}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isSubmitting={isSubmitting}
    />
  );
};

export default CreateStudent;