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
  X
} from 'lucide-react';
import axios from "axios";
import debounce from 'lodash.debounce';

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
  const [searchMode, setSearchMode] = useState(false); // Track if in search mode

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch courses (with or without search)
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (debouncedSearchTerm) {
          // Search mode
          setSearchLoading(true);
          setSearchMode(true);

          const res = await axios.get("http://localhost:3000/api/courses/search", {
            params: {
              q: debouncedSearchTerm,
              page,
              limit: 9
            }
          });

          // Handle search response
          const coursesData = res.data.data || res.data.courses || res.data;
          setCourses(Array.isArray(coursesData) ? coursesData : []);

          setTotalPages(res.data.totalPages || Math.ceil((res.data.total || coursesData.length) / 9));
          setTotalCourses(res.data.total || coursesData.length);

          setSearchLoading(false);
        } else {
          // Normal mode (no search)
          setLoading(true);
          setSearchMode(false);

          const res = await axios.get("http://localhost:3000/api/courses", {
            params: { page, limit: 9 }
          });

          const coursesData = res.data.data || res.data.courses || res.data;
          setCourses(Array.isArray(coursesData) ? coursesData : []);

          setTotalPages(res.data.totalPages || Math.ceil((res.data.total || coursesData.length) / 9));
          setTotalCourses(res.data.total || coursesData.length);

          setLoading(false);
        }
      } catch (error) {
        console.log("Error fetching courses.", error);
        setCourses([]);
      } finally {
        setSearchLoading(false);
        setLoading(false);
      }
    };

    // Reset to page 1 when search term changes
    if (debouncedSearchTerm) {
      setPage(1);
    }

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
      await axios.delete(`http://localhost:3000/api/courses/${id}`);
      setCourses(courses.filter(course => course._id !== id));
      setTotalCourses(prev => prev - 1);
    } catch (error) {
      console.log("Failed to delete course.", error);
      alert(error.response?.data?.message || "Failed to delete course");
    } finally {
      setDeleteLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  // Calculate stats (only for non-search mode)
  const totalStudents = !searchMode ? courses.reduce((sum, course) => {
    return sum + (course.students?.length || course.studentCount || 0);
  }, 0) : 0;

  const uniqueTeachers = !searchMode ? new Set(
    courses
      .map(course => course.teacherId?._id || course.teacherId)
      .filter(id => id)
  ).size : 0;

  if (loading && !searchMode) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <h1 className='font-black tracking-wider animate-pulse'>Loading Courses...</h1>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4">
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

      {/* Stats summary - Hide during search */}
      {!searchMode && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Total Courses</p>
            <p className="text-2xl font-bold text-gray-800">{totalCourses}</p>
            <p className="text-xs text-gray-400 mt-1">Showing {courses.length} on this page</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Total Students</p>
            <p className="text-2xl font-bold text-blue-600">{totalStudents}</p>
            <p className="text-xs text-gray-400 mt-1">Across all courses</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Total Teachers</p>
            <p className="text-2xl font-bold text-purple-600">{uniqueTeachers}</p>
            <p className="text-xs text-gray-400 mt-1">Unique teachers assigned</p>
          </div>
        </div>
      )}

      {/* Search bar with loading indicator */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search courses by title, description, or teacher..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Search loading indicator */}
        {searchLoading && (
          <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Clear search button */}
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Search results info */}
      {searchMode && (
        <div className='text-neutral-600 text-sm font-semibold flex justify-between items-center bg-blue-50 p-3 rounded-lg'>
          <div>
            <span className="font-medium">Search results for "{debouncedSearchTerm}"</span>
            <span className="ml-2 text-gray-500">({totalCourses} courses found)</span>
          </div>
          <button
            onClick={clearSearch}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Pagination info */}
      {!searchMode && (
        <div className='text-neutral-600 text-sm font-semibold flex justify-between items-center'>
          <h1>Showing page {page} of {totalPages}</h1>
          <span className="text-gray-400 text-xs">{courses.length} courses displayed</span>
        </div>
      )}

      {/* Course cards grid */}
      {courses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-100">
          <BookOpen size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg mb-2">
            {searchMode ? 'No courses found' : 'No courses yet'}
          </p>
          <p className="text-gray-400 text-sm mb-4">
            {searchMode
              ? `No results matching "${debouncedSearchTerm}"`
              : 'Get started by adding your first course'}
          </p>
          {searchMode ? (
            <button
              onClick={clearSearch}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Search
            </button>
          ) : (
            <button
              onClick={() => navigate('/courses/new')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Course
            </button>
          )}
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group"
              >
                {/* Course Image */}
                <div className="relative h-44 overflow-hidden bg-gray-100">
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
                    <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-blue-50 to-purple-50">
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

                  {/* Teacher Info */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {course.teacherId?.name?.charAt(0) || '?'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        {course.teacherId?.name || "No teacher assigned"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {course.teacherId?.post || "Pending assignment"}
                      </p>
                    </div>
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
                      disabled={deleteLoading[course._id]}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
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
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
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
            ))}
          </div>

          {/* Pagination Controls - Hide during search if less than 1 page */}
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
                        ? 'bg-blue-500 text-white'
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