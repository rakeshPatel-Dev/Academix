// pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Users,
  GraduationCap,
  PlusCircle,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    courses: 0,
    students: 0,
    teachers: 0,
    recentItems: []
  });

  // Fetch real data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all stats in parallel
        const [coursesRes, studentsRes, teachersRes] = await Promise.all([
          axios.get(`${API_URL}/courses`),
          axios.get(`${API_URL}/students`),
          axios.get(`${API_URL}/teachers`)
        ]);

        // Extract data
        const coursesData = coursesRes.data.data || coursesRes.data;
        const studentsData = studentsRes.data.data || studentsRes.data;
        const teachersData = teachersRes.data.data || teachersRes.data;

        // Calculate stats
        const totalCourses = Array.isArray(coursesData) ? coursesData.length : coursesData.total || 0;
        const totalStudents = Array.isArray(studentsData) ? studentsData.length : studentsData.total || 0;
        const totalTeachers = Array.isArray(teachersData) ? teachersData.length : teachersData.total || 0;

        // Morning/Evening count
        const morningStudents = Array.isArray(studentsData)
          ? studentsData.filter(s => s.shift === 'morning').length
          : 0;
        const eveningStudents = Array.isArray(studentsData)
          ? studentsData.filter(s => s.shift === 'evening').length
          : 0;

        // Professor counts
        const professors = Array.isArray(teachersData)
          ? teachersData.filter(t => t.post === 'Professor').length
          : 0;

        setStats({
          courses: totalCourses,
          students: totalStudents,
          teachers: totalTeachers,
          morning: morningStudents,
          evening: eveningStudents,
          professors: professors,
          recentItems: [
            { id: 1, type: 'System', action: 'Dashboard loaded', time: 'Just now' }
          ]
        });

        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening.</p>
      </div>

      {/* Main Stats Cards - 3 only */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Courses Card */}
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen size={20} className="text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{stats.courses}</h3>
          <p className="text-gray-500 text-sm mb-2">Total Courses</p>
          <button
            onClick={() => navigate('/courses')}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            View all <ChevronRight size={14} />
          </button>
        </div>

        {/* Students Card */}
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users size={20} className="text-green-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{stats.students}</h3>
          <p className="text-gray-500 text-sm mb-2">Total Students</p>
          <div className="flex gap-3 text-xs text-gray-500">
            <span>Morning: <span className="font-medium text-blue-600">{stats.morning}</span></span>
            <span>Evening: <span className="font-medium text-green-600">{stats.evening}</span></span>
          </div>
          <button
            onClick={() => navigate('/students')}
            className="mt-2 text-sm text-green-600 hover:text-green-800 flex items-center gap-1"
          >
            View all <ChevronRight size={14} />
          </button>
        </div>

        {/* Teachers Card */}
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <GraduationCap size={20} className="text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{stats.teachers}</h3>
          <p className="text-gray-500 text-sm mb-2">Total Teachers</p>
          <div className="text-xs text-gray-500">
            <span>Professors: <span className="font-medium text-purple-600">{stats.professors}</span></span>
          </div>
          <button
            onClick={() => navigate('/teachers')}
            className="mt-2 text-sm text-purple-600 hover:text-purple-800 flex items-center gap-1"
          >
            View all <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Quick Actions - Simple Row */}
      <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
        <h3 className="font-medium text-gray-700 mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate('/courses/new')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm"
          >
            <PlusCircle size={16} />
            New Course
          </button>
          <button
            onClick={() => navigate('/students/new')}
            className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm"
          >
            <PlusCircle size={16} />
            Add Student
          </button>
          <button
            onClick={() => navigate('/teachers/new')}
            className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm"
          >
            <PlusCircle size={16} />
            Add Teacher
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;