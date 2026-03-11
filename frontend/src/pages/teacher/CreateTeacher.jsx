// pages/CreateTeacher.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TeacherForm from '../../components/forms/TeacherForm';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:3000/api';

const CreateTeacher = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courses, setCourses] = useState([]);

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

  // Handle form submission
  const handleSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      // Prepare data for backend
      const apiData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        post: formData.post,
        avatar: formData.avatar,
        courses: formData.courseIds // Array of course IDs
      };

      console.log('📤 Creating teacher:', apiData);

      const response = await axios.post(`${API_URL}/teachers`, apiData);

      console.log('📥 Create response:', response.data);

      toast.success('Teacher created successfully!');
      navigate('/teachers');

    } catch (error) {
      console.error('❌ Error creating teacher:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create teacher. Please try again.';
      toast.error(errorMessage);
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

  return (
    <TeacherForm
      mode="create"
      courses={courses}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isSubmitting={isSubmitting}
    />
  );
};

export default CreateTeacher;