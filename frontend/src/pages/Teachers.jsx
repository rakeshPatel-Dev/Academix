// pages/Teachers.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  BookOpen,
  Edit,
  Trash2,
  Plus,
  Search,
  ChevronRight,
  User,
  Calendar,
  AlertCircle,
  Users
} from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const Teachers = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState({});

  // Fetch all teachers
  const fetchTeachers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_URL}/teachers`);

      // Handle different API response structures
      const teachersData = response.data.data || response.data.teachers || response.data;
      setTeachers(Array.isArray(teachersData) ? teachersData : []);

      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch teachers:', error);
      setError(error.response?.data?.message || 'Failed to load teachers');
      setLoading(false);
    }
  };

  // Fetch all courses for course details
  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${API_URL}/courses`);
      console.log('Courses API Response:', response.data);

      const coursesData = response.data.data || response.data.courses || response.data;
      setCourses(Array.isArray(coursesData) ? coursesData : []);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  // Fetch teachers and courses on component mount
  useEffect(() => {
    fetchTeachers();
    fetchCourses();
  }, []);

  // ✅ Get course names from courseId array
  const getCourseNames = (courseIds) => {
    if (!courseIds || courseIds.length === 0) return 'No courses assigned';

    // If courseIds contains populated course objects
    if (courseIds[0] && typeof courseIds[0] === 'object' && courseIds[0].title) {
      return courseIds.map(c => c.title).join(', ');
    }

    // If courseIds contains only IDs, find in courses array
    const foundCourses = courses.filter(c => courseIds.includes(c._id || c.id));
    if (foundCourses.length === 0) return `${courseIds.length} course(s) assigned`;

    return foundCourses.map(c => c.title).join(', ');
  };

  // ✅ Get course details for display
  const getCourseDetails = (courseIds) => {
    if (!courseIds || courseIds.length === 0) return [];

    // If courseIds contains populated course objects
    if (courseIds[0] && typeof courseIds[0] === 'object') {
      return courseIds;
    }

    // If courseIds contains only IDs, find in courses array
    return courses.filter(c => courseIds.includes(c._id || c.id));
  };

  // Filter teachers based on search
  const filteredTeachers = teachers.filter(teacher => {
    const courseNames = getCourseNames(teacher.courseId).toLowerCase();
    return (
      teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.post?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      courseNames.includes(searchTerm.toLowerCase())
    );
  });

  // Handle delete
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name}?`)) return;

    setDeleteLoading(prev => ({ ...prev, [id]: true }));

    try {
      await axios.delete(`${API_URL}/teachers/${id}`);
      setTeachers(teachers.filter(teacher => (teacher._id || teacher.id) !== id));
      alert('Teacher deleted successfully!');
    } catch (error) {
      console.error('Failed to delete teacher:', error);
      alert(error.response?.data?.message || 'Failed to delete teacher');
    } finally {
      setDeleteLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  // Get post badge color
  const getPostColor = (post) => {
    switch (post?.toLowerCase()) {
      case 'professor':
        return 'bg-purple-100 text-purple-700';
      case 'associate professor':
        return 'bg-blue-100 text-blue-700';
      case 'assistant professor':
        return 'bg-green-100 text-green-700';
      case 'lecturer':
        return 'bg-amber-100 text-amber-700';
      case 'senior lecturer':
        return 'bg-indigo-100 text-indigo-700';
      case 'head of department':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  // Calculate stats
  const stats = {
    total: teachers.length,
    professors: teachers.filter(t => t.post?.toLowerCase() === 'professor').length,
    associate: teachers.filter(t => t.post?.toLowerCase() === 'associate professor').length,
    assistant: teachers.filter(t => t.post?.toLowerCase() === 'assistant professor').length,
    lecturer: teachers.filter(t => t.post?.toLowerCase() === 'lecturer').length,
    unassigned: teachers.filter(t => !t.courseId || t.courseId.length === 0).length
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="text-gray-500 animate-pulse">Loading teachers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
        <AlertCircle size={48} className="mx-auto text-red-300 mb-3" />
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchTeachers}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6">
      {/* Header with title and add button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Teachers</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all your teachers and their course assignments</p>
        </div>
        <button
          onClick={() => navigate('/teachers/new')}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow"
        >
          <Plus size={18} />
          <span className="font-medium">Add New Teacher</span>
        </button>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Total Teachers</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Professors</p>
          <p className="text-2xl font-bold text-purple-600">{stats.professors}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Associate</p>
          <p className="text-2xl font-bold text-blue-600">{stats.associate}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Assistant</p>
          <p className="text-2xl font-bold text-green-600">{stats.assistant}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Unassigned</p>
          <p className="text-2xl font-bold text-amber-600">{stats.unassigned}</p>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search teachers by name, email, post, or course..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Teachers grid */}
      {filteredTeachers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <GraduationCap size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg mb-2">
            {searchTerm ? 'No teachers match your search' : 'No teachers found'}
          </p>
          <p className="text-gray-400 text-sm mb-6">
            {searchTerm
              ? `Try different keywords or clear search`
              : 'Get started by adding your first teacher'}
          </p>
          {searchTerm ? (
            <button
              onClick={() => setSearchTerm('')}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Search
            </button>
          ) : (
            <button
              onClick={() => navigate('/teachers/new')}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Teacher
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher) => {
            const teacherId = teacher._id || teacher.id;
            const courseIds = teacher.courseId || [];
            const assignedCourses = getCourseDetails(courseIds);
            const courseCount = Array.isArray(courseIds) ? courseIds.length : (courseIds ? 1 : 0);

            return (
              <div
                key={teacherId}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group"
              >
                {/* Header with avatar and name */}
                <div className="p-5 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {teacher.avatar ? (
                        <img
                          src={teacher.avatar}
                          alt={teacher.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                          <span className="text-white font-bold text-xl">
                            {teacher.name?.charAt(0) || 'T'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 truncate text-lg">{teacher.name}</h3>
                      <span className={`inline-block text-xs px-2 py-1 rounded-full mt-2 ${getPostColor(teacher.post)}`}>
                        {teacher.post || 'Teacher'}
                      </span>
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <Calendar size={12} />
                        Joined {formatDate(teacher.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact details */}
                <div className="p-5 space-y-3 border-b border-gray-100">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail size={14} className="text-gray-400 flex-shrink-0" />
                    {teacher.email ? (
                      <a href={`mailto:${teacher.email}`} className="text-gray-600 hover:text-blue-600 truncate">
                        {teacher.email}
                      </a>
                    ) : (
                      <span className="text-gray-400 italic">No email</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <Phone size={14} className="text-gray-400 flex-shrink-0" />
                    {teacher.phone ? (
                      <a href={`tel:${teacher.phone}`} className="text-gray-600 hover:text-blue-600">
                        {teacher.phone}
                      </a>
                    ) : (
                      <span className="text-gray-400 italic">No phone</span>
                    )}
                  </div>

                  <div className="flex items-start gap-3 text-sm">
                    <MapPin size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{teacher.address || 'No address provided'}</span>
                  </div>
                </div>

                {/* Assigned Courses */}
                <div className="p-5">
                  <div className={`rounded-lg p-4 ${courseCount > 0 ? 'bg-gray-50' : 'bg-amber-50'}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen size={16} className={courseCount > 0 ? 'text-blue-500' : 'text-amber-500'} />
                      <p className="text-sm font-medium text-gray-700">
                        {courseCount > 0 ? `Assigned Course${courseCount > 1 ? 's' : ''} (${courseCount})` : 'No Courses Assigned'}
                      </p>
                    </div>

                    {courseCount > 0 ? (
                      <div className="space-y-3 max-h-32 overflow-y-auto">
                        {assignedCourses.map((course, index) => (
                          <div key={index} className="flex items-center gap-3 bg-white p-2 rounded-lg">
                            <img
                              src={course.imageURL || course.imageUrl || 'https://via.placeholder.com/32/2563eb/ffffff?text=Course'}
                              alt={course.title}
                              className="w-8 h-8 rounded object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/32/2563eb/ffffff?text=C';
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">{course.title}</p>
                              <p className="text-xs text-gray-400 truncate">{course.description?.substring(0, 30)}...</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic text-center py-2">Not teaching any courses yet</p>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2">
                  <button
                    onClick={() => navigate(`/teachers/edit/${teacherId}`)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2.5 text-sm text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Edit size={14} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(teacherId, teacher.name)}
                    disabled={deleteLoading[teacherId]}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {deleteLoading[teacherId] ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent"></div>
                    ) : (
                      <>
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => navigate(`/teachers/${teacherId}`)}
                    className="px-3 py-2.5 text-sm text-gray-500 hover:bg-gray-200 rounded-lg transition-colors"
                    title="View details"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Teachers;