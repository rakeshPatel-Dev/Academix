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
import axios from "axios"

const Courses = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)


  //  actual API calls
  useEffect(() => {
    ; (async () => {

      try {
        setLoading(true)

        const res = await axios.get("http://localhost:3000/api/courses", {
          params: { page }
        })

        setCourses(res.data.data)
        setPage(res.data.currentPage)
        setTotalPages(res.data.totalPages)
        setLoading(false)
      } catch (error) {
        console.log("Error fetching courses.", error);
      }

    })()

  }, [page]);

  // Filter courses based on search
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/courses/${id}`)
      setCourses(courses.filter(course => course._id !== id));
    } catch (error) {
      console.log("Failed to delete course.", error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center  h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <h1 className=' font-black tracking-wider animate-pulse'>Loading Courses...</h1>
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
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-xs text-gray-500">Total Courses</p>
          <p className="text-xl font-bold text-gray-800">{courses.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-xs text-gray-500">Total Students</p>
          <p className="text-xl font-bold text-blue-600">
            0
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

      <div className=' text-neutral-600 text-sm font-semibold'>
        <h1>Showing page {page} of {totalPages}</h1>
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
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group"
              >
                {/* Course Image */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={course.imageURL}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
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
                      <span className="font-medium text-gray-800">{(course.teacherAssigned) ? courses.teacherAssigned : "No teacher assigned yet."}</span>
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2 border-t border-neutral-100">
                    <button
                      onClick={() => navigate(`/courses/edit/${course._id}`)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                    >
                      <Edit size={14} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(course._id, course.title)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className=' mb-5 mt-10 w-full flex items-center justify-end gap-4'>
            <button
              disabled={page === 1}
              onClick={() => { setPage(page - 1) }}
              className=' bg-neutral-300 rounded-md disabled:cursor-not-allowed disabled:text-neutral-600/80 px-4 hover:bg-neutral-300/80 transition-all py-1'>Prev</button>
            <button
              disabled={page === totalPages}
              onClick={() => { setPage(page + 1) }}
              className=' bg-neutral-300 rounded-md disabled:cursor-not-allowed disabled:text-neutral-600/80 px-4 hover:bg-neutral-300/80 transition-all py-1'>Next</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;