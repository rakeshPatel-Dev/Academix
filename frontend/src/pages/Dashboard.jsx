// pages/Dashboard.jsx
import React, { useMemo } from 'react';
import {
  BookOpen,
  Users,
  GraduationCap,
  PlusCircle,
  ChevronRight,
  TrendingUp,
  Clock,
  Award,
  Sun,
  Moon,
  UserCheck,
  UserPlus,
  Activity,
  UserRoundCheck,
  UserRoundX,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useFetchMultipleApis from '../hooks/useDataLength';

const API_URL = 'http://localhost:3000/api';

const Dashboard = () => {
  const navigate = useNavigate();

  // Define API URLs for the custom hook
  const apiUrls = useMemo(() => ({
    teachers: `${API_URL}/teachers`,
    students: `${API_URL}/students`,
    courses: `${API_URL}/courses`
  }), []); // Empty dependency array since API_URL is constant

  // Use the custom hook
  const { data, loading, error } = useFetchMultipleApis(apiUrls);

  // Memoize the filtered data to prevent recalculations
  const { teachers, students, courses } = useMemo(() => {
    // Filter and extract data properly
    const teachersData = data.find(item => item.name === 'teachers');
    const studentsData = data.find(item => item.name === 'students');
    const coursesData = data.find(item => item.name === 'courses');

    return {
      teachers: teachersData?.data || [],
      students: studentsData?.data || [],
      courses: coursesData?.data || []
    };
  }, [data]); // Only recalculate when data changes


  // Memoize statistics calculations
  const stats = useMemo(() => {
    // Calculate statistics
    const teacherCount = teachers.length;
    const studentCount = students.length;
    const courseCount = courses.length;

    // Student shift distribution
    const morningStudents = students.filter(s => s.shift?.toLowerCase() === 'morning').length;
    const eveningStudents = students.filter(s => s.shift?.toLowerCase() === 'evening').length;

    // Teacher post distribution
    const professors = teachers.filter(t => t.post?.toLowerCase() === 'professor').length;
    const associateProfessors = teachers.filter(t =>
      t.post?.toLowerCase() === 'associate professor' || t.post?.toLowerCase() === 'associate'
    ).length;
    const assistantProfessors = teachers.filter(t =>
      t.post?.toLowerCase() === 'assistant professor' || t.post?.toLowerCase() === 'assistant'
    ).length;

    // Course status
    const coursesWithTeacher = courses.filter(c => c.teacher && c.teacher.length > 0).length || 0;
    const coursesWithoutTeacher = courses.filter(c => !c.teacher || c.teacher.length === 0).length || 0;

    // Calculate percentages
    const morningPercentage = studentCount ? Math.round((morningStudents / studentCount) * 100) : 0;
    const eveningPercentage = studentCount ? Math.round((eveningStudents / studentCount) * 100) : 0;

    return {
      teacherCount,
      studentCount,
      courseCount,
      morningStudents,
      eveningStudents,
      professors,
      associateProfessors,
      assistantProfessors,
      coursesWithTeacher,
      coursesWithoutTeacher,
      morningPercentage,
      eveningPercentage
    };
  }, [teachers, students, courses]);

  // Memoize recent items to prevent unnecessary recalculations
  const recentItems = useMemo(() => ({
    recentStudents: students.slice(0, 3),
    recentTeachers: teachers.slice(0, 3),
    recentCourses: courses.slice(0, 3)
  }), [students, teachers, courses]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-200 border-t-blue-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md text-center">
          <Activity size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium mb-2">Error loading dashboard</p>
          <p className="text-red-500 text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header with Stats Overview */}
      <div className="relative overflow-hidden rounded-2xl border border-white/20 p-4 sm:p-6 md:p-8">
        {/* Premium gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-white/5 to-transparent backdrop-blur-3xl"></div>

        {/* Animated glow orbs - adjusted for mobile */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-violet-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="relative z-10">
          {/* Header Section - responsive text */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-1 sm:mb-2 tracking-tight">
              Dashboard
            </h1>
            <p className="text-black/60 text-xs sm:text-sm font-medium">
              Welcome back! Here's your comprehensive overview.
            </p>
          </div>

          {/* Mini Stats - responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
            {/* Total Students */}
            <div className="group relative bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-xl sm:rounded-2xl p-3 sm:p-4 overflow-hidden transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.2)] hover:-translate-y-1">
              {/* Glow accent */}
              <div className="absolute -top-4 -right-4 w-16 sm:w-20 h-16 sm:h-20 bg-blue-400/20 rounded-full blur-2xl group-hover:bg-blue-400/30 transition-all duration-300" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <p className="text-black/50 text-[10px] sm:text-xs font-medium uppercase tracking-widest">
                    Total Students
                  </p>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-1 sm:p-1.5">
                    <svg className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-black text-xl sm:text-2xl font-bold tracking-tight">{stats.studentCount}</p>
                <div className="mt-1 sm:mt-2 h-0.5 w-6 sm:w-8 bg-gradient-to-r from-blue-500 to-transparent rounded-full" />
              </div>
            </div>

            {/* Total Teachers */}
            <div className="group relative bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-xl sm:rounded-2xl p-3 sm:p-4 overflow-hidden transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.2)] hover:-translate-y-1">
              {/* Glow accent */}
              <div className="absolute -top-4 -right-4 w-16 sm:w-20 h-16 sm:h-20 bg-violet-400/20 rounded-full blur-2xl group-hover:bg-violet-400/30 transition-all duration-300" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <p className="text-black/50 text-[10px] sm:text-xs font-medium uppercase tracking-widest">
                    Total Teachers
                  </p>
                  <div className="bg-violet-500/10 border border-violet-500/20 rounded-lg p-1 sm:p-1.5">
                    <svg className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <p className="text-black text-xl sm:text-2xl font-bold tracking-tight">{stats.teacherCount}</p>
                <div className="mt-1 sm:mt-2 h-0.5 w-6 sm:w-8 bg-gradient-to-r from-violet-500 to-transparent rounded-full" />
              </div>
            </div>

            {/* Total Courses */}
            <div className="group relative bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-xl sm:rounded-2xl p-3 sm:p-4 overflow-hidden transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.2)] hover:-translate-y-1">
              {/* Glow accent */}
              <div className="absolute -top-4 -right-4 w-16 sm:w-20 h-16 sm:h-20 bg-emerald-400/20 rounded-full blur-2xl group-hover:bg-emerald-400/30 transition-all duration-300" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <p className="text-black/50 text-[10px] sm:text-xs font-medium uppercase tracking-widest">
                    Total Courses
                  </p>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-1 sm:p-1.5">
                    <svg className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
                <p className="text-black text-xl sm:text-2xl font-bold tracking-tight">{stats.courseCount}</p>
                <div className="mt-1 sm:mt-2 h-0.5 w-6 sm:w-8 bg-gradient-to-r from-emerald-500 to-transparent rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Students Card */}
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full transform translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full transform -translate-x-12 translate-y-12"></div>

          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Users size={24} className="text-white" />
              </div>
              <TrendingUp size={20} className="text-white/70" />
            </div>

            <h3 className="text-4xl font-bold text-white mb-1">{stats.studentCount}</h3>
            <p className="text-white/80 text-sm mb-4">Total Students</p>

            {/* Shift Distribution */}
            <div className="space-y-3 mb-4">
              <div>
                <div className="flex items-center justify-between text-white/90 text-xs mb-1">
                  <span className="flex items-center gap-1">
                    <Sun size={12} /> Morning
                  </span>
                  <span>{stats.morningStudents} ({stats.morningPercentage}%)</span>
                </div>
                <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-300 rounded-full transition-all duration-500"
                    style={{ width: `${stats.morningPercentage}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-white/90 text-xs mb-1">
                  <span className="flex items-center gap-1">
                    <Moon size={12} /> Evening
                  </span>
                  <span>{stats.eveningStudents} ({stats.eveningPercentage}%)</span>
                </div>
                <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-300 rounded-full transition-all duration-500"
                    style={{ width: `${stats.eveningPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/students')}
              className="mt-2 w-full py-2 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors backdrop-blur-sm"
            >
              View Details <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Teachers Card */}
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full transform translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full transform -translate-x-12 translate-y-12"></div>

          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <GraduationCap size={24} className="text-white" />
              </div>
              <Award size={20} className="text-white/70" />
            </div>

            <h3 className="text-4xl font-bold text-white mb-1">{stats.teacherCount}</h3>
            <p className="text-white/80 text-sm mb-4">Total Teachers</p>

            {/* Post Distribution */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-white/10 rounded-lg p-2 text-center">
                <UserCheck size={16} className="mx-auto mb-1 text-yellow-300" />
                <p className="text-white text-xs font-bold">{stats.professors}</p>
                <p className="text-white/70 text-[10px]">Professors</p>
              </div>
              <div className="bg-white/10 rounded-lg p-2 text-center">
                <UserPlus size={16} className="mx-auto mb-1 text-blue-300" />
                <p className="text-white text-xs font-bold">{stats.associateProfessors}</p>
                <p className="text-white/70 text-[10px]">Associate</p>
              </div>
              <div className="bg-white/10 rounded-lg p-2 text-center">
                <UserPlus size={16} className="mx-auto mb-1 text-green-300" />
                <p className="text-white text-xs font-bold">{stats.assistantProfessors}</p>
                <p className="text-white/70 text-[10px]">Assistant</p>
              </div>
            </div>

            <button
              onClick={() => navigate('/teachers')}
              className="mt-2 w-full py-2 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors backdrop-blur-sm"
            >
              View Details <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Courses Card */}
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full transform translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full transform -translate-x-12 translate-y-12"></div>

          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <BookOpen size={24} className="text-white" />
              </div>
              <Clock size={20} className="text-white/70" />
            </div>

            <h3 className="text-4xl font-bold text-white mb-1">{stats.courseCount}</h3>
            <p className="text-white/80 text-sm mb-4">Total Courses</p>

            {/* Course Status */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-white/90 text-xs">
                <span className=' flex items-center gap-1'> <UserRoundCheck size={16} /> Courses with Teachers</span>
                <span className="font-bold">{stats.coursesWithTeacher}</span>
              </div>
              <div className="flex items-center justify-between text-white/90 text-xs">
                <span className=' flex items-center gap-1'><UserRoundX size={16} /> Courses without Teachers</span>
                <span className="font-bold">{stats.coursesWithoutTeacher}</span>
              </div>
            </div>

            {/* Status Bar */}
            {stats.courseCount > 0 && (
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-green-300 rounded-full transition-all duration-500"
                  style={{ width: `${(stats.coursesWithTeacher / stats.courseCount) * 100}%` }}
                ></div>
              </div>
            )}

            <button
              onClick={() => navigate('/courses')}
              className="mt-2 w-full py-2 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors backdrop-blur-sm"
            >
              View Details <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Items Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        {/* Recent Students */}
        <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 p-4 sm:p-5 md:p-6 border border-gray-100/80 hover:border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
            <div className="p-1.5 sm:p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors duration-300">
              <Users size={16} sm:size={18} className="text-green-500" />
            </div>
            <span>Recent Students</span>
            <span className="ml-auto text-xs font-normal text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
              {recentItems.recentStudents.length} new
            </span>
          </h3>
          <div className="space-y-2 sm:space-y-3">
            {recentItems.recentStudents.map((student, index) => (
              <div
                key={student._id || index}
                className="flex items-center justify-between p-2 sm:p-2.5 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:from-gray-100 hover:to-gray-50 transition-all duration-200 group/item"
              >
                <div className='flex items-center gap-2 sm:gap-3 min-w-0 flex-1'>
                  <div className="relative flex-shrink-0">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-white shadow-sm group-hover/item:ring-green-100 transition-all duration-200"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full ring-1 ring-white"></div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-800 truncate">{student.name}</p>
                    <p className="text-[10px] sm:text-xs text-gray-500 truncate">{student.email}</p>
                  </div>
                </div>
                <span className="text-[10px] sm:text-xs px-2 sm:px-2.5 py-1 bg-green-50 text-green-600 rounded-full font-medium whitespace-nowrap ml-2 flex-shrink-0">
                  {student.shift}
                </span>
              </div>
            ))}
            {recentItems.recentStudents.length === 0 && (
              <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-center">
                <div className="p-3 bg-gray-50 rounded-full mb-2">
                  <Users size={20} className="text-gray-400" />
                </div>
                <p className="text-xs sm:text-sm text-gray-500">No students found</p>
                <p className="text-[10px] sm:text-xs text-gray-400 mt-1">New students will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Teachers */}
        <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 p-4 sm:p-5 md:p-6 border border-gray-100/80 hover:border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
            <div className="p-1.5 sm:p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors duration-300">
              <GraduationCap size={16} sm:size={18} className="text-purple-500" />
            </div>
            <span>Recent Teachers</span>
            <span className="ml-auto text-xs font-normal text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
              {recentItems.recentTeachers.length} new
            </span>
          </h3>
          <div className="space-y-2 sm:space-y-3">
            {recentItems.recentTeachers.map((teacher, index) => (
              <div
                key={teacher._id || index}
                className="flex items-center justify-between p-2 sm:p-2.5 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:from-gray-100 hover:to-gray-50 transition-all duration-200 group/item"
              >
                <div className='flex items-center gap-2 sm:gap-3 min-w-0 flex-1'>
                  <div className="relative flex-shrink-0">
                    <img
                      src={teacher.avatar}
                      alt={teacher.name}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-white shadow-sm group-hover/item:ring-purple-100 transition-all duration-200"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-purple-500 rounded-full ring-1 ring-white"></div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-800 truncate">{teacher.name}</p>
                    <p className="text-[10px] sm:text-xs text-gray-500 truncate">{teacher.email}</p>
                  </div>
                </div>
                <span className="text-[10px] sm:text-xs px-2 sm:px-2.5 py-1 bg-purple-50 text-purple-600 rounded-full font-medium whitespace-nowrap ml-2 flex-shrink-0">
                  {teacher.post?.split(' ')[0] || 'Teacher'}
                </span>
              </div>
            ))}
            {recentItems.recentTeachers.length === 0 && (
              <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-center">
                <div className="p-3 bg-gray-50 rounded-full mb-2">
                  <GraduationCap size={20} className="text-gray-400" />
                </div>
                <p className="text-xs sm:text-sm text-gray-500">No teachers found</p>
                <p className="text-[10px] sm:text-xs text-gray-400 mt-1">New teachers will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Courses */}
        <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 p-4 sm:p-5 md:p-6 border border-gray-100/80 hover:border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
            <div className="p-1.5 sm:p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors duration-300">
              <BookOpen size={16} sm:size={18} className="text-blue-500" />
            </div>
            <span>Recent Courses</span>
            <span className="ml-auto text-xs font-normal text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
              {recentItems.recentCourses.length} new
            </span>
          </h3>
          <div className="space-y-2 sm:space-y-3">
            {recentItems.recentCourses.map((course, index) => (
              <div
                key={course._id || index}
                className="flex items-center justify-between p-2 sm:p-2.5 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:from-gray-100 hover:to-gray-50 transition-all duration-200 group/item"
              >
                <div className='flex items-center gap-2 sm:gap-3 min-w-0 flex-1'>
                  <div className="relative flex-shrink-0">
                    <img
                      src={course.imageURL}
                      alt={course.title}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover ring-2 ring-white shadow-sm group-hover/item:ring-blue-100 transition-all duration-200"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-800 truncate">{course.title}</p>
                    <p className="text-[10px] sm:text-xs text-gray-500 truncate max-w-[120px] sm:max-w-[150px] md:max-w-[180px]">
                      {course.description}
                    </p>
                  </div>
                </div>
                <span className={`text-[10px] sm:text-xs px-2 sm:px-2.5 py-1 rounded-full font-medium whitespace-nowrap ml-2 flex-shrink-0 ${course.teacher?.length > 0
                  ? 'bg-green-50 text-green-600'
                  : 'bg-gray-100 text-gray-600'
                  }`}>
                  {course.teacher?.length > 0
                    ? `${course.teacher.length} Tutor${course.teacher.length > 1 ? 's' : ''}`
                    : 'No tutors'
                  }
                </span>
              </div>
            ))}
            {recentItems.recentCourses.length === 0 && (
              <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-center">
                <div className="p-3 bg-gray-50 rounded-full mb-2">
                  <BookOpen size={20} className="text-gray-400" />
                </div>
                <p className="text-xs sm:text-sm text-gray-500">No courses found</p>
                <p className="text-[10px] sm:text-xs text-gray-400 mt-1">New courses will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-2xl shadow-xl border border-gray-100 p-8 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Quick Actions</h3>
            <p className="text-sm text-gray-500">Manage your platform efficiently</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center">
            <Zap size={24} className="text-blue-600" />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate('/courses/new')}
            className="group flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl
                 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105
                 active:scale-95
                 transition-all duration-200 font-medium text-sm
                 border border-blue-600 hover:border-blue-700"
          >
            <PlusCircle size={18} className="group-hover:rotate-90 transition-transform duration-300" />
            New Course
          </button>

          <button
            onClick={() => navigate('/students/new')}
            className="group flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl
                 hover:shadow-lg hover:shadow-green-500/30 hover:scale-105
                 active:scale-95
                 transition-all duration-200 font-medium text-sm
                 border border-green-600 hover:border-green-700"
          >
            <PlusCircle size={18} className="group-hover:rotate-90 transition-transform duration-300" />
            Add Student
          </button>

          <button
            onClick={() => navigate('/teachers/new')}
            className="group flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl
                 hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105
                 active:scale-95
                 transition-all duration-200 font-medium text-sm
                 border border-purple-600 hover:border-purple-700"
          >
            <PlusCircle size={18} className="group-hover:rotate-90 transition-transform duration-300" />
            Add Teacher
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;