// pages/EditStudent.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader } from 'lucide-react';
import StudentForm from '../../components/forms/StudentForm';

const API_URL = 'http://localhost:3000/api';

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);

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
          console.error('Fallback fetch failed:', fallbackError);
        }
      }
    };
    fetchCourses();
  }, []);

  // Fetch student data
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/students/${id}`);

        console.log('🔍 Full API Response:', response.data);

        // Extract student data properly
        let student;

        if (response.data?.data?.student) {
          student = response.data.data.student;
        } else if (response.data?.data) {
          student = response.data.data;
        } else if (response.data?.student) {
          student = response.data.student;
        } else {
          student = response.data;
        }

        console.log('📦 Extracted Student:', student);

        // Extract course IDs from courses array
        let courseIds = [];
        if (student.courses && Array.isArray(student.courses)) {
          courseIds = student.courses.map(c => c._id || c);
        }

        setStudentData({
          id: student._id || student.id,
          name: student.name || '',
          email: student.email || '',
          phone: student.phone || '',
          address: student.address || '',
          shift: student.shift || 'morning',
          avatar: student.avatar || student.imageURL || student.imageUrl || '', // Make sure avatar is included
          courses: courseIds,
          coursesData: student.courses || []
        });

        setLoading(false);
      } catch (error) {
        console.error('❌ Failed to fetch student:', error);
        setError(error.response?.data?.message || 'Failed to load student');
        setLoading(false);
      }
    };

    if (id) {
      fetchStudent();
    }
  }, [id]);

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

      console.log('📤 Updating student:', apiData);

      const response = await axios.put(`${API_URL}/students/${id}`, apiData);

      console.log('📥 Update response:', response.data);

      alert('Student updated successfully!');
      navigate('/students');

    } catch (error) {
      console.error('❌ Error updating student:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update student. Please try again.';
      alert(errorMessage);
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
            onClick={() => navigate('/students')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Students
          </button>
        </div>
      </div>
    );
  }

  return (
    <StudentForm
      mode="edit"
      initialData={studentData}
      courses={courses}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isSubmitting={isSubmitting}
    />
  );
};

export default EditStudent;