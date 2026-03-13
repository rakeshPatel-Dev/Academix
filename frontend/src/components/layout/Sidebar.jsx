// components/Sidebar.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  UserCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Settings,
  Menu,
  X
} from 'lucide-react';
import useFetchMultipleApis from '../../hooks/useDataLength';
import toast from 'react-hot-toast';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  // Memoize the urls object to prevent recreation on every render
  const apiUrls = useMemo(() => {
    if (!isAuthenticated) return {};

    return {
      teachers: "http://localhost:3000/api/teachers",
      students: "http://localhost:3000/api/students",
      courses: "http://localhost:3000/api/courses",
    };
  }, [isAuthenticated]); // Only recreate when isAuthenticated changes

  const { totals, loading, error } = useFetchMultipleApis(apiUrls);

  // Handle error toast
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Don't render sidebar if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Or access individual totals
  const teacherCount = totals.teachers || 0;
  const studentCount = totals.students || 0;
  const courseCount = totals.courses || 0;

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logout successful!');
    } catch (logoutError) {
      toast.error('Logout failed. Please try again.', logoutError);
    }
  };

  const navigationItems = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      path: '/dashboard',
      badge: null,
      color: 'blue'
    },
    {
      title: 'Courses',
      icon: <BookOpen size={20} />,
      path: '/courses',
      badge: courseCount,
      color: 'green'
    },
    {
      title: 'Students',
      icon: <Users size={20} />,
      path: '/students',
      badge: studentCount,
      color: 'cyan'
    },
    {
      title: 'Teachers',
      icon: <GraduationCap size={20} />,
      path: '/teachers',
      badge: teacherCount,
      color: 'purple'
    }
  ];

  const bottomItems = [
    {
      title: 'Profile',
      icon: <UserCircle size={20} />,
      path: '/profile',
      color: 'gray'
    },
    {
      title: 'Settings',
      icon: <Settings size={20} />,
      path: '/settings',
      color: 'gray'
    }
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobile = () => {
    setMobileOpen(!mobileOpen);
  };

  // Get color classes based on item color
  const getColorClasses = (color, isActive) => {
    const colors = {
      blue: {
        active: 'bg-blue-50 text-blue-600 border-l-4 border-blue-600',
        inactive: 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
      },
      green: {
        active: 'bg-green-50 text-green-600 border-l-4 border-green-600',
        inactive: 'text-gray-600 hover:bg-gray-50 hover:text-green-600'
      },
      cyan: {
        active: 'bg-cyan-50 text-cyan-600 border-l-4 border-cyan-600',
        inactive: 'text-gray-600 hover:bg-gray-50 hover:text-cyan-600'
      },
      purple: {
        active: 'bg-purple-50 text-purple-600 border-l-4 border-purple-600',
        inactive: 'text-gray-600 hover:bg-gray-50 hover:text-purple-600'
      },
      gray: {
        active: 'bg-gray-100 text-gray-900 border-l-4 border-gray-600',
        inactive: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }
    };
    return colors[color][isActive ? 'active' : 'inactive'];
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobile}
        className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-white rounded-lg shadow-md"
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={toggleMobile}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
      fixed top-0 left-0 h-screen bg-white shadow-xl z-50
      transition-all duration-300 ease-in-out
      
      ${collapsed ? "lg:w-20" : "lg:w-64"}
      w-64
      
      ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
    `}
      >
        {/* Logo Area */}
        <div className={`
          flex items-center h-16 px-4 border-b border-gray-200
          ${collapsed ? 'justify-center' : 'justify-between'}
        `}>
          {!collapsed ? (
            <>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-linear-to-r from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <span className="font-bold text-xl text-gray-800">AcademiX</span>
              </div>
              <button
                onClick={toggleSidebar}
                className="p-1 rounded-lg hover:bg-gray-100 hidden lg:block"
              >
                <ChevronLeft size={20} className="text-gray-500" />
              </button>
            </>
          ) : (
            <>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">{user?.name?.charAt(0) || 'A'}</span>
              </div>
              <button
                onClick={toggleSidebar}
                className="p-1 rounded-lg hover:bg-gray-100 hidden lg:block absolute -right-3 top-5 bg-white shadow-md"
              >
                <ChevronRight size={16} className="text-gray-500" />
              </button>
            </>
          )}
        </div>

        {/* Loading indicator for data */}
        {loading && (
          <div className="absolute top-16 left-0 right-0 h-1 bg-gray-100 overflow-hidden">
            <div className="h-full bg-blue-600 animate-pulse" style={{ width: '30%' }}></div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 h-[calc(100%-8rem)]">
          <ul className="space-y-1">
            {navigationItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => `
                    flex items-center ${collapsed ? 'justify-center' : 'justify-between'} 
                    px-3 py-2.5 rounded-lg transition-all duration-200
                    ${getColorClasses(item.color, location.pathname === item.path)}
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <span className="shrink-0">{item.icon}</span>
                    {!collapsed && (
                      <span className="text-sm font-medium">{item.title}</span>
                    )}
                  </div>
                  {!collapsed && item.badge !== null && item.badge > 0 && (
                    <span className={`
                      px-2 py-0.5 text-xs font-medium rounded-full
                      ${location.pathname === item.path
                        ? 'bg-white bg-opacity-30'
                        : 'bg-gray-100 text-gray-600'
                      }
                    `}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Section - Profile & Logout */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-3">
          {/* Bottom Navigation Items */}
          <ul className="space-y-1 mb-2">
            {bottomItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => `
                    flex items-center ${collapsed ? 'justify-center' : 'justify-start'} 
                    px-3 py-2 rounded-lg transition-all duration-200
                    ${getColorClasses(item.color, location.pathname === item.path)}
                  `}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {!collapsed && (
                    <span className="ml-3 text-sm">{item.title}</span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* User Profile */}
          <div className={`
            flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} 
            p-2 bg-gray-50 rounded-lg
          `}>
            <div className="shrink-0">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3b82f6&color=fff`
                  }}
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0) || 'A'}
                </div>
              )}
            </div>

            {!collapsed && user && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">Administrator</p>
              </div>
            )}

            <button
              onClick={handleLogout}
              className={`
                p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors
                ${collapsed ? 'ml-0' : ''}
              `}
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;