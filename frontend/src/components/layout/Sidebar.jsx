// components/Sidebar.jsx
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
  Bell,
  Menu,
  X
} from 'lucide-react';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Mock user data - replace with actual auth context
  const user = {
    name: 'John Doe',
    email: 'john@academix.com',
    role: 'Administrator',
    avatar: null // or URL to avatar image
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
      badge: '12', // Dynamic count
      color: 'green'
    },
    {
      title: 'Students',
      icon: <Users size={20} />,
      path: '/students',
      badge: '156', // Dynamic count
      color: 'cyan'
    },
    {
      title: 'Teachers',
      icon: <GraduationCap size={20} />,
      path: '/teachers',
      badge: '24', // Dynamic count
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
      {/* Mobile menu button */}
      <button
        onClick={toggleMobile}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md hover:bg-gray-50"
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white shadow-xl z-50
          transition-all duration-300 ease-in-out
          ${collapsed ? 'w-20' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
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
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
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
                <span className="text-white font-bold text-xl">A</span>
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
                    <span className="flex-shrink-0">{item.icon}</span>
                    {!collapsed && (
                      <span className="text-sm font-medium">{item.title}</span>
                    )}
                  </div>
                  {!collapsed && item.badge && (
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
          {/* Notifications - Optional extra */}
          {!collapsed && (
            <button className="w-full flex items-center justify-between px-3 py-2 mb-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <Bell size={18} />
                <span className="text-sm">Notifications</span>
              </div>
              <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">3</span>
            </button>
          )}

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
                  <span className="flex-shrink-0">{item.icon}</span>
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
            <div className="flex-shrink-0">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.name.charAt(0)}
                </div>
              )}
            </div>

            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.role}</p>
              </div>
            )}

            <button
              onClick={() => console.log('Logout clicked')}
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

      {/* Main content padding */}
      <div className={`
        transition-all duration-300
        ${collapsed ? 'lg:ml-20' : 'lg:ml-64'}
        ml-0
      `}>
        {/* Your main content goes here */}
      </div>
    </>
  );
};

export default Sidebar;