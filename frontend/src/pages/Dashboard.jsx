// pages/Dashboard.jsx
import React from 'react';
import {
  BookOpen,
  Users,
  GraduationCap,
  PlusCircle,
  ChevronRight,
  TrendingUp,
  Clock,
  Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useFetchMultipleApis from '../hooks/useDataLength';

const API_URL = 'http://localhost:3000/api';

const Dashboard = () => {
  const navigate = useNavigate();

  // Define API URLs for the custom hook
  const apiUrls = {
    courses: `${API_URL}/courses`,
    students: `${API_URL}/students`,
    teachers: `${API_URL}/teachers`
  };

  // Use the custom hook
  const { totals, loading, error } = useFetchMultipleApis(apiUrls);

  // Extract counts with safe defaults
  const courseCount = totals.courses || 0;
  const studentCount = totals.students || 0;
  const teacherCount = totals.teachers || 0;

  // Calculate additional stats (you might want to fetch these separately)
  // For now, using placeholder data - you can create another hook for detailed stats
  const morningCount = Math.floor(studentCount * 0.6); // 60% morning
  const eveningCount = Math.floor(studentCount * 0.4); // 40% evening
  const professorCount = Math.floor(teacherCount * 0.3); // 30% professors

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">Error loading dashboard: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Gradient */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10 rounded-2xl"></div>
        <div className="relative py-6 px-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 text-sm mt-2">Welcome back! Here's your overview for today.</p>
        </div>
      </div>

      {/* Premium Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Courses Card - Premium */}
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full transform translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full transform -translate-x-12 translate-y-12"></div>

          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <BookOpen size={24} className="text-white" />
              </div>
              <TrendingUp size={20} className="text-white/70" />
            </div>

            <h3 className="text-4xl font-bold text-white mb-1">{courseCount}</h3>
            <p className="text-white/80 text-sm mb-4">Total Courses</p>

            <div className="flex items-center gap-2 text-white/90 text-sm">
              <span className="flex items-center gap-1">
                <Clock size={14} />
                Active
              </span>
              <span className="w-1 h-1 bg-white/50 rounded-full"></span>
              <span className="flex items-center gap-1">
                <Award size={14} />
                {courseCount} Available
              </span>
            </div>

            <button
              onClick={() => navigate('/courses')}
              className="mt-4 w-full py-2 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors backdrop-blur-sm"
            >
              View Courses <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Students Card - Premium */}
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full transform translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full transform -translate-x-12 translate-y-12"></div>

          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Users size={24} className="text-white" />
              </div>
              <TrendingUp size={20} className="text-white/70" />
            </div>

            <h3 className="text-4xl font-bold text-white mb-1">{studentCount}</h3>
            <p className="text-white/80 text-sm mb-4">Total Students</p>

            <div className="flex items-center gap-3 text-white/90 text-sm">
              <span className="px-2 py-1 bg-white/10 rounded-lg">M: {morningCount}</span>
              <span className="px-2 py-1 bg-white/10 rounded-lg">E: {eveningCount}</span>
            </div>

            <button
              onClick={() => navigate('/students')}
              className="mt-4 w-full py-2 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors backdrop-blur-sm"
            >
              View Students <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Teachers Card - Premium */}
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full transform translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full transform -translate-x-12 translate-y-12"></div>

          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <GraduationCap size={24} className="text-white" />
              </div>
              <Award size={20} className="text-white/70" />
            </div>

            <h3 className="text-4xl font-bold text-white mb-1">{teacherCount}</h3>
            <p className="text-white/80 text-sm mb-4">Total Teachers</p>

            <div className="flex items-center gap-2 text-white/90 text-sm">
              <span className="flex items-center gap-1">
                <Award size={14} />
                Professors: {professorCount}
              </span>
            </div>

            <button
              onClick={() => navigate('/teachers')}
              className="mt-4 w-full py-2 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors backdrop-blur-sm"
            >
              View Teachers <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions - Premium */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-50 to-white p-6 border border-gray-100 shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full transform translate-x-32 -translate-y-32"></div>

        <div className="relative">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Quick Actions
          </h3>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/courses/new')}
              className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              <PlusCircle size={18} className="group-hover:rotate-90 transition-transform duration-300" />
              <span>New Course</span>
            </button>

            <button
              onClick={() => navigate('/students/new')}
              className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              <PlusCircle size={18} className="group-hover:rotate-90 transition-transform duration-300" />
              <span>Add Student</span>
            </button>

            <button
              onClick={() => navigate('/teachers/new')}
              className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              <PlusCircle size={18} className="group-hover:rotate-90 transition-transform duration-300" />
              <span>Add Teacher</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity - Optional Premium Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-50 to-white p-6 border border-gray-100 shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full transform translate-x-32 -translate-y-32"></div>

        <div className="relative">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Recent Activity
          </h3>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">Dashboard loaded successfully</p>
                <p className="text-xs text-gray-500">Just now</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">{courseCount} courses available</p>
                <p className="text-xs text-gray-500">System update</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">{studentCount} students enrolled</p>
                <p className="text-xs text-gray-500">Active enrollment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;