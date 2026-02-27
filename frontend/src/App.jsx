// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import CreateCourse from './pages/course/CreateCourse';
import EditCourse from './pages/course/EditCourse';
import CreateTeacher from './pages/teacher/CreateTeacher';
import EditTeacher from './pages/teacher/EditTeacher';

function App() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - fixed width, no content goes under it */}
      <Sidebar />

      {/* Main Content - Gets proper margin based on sidebar state */}
      <main className="flex-1 p-6 overflow-auto">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/new" element={<CreateCourse />} />
          <Route path="/courses/edit/:id" element={<EditCourse />} />
          <Route path="/students" element={<Students />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/teachers/new" element={<CreateTeacher />} />
          <Route path="/teachers/edit/:id" element={<EditTeacher />} />

          <Route path="/" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;