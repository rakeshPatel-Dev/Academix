// pages/CourseProfile.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Users,
  GraduationCap,
  Calendar,
  ArrowLeft,
  Edit,
  User,
  Loader,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const CourseProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState(null);

  // Fetch course data
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/courses/${id}`);

        // Extract course data
        const courseData = response.data.data || response.data.course || response.data;
        setCourse(courseData);
        setTeachers(courseData.teacher || []);

        setLoading(false);
      } catch (error) {
        console.error('❌ Failed to fetch course:', error);
        setError(error.response?.data?.message || 'Failed to load course profile');
        setLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Failed to Load Course</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/courses')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/courses')}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
          >
            <ArrowLeft size={18} className="text-gray-600" />
            <span className="text-gray-700">Back to Courses</span>
          </button>

          <button
            onClick={() => navigate(`/courses/edit/${course?._id}`)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm"
          >
            <Edit size={18} />
            <span>Edit Course</span>
          </button>
        </div>

        {/* Course Image */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="h-64 overflow-hidden">
            {course?.imageURL ? (
              <img
                src={course.imageURL}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <BookOpen size={64} className="text-white opacity-50" />
              </div>
            )}
          </div>
        </div>

        {/* Course Info */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">{course?.title}</h1>
          <p className="text-gray-600 text-lg mb-4">{course?.description}</p>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar size={16} />
              Created: {formatDate(course?.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={16} />
              Updated: {formatDate(course?.updatedAt)}
            </span>
          </div>
        </div>

        {/* Teachers Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <GraduationCap size={20} className="text-blue-600" />
            Teachers ({teachers.length})
          </h2>

          {teachers.length > 0 ? (
            <div className="space-y-3">
              {teachers.map((teacher) => (
                <div key={teacher._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {teacher.name?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{teacher.name}</p>
                    <p className="text-sm text-gray-500">{teacher.email}</p>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    {teacher.post || 'Teacher'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No teachers assigned</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseProfile;