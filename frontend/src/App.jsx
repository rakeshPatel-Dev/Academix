// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import CreateCourse from './pages/course/CreateCourse';
import EditCourse from './pages/course/EditCourse';
import CreateTeacher from './pages/teacher/CreateTeacher';
import EditTeacher from './pages/teacher/EditTeacher';
import CreateStudent from './pages/student/CreateStudent';
import EditStudent from './pages/student/EditStudent';
import StudentProfile from './pages/profiles/StudentProfile';
import CourseProfile from './pages/profiles/CourseProfile';
import TeacherProfile from './pages/profiles/TeacherProfile';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminProfile from './pages/Profile';

// Layout for authenticated pages (with sidebar)
function AuthenticatedLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

// Layout for auth pages (full screen, no sidebar)
function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (isAuthPage) {
    return (
      <AuthLayout>
        <Toaster position='top-center' />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Redirect any other auth routes to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <Toaster position='top-center' />
      <Routes>
        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        {/* Courses Routes */}
        <Route path="/courses" element={
          <ProtectedRoute>
            <Courses />
          </ProtectedRoute>
        } />
        <Route path="/courses/new" element={
          <ProtectedRoute>
            <CreateCourse />
          </ProtectedRoute>
        } />
        <Route path="/courses/edit/:id" element={
          <ProtectedRoute>
            <EditCourse />
          </ProtectedRoute>
        } />
        <Route path="/courses/:id" element={
          <ProtectedRoute>
            <CourseProfile />
          </ProtectedRoute>
        } />

        {/* Teachers Routes */}
        <Route path="/teachers" element={
          <ProtectedRoute>
            <Teachers />
          </ProtectedRoute>
        } />
        <Route path="/teachers/new" element={
          <ProtectedRoute>
            <CreateTeacher />
          </ProtectedRoute>
        } />
        <Route path="/teachers/edit/:id" element={
          <ProtectedRoute>
            <EditTeacher />
          </ProtectedRoute>
        } />
        <Route path="/teachers/:id" element={
          <ProtectedRoute>
            <TeacherProfile />
          </ProtectedRoute>
        } />

        {/* Students Routes */}
        <Route path="/students" element={
          <ProtectedRoute>
            <Students />
          </ProtectedRoute>
        } />
        <Route path="/students/new" element={
          <ProtectedRoute>
            <CreateStudent />
          </ProtectedRoute>
        } />
        <Route path="/students/edit/:id" element={
          <ProtectedRoute>
            <EditStudent />
          </ProtectedRoute>
        } />
        <Route path="/students/:id" element={
          <ProtectedRoute>
            <StudentProfile />
          </ProtectedRoute>
        } />

        {/* Profile Route */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <AdminProfile />
          </ProtectedRoute>
        } />

        {/* Catch all other routes - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthenticatedLayout>
  );
}

function App() {
  return (
    <AppContent />
  );
}

export default App;