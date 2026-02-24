// pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Users,
  GraduationCap,
  PlusCircle,
  UserPlus,
  BookPlus,
  CalendarPlus,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    courses: 0,
    students: 0,
    teachers: 0,
    recentItems: []
  });

  // Mock data - Replace with actual API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        courses: {
          total: 24,
          active: 18,
          newThisMonth: 3
        },
        students: {
          total: 856,
          morning: 412,
          evening: 328,
          weekend: 116
        },
        teachers: {
          total: 48,
          professors: 12,
          associate: 18,
          assistant: 18
        },
        recentItems: [
          { id: 1, type: 'Student', name: 'John Smith', action: 'Enrolled in Mathematics', time: '5 min ago' },
          { id: 2, type: 'Teacher', name: 'Dr. Sarah Wilson', action: 'Assigned to Physics', time: '15 min ago' },
          { id: 3, type: 'Course', name: 'Advanced Chemistry', action: 'Created new course', time: '1 hour ago' },
          { id: 4, type: 'Student', name: 'Emily Davis', action: 'Completed English', time: '2 hours ago' },
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here's your overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Courses Card */}
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen size={20} className="text-blue-600" />
            </div>
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
              +{stats.courses.newThisMonth} this month
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{stats.courses.total}</h3>
          <p className="text-gray-500 text-sm mb-2">Total Courses</p>
          <div className="text-xs text-gray-500">
            <span className="font-medium text-gray-700">{stats.courses.active} active</span>
          </div>
          <button
            onClick={() => navigate('/courses')}
            className="mt-3 w-full text-left text-blue-600 text-sm hover:text-blue-800 flex items-center gap-1"
          >
            View all courses <ChevronRight size={14} />
          </button>
        </div>

        {/* Students Card */}
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users size={20} className="text-green-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{stats.students.total}</h3>
          <p className="text-gray-500 text-sm mb-2">Total Students</p>
          <div className="flex gap-3 text-xs">
            <span className="text-blue-600">M: {stats.students.morning}</span>
            <span className="text-green-600">E: {stats.students.evening}</span>
            <span className="text-cyan-600">W: {stats.students.weekend}</span>
          </div>
          <button
            onClick={() => navigate('/students')}
            className="mt-3 w-full text-left text-green-600 text-sm hover:text-green-800 flex items-center gap-1"
          >
            View all students <ChevronRight size={14} />
          </button>
        </div>

        {/* Teachers Card */}
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <GraduationCap size={20} className="text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{stats.teachers.total}</h3>
          <p className="text-gray-500 text-sm mb-2">Total Teachers</p>
          <div className="flex gap-3 text-xs">
            <span className="text-blue-600">Prof: {stats.teachers.professors}</span>
            <span className="text-green-600">Assoc: {stats.teachers.associate}</span>
            <span className="text-amber-600">Asst: {stats.teachers.assistant}</span>
          </div>
          <button
            onClick={() => navigate('/teachers')}
            className="mt-3 w-full text-left text-purple-600 text-sm hover:text-purple-800 flex items-center gap-1"
          >
            View all teachers <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
        <h3 className="font-medium text-gray-700 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => navigate('/courses/new')}
            className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <BookPlus size={18} className="text-blue-600" />
            <span className="text-sm font-medium text-blue-700">New Course</span>
          </button>
          <button
            onClick={() => navigate('/students/new')}
            className="flex items-center gap-2 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <UserPlus size={18} className="text-green-600" />
            <span className="text-sm font-medium text-green-700">Add Student</span>
          </button>
          <button
            onClick={() => navigate('/teachers/new')}
            className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <GraduationCap size={18} className="text-purple-600" />
            <span className="text-sm font-medium text-purple-700">Add Teacher</span>
          </button>
          <button
            onClick={() => navigate('/schedule')}
            className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
          >
            <CalendarPlus size={18} className="text-amber-600" />
            <span className="text-sm font-medium text-amber-700">Schedule</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-gray-700">Recent Activity</h3>
          <button className="text-sm text-blue-600 hover:text-blue-800">View all</button>
        </div>
        <div className="space-y-3">
          {stats.recentItems.map((item) => (
            <div key={item.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
              <div className={`p-1.5 rounded-full ${item.type === 'Student' ? 'bg-green-100' :
                item.type === 'Teacher' ? 'bg-purple-100' : 'bg-blue-100'
                }`}>
                {item.type === 'Student' && <Users size={14} className="text-green-600" />}
                {item.type === 'Teacher' && <GraduationCap size={14} className="text-purple-600" />}
                {item.type === 'Course' && <BookOpen size={14} className="text-blue-600" />}
              </div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium text-gray-800">{item.name}</span>
                  <span className="text-gray-500"> {item.action}</span>
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500">Active Courses</p>
          <p className="text-lg font-bold text-gray-800">{stats.courses.active}/{stats.courses.total}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500">Morning Students</p>
          <p className="text-lg font-bold text-blue-600">{stats.students.morning}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500">Evening Students</p>
          <p className="text-lg font-bold text-green-600">{stats.students.evening}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500">Professors</p>
          <p className="text-lg font-bold text-purple-600">{stats.teachers.professors}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;