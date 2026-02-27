// pages/CreateCourse.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CourseForm from '../../components/forms/courseForm';

const API_URL = 'http://localhost:3000/api';

const CreateCourse = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teachers, setTeachers] = useState([]);

  // Fetch teachers for dropdown
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(`${API_URL}/teachers`);
        const teachersData = response.data.data || response.data;
        setTeachers(Array.isArray(teachersData) ? teachersData : []);
      } catch (error) {
        console.error('Failed to fetch teachers:', error);
      }
    };
    fetchTeachers();
  }, []);

  // Handle form submission
  const handleSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      // Convert imageUrl to imageURL for backend
      const apiData = {
        title: formData.title,
        description: formData.description,
        imageURL: formData.imageUrl,
        teacher: formData.teacher
      };

      await axios.post(`${API_URL}/courses`, apiData);

      alert('Course created successfully!');
      navigate('/courses');

    } catch (error) {
      console.error('Error creating course:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create course. Please try again.';
      alert(errorMessage);
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

  return (
    <CourseForm
      mode="create"
      teachers={teachers}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isSubmitting={isSubmitting}
    />
  );
};

export default CreateCourse;