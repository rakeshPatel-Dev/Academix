import React from 'react'
import SimpleSidebar from './components/layout/Sidebar'
import Sidebar from './components/layout/Sidebar'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Courses from './pages/Courses'
import Teachers from './pages/Teachers'
import Students from './pages/Students'
import AddCourse from './pages/CreateCourse'

const App = () => {
  return (

    <div>
      <Sidebar />
      <Routes>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/courses' element={<Courses />} />
        <Route path='/teachers' element={<Teachers />} />
        <Route path='/students' element={<Students />} />
        <Route path='/courses/new' element={<AddCourse />} />
      </Routes>
    </div>
  )
}

export default App
