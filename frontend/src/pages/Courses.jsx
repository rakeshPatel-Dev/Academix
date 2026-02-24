// pages/Courses.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Users,
  GraduationCap,
  Edit,
  Trash2,
  Plus,
  Search,
  ChevronRight,
  User
} from 'lucide-react';

const Courses = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data with images - Replace with actual API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCourses([
        {
          id: 1,
          title: 'Mathematics 101',
          description: 'Introduction to algebra, calculus, and geometry fundamentals. Perfect for beginners.',
          image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          studentsEnrolled: 156,
          teacherAssigned: 'Dr. Sarah Wilson',
          teacherAvatar: 'https://images.unsplash.com/photo-1494790108777-766d1f0f3f7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
          status: 'Active'
        },
        {
          id: 2,
          title: 'Physics Fundamentals',
          description: 'Basic principles of mechanics, thermodynamics, and waves with practical examples.',
          image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          studentsEnrolled: 98,
          teacherAssigned: 'Prof. James Brown',
          teacherAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
          status: 'Active'
        },
        {
          id: 3,
          title: 'English Literature',
          description: 'Study of classic literature, poetry, and creative writing from renowned authors.',
          image: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          studentsEnrolled: 112,
          teacherAssigned: 'Prof. Emily Davis',
          teacherAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
          status: 'Active'
        },
        {
          id: 4,
          title: 'Computer Science',
          description: 'Programming fundamentals, algorithms, and data structures in Python and Java.',
          image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          studentsEnrolled: 203,
          teacherAssigned: 'Dr. Michael Chen',
          teacherAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
          status: 'Active'
        },
        {
          id: 5,
          title: 'History 201',
          description: 'World history from ancient civilizations to modern era. Explore major events.',
          image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          studentsEnrolled: 67,
          teacherAssigned: 'Prof. Robert Anderson',
          teacherAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
          status: 'Upcoming'
        },
        {
          id: 6,
          title: 'Chemistry Basics',
          description: 'Introduction to chemical reactions, periodic table, and essential lab safety.',
          image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          studentsEnrolled: 134,
          teacherAssigned: 'Dr. Lisa White',
          teacherAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
          status: 'Active'
        },
        {
          id: 7,
          title: 'Biology Fundamentals',
          description: 'Study of life, cells, genetics, and ecosystems. Perfect for pre-med students.',
          image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          studentsEnrolled: 145,
          teacherAssigned: 'Dr. Maria Garcia',
          teacherAvatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
          status: 'Active'
        },
        {
          id: 8,
          title: 'Art & Design',
          description: 'Explore creative techniques, color theory, and digital design principles.',
          image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          studentsEnrolled: 89,
          teacherAssigned: 'Prof. David Lee',
          teacherAvatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
          status: 'Active'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter courses based on search
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.teacherAssigned.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle delete
  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      setCourses(courses.filter(course => course.id !== id));
      // In real app: API call to delete
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center  h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header with title and add button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Courses</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all your courses here</p>
        </div>
        <button
          onClick={() => navigate('/courses/new')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          <span>Add New Course</span>
        </button>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-xs text-gray-500">Total Courses</p>
          <p className="text-xl font-bold text-gray-800">{courses.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-xs text-gray-500">Active Courses</p>
          <p className="text-xl font-bold text-green-600">
            {courses.filter(c => c.status === 'Active').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-xs text-gray-500">Total Students</p>
          <p className="text-xl font-bold text-blue-600">
            {courses.reduce((sum, c) => sum + c.studentsEnrolled, 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-xs text-gray-500">Total Teachers</p>
          <p className="text-xl font-bold text-purple-600">
            {new Set(courses.map(c => c.teacherAssigned)).size}
          </p>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search courses by title, description, or teacher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Course cards grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
          <BookOpen size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No courses found</p>
          <button
            onClick={() => navigate('/courses/new')}
            className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Add your first course
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group"
            >
              {/* Course Image */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${course.status === 'Active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-amber-100 text-amber-700'
                    }`}>
                    {course.status}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4">
                {/* Title */}
                <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">
                  {course.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                  {course.description}
                </p>

                {/* Students Enrolled */}
                <div className="flex items-center gap-1.5 mb-2">
                  <Users size={14} className="text-gray-400" />
                  <span className="text-xs text-gray-600">
                    <span className="font-medium text-gray-800">{course.studentsEnrolled}</span> students enrolled
                  </span>
                </div>

                {/* Teacher Assigned */}
                <div className="flex items-center gap-2 mb-3">
                  {course.teacherAvatar ? (
                    <img
                      src={course.teacherAvatar}
                      alt={course.teacherAssigned}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                      <User size={12} className="text-gray-500" />
                    </div>
                  )}
                  <span className="text-xs text-gray-600">
                    <span className="font-medium text-gray-800">{course.teacherAssigned}</span>
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => navigate(`/courses/edit/${course.id}`)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit size={14} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(course.id, course.title)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;