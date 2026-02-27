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
  User,
  X,
  Users2
} from 'lucide-react';
import axios from "axios";

const API_URL = 'http://localhost:3000/api';

const Courses = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);
  const [deleteLoading, setDeleteLoading] = useState({});
  const [searchMode, setSearchMode] = useState(false);
  const [error, setError] = useState(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset to page 1 when search term changes
  useEffect(() => {
    if (debouncedSearchTerm) {
      setPage(1);
    }
  }, [debouncedSearchTerm]);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setError(null);

        if (debouncedSearchTerm) {
          // Search mode
          setSearchLoading(true);
          setSearchMode(true);
          setLoading(false);

          const res = await axios.get(`${API_URL}/courses/search`, {
            params: {
              q: debouncedSearchTerm,
              page,
              limit: 6
            }
          });

          const responseData = res.data;
          const coursesData = responseData.data || responseData.courses || responseData;
          console.log(responseData);

          setCourses(Array.isArray(coursesData) ? coursesData : []);

          if (responseData.pagination) {
            setTotalPages(responseData.pagination.pages || 1);
            setTotalCourses(responseData.pagination.total || 0);
          } else {
            setTotalPages(responseData.totalPages || 1);
            setTotalCourses(responseData.total || coursesData.length || 0);
          }

        } else {
          // Normal mode
          setLoading(true);
          setSearchMode(false);
          setSearchLoading(false);

          const res = await axios.get(`${API_URL}/courses`, {
            params: { page, limit: 6 }
          });

          const responseData = res.data;
          const coursesData = responseData.data || responseData.courses || responseData;

          setCourses(Array.isArray(coursesData) ? coursesData : []);

          setTotalPages(responseData.totalPages || 1);
          setTotalCourses(responseData.total || responseData.count || coursesData.length || 0);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError(error.response?.data?.message || "Failed to fetch courses");
        setCourses([]);
      } finally {
        setSearchLoading(false);
        setLoading(false);
      }
    };

    fetchCourses();
  }, [debouncedSearchTerm, page]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setPage(1);
  };

  // Handle delete
  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    setDeleteLoading(prev => ({ ...prev, [id]: true }));

    try {
      await axios.delete(`${API_URL}/courses/${id}`);
      setCourses(courses.filter(course => course._id !== id));
      setTotalCourses(prev => prev - 1);

      if (courses.length === 1 && page > 1) {
        setPage(page - 1);
      }
    } catch (error) {
      console.error("Failed to delete course:", error);
      alert(error.response?.data?.message || "Failed to delete course");
    } finally {
      setDeleteLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  // Calculate stats (only for non-search mode)
  const totalStudents = !searchMode ? courses.reduce((sum, course) => {
    return sum + (course.students?.length || course.studentCount || 0);
  }, 0) : 0;

  // ✅ UPDATED: Handle teacher array for unique teacher count
  const uniqueTeachers = !searchMode ? new Set(
    courses.flatMap(course =>
      (course.teachers || course.teacher || []).map(t => t._id || t)
    ).filter(id => id)
  ).size : 0;

  // ✅ NEW: Get teachers list safely
  const getTeachers = (course) => {
    // Check different possible field names
    if (course.teachers && Array.isArray(course.teachers)) return course.teachers;
    if (course.teacher && Array.isArray(course.teacher)) return course.teacher;
    if (course.teachers && !Array.isArray(course.teachers)) return [course.teachers];
    if (course.teacher && !Array.isArray(course.teacher)) return [course.teacher];
    return [];
  };

  // Loading state
  if (loading && !searchMode) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <h1 className='font-bold tracking-wider animate-pulse text-gray-600'>Loading Courses...</h1>
      </div>
    );
  }

  // Error state
  if (error && !searchMode) {
    return (
      <div className="text-center py-16 bg-white rounded-lg border border-gray-100">
        <div className="text-red-500 mb-4">⚠️</div>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
          <h1 className="text-3xl font-bold text-gray-800">Courses</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all your courses here</p>
        </div>
        <button
          onClick={() => navigate('/courses/new')}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow"
        >
          <Plus size={18} />
          <span className="font-medium">Add New Course</span>
        </button>
      </div>

      {/* Stats summary - Hide during search */}
      {!searchMode && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Total Courses</p>
              <BookOpen size={20} className="text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{totalCourses}</p>
            <p className="text-xs text-gray-400 mt-2">Showing {courses.length} on this page</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Total Students</p>
              <Users size={20} className="text-green-500" />
            </div>
            <p className="text-3xl font-bold text-blue-600">{totalStudents}</p>
            <p className="text-xs text-gray-400 mt-2">Across all courses</p>
          </div>

          {/* ✅ UPDATED: Teachers stat card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Total Teachers</p>
              <Users2 size={20} className="text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-purple-600">{uniqueTeachers}</p>
            <p className="text-xs text-gray-400 mt-2">Unique teachers assigned</p>
          </div>
        </div>
      )}

      {/* Search bar */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search courses by title, description..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        {searchLoading && (
          <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
          </div>
        )}

        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Search results info */}
      {searchMode && (
        <div className='bg-blue-50 p-4 rounded-xl border border-blue-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3'>
          <div>
            <span className="font-medium text-blue-800">Search results for "{debouncedSearchTerm}"</span>
            <span className="ml-2 text-blue-600 text-sm">({totalCourses} courses found)</span>
          </div>
          <button
            onClick={clearSearch}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium bg-white px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-50"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Pagination info */}
      {!searchMode && totalPages > 1 && (
        <div className='flex justify-between items-center bg-gray-50 p-3 rounded-lg'>
          <h1 className="text-gray-600 text-sm">Page {page} of {totalPages}</h1>
          <span className="text-gray-400 text-xs">{courses.length} courses displayed</span>
        </div>
      )}

      {/* Course cards grid */}
      {courses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <BookOpen size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg mb-2">
            {searchMode ? 'No courses found' : 'No courses yet'}
          </p>
          <p className="text-gray-400 text-sm mb-6">
            {searchMode
              ? `No results matching "${debouncedSearchTerm}"`
              : 'Get started by adding your first course'}
          </p>
          {searchMode ? (
            <button
              onClick={clearSearch}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Search
            </button>
          ) : (
            <button
              onClick={() => navigate('/courses/new')}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Course
            </button>
          )}
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const teachers = getTeachers(course);
              const teacherCount = teachers.length;

              return (
                <div
                  key={course._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group"
                >
                  {/* Course Image */}
                  <div className="relative h-44 overflow-hidden bg-linear-to-br from-blue-50 to-purple-50">
                    {course.imageURL || course.imageUrl ? (
                      <img
                        src={course.imageURL || course.imageUrl}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/400x200/e2e8f0/64748b?text=No+Image';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen size={48} className="text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5">
                    {/* Title */}
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-1 text-lg">
                      {course.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    {/* ✅ UPDATED: Teachers Info - Now shows multiple teachers */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Users2 size={14} className="text-gray-400" />
                        <span className="text-xs font-medium text-gray-500">
                          {teacherCount} Teacher{teacherCount !== 1 ? 's' : ''}
                        </span>
                      </div>

                      {teacherCount > 0 ? (
                        <div className="space-y-2">
                          {teachers.slice(0, 2).map((teacher, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <div className="relative shrink-0">
                                {teacher.avatar ? (
                                  <img
                                    src={teacher.avatar}
                                    alt={teacher.name}
                                    className="w-6 h-6 rounded-full object-cover border border-gray-200"
                                  />
                                ) : (
                                  <div className="w-6 h-6 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                                    {teacher.name?.charAt(0) || 'T'}
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-700 truncate">
                                  {teacher.name || "Unknown Teacher"}
                                </p>
                                <p className="text-xs text-gray-400 truncate">
                                  {teacher.post || "Teacher"}
                                </p>
                              </div>
                            </div>
                          ))}
                          {teacherCount > 2 && (
                            <p className="text-xs text-gray-400 ml-8">
                              +{teacherCount - 2} more teacher{teacherCount - 2 !== 1 ? 's' : ''}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 italic">No teachers assigned</p>
                      )}
                    </div>

                    {/* Course Stats */}
                    <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users size={14} />
                        {course.students?.length || course.studentCount || 0} students
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => navigate(`/courses/edit/${course._id}`)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit size={14} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(course._id, course.title)}
                        disabled={deleteLoading[course._id]}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {deleteLoading[course._id] ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent"></div>
                        ) : (
                          <>
                            <Trash2 size={14} />
                            <span>Delete</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => navigate(`/courses/${course._id}`)}
                        className="px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View details"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className='mt-10 w-full flex items-center justify-center gap-2 flex-wrap'>
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className='px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors'
              >
                Previous
              </button>

              <div className='flex gap-1'>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-10 h-10 rounded-lg transition-colors ${page === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className='px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors'
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Courses;