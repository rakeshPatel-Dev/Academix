// pages/Students.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Mail,
  Phone,
  MapPin,
  Clock,
  BookOpen,
  Edit,
  Trash2,
  Plus,
  Search,
  ChevronRight,
  User,
  Calendar
} from 'lucide-react';

const Students = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - Replace with actual API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStudents([
        {
          id: 1,
          name: 'John Smith',
          email: 'john.smith@student.academix.edu',
          phone: '+1 (555) 123-4567',
          address: '123 College Ave, Boston, MA 02115',
          shift: 'Morning',
          shiftColor: 'blue',
          image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
          courses: [
            { id: 1, name: 'Mathematics 101', image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80' },
            { id: 2, name: 'Physics Fundamentals', image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80' }
          ],
          enrollmentDate: 'Jan 2024'
        },
        {
          id: 2,
          name: 'Emily Davis',
          email: 'emily.davis@student.academix.edu',
          phone: '+1 (555) 234-5678',
          address: '456 University Rd, Boston, MA 02115',
          shift: 'Evening',
          shiftColor: 'green',
          image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
          courses: [
            { id: 3, name: 'English Literature', image: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80' },
            { id: 5, name: 'History 201', image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80' }
          ],
          enrollmentDate: 'Feb 2024'
        },
        {
          id: 3,
          name: 'Michael Johnson',
          email: 'michael.johnson@student.academix.edu',
          phone: '+1 (555) 345-6789',
          address: '789 Campus Dr, Boston, MA 02115',
          shift: 'Morning',
          shiftColor: 'blue',
          image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
          courses: [
            { id: 4, name: 'Computer Science', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80' },
            { id: 6, name: 'Chemistry Basics', image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80' }
          ],
          enrollmentDate: 'Mar 2024'
        },
        {
          id: 4,
          name: 'Sarah Williams',
          email: 'sarah.williams@student.academix.edu',
          phone: '+1 (555) 456-7890',
          address: '321 Student Ln, Boston, MA 02115',
          shift: 'Weekend',
          shiftColor: 'purple',
          image: 'https://images.unsplash.com/photo-1494790108777-766d1f0f3f7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
          courses: [
            { id: 7, name: 'Biology Fundamentals', image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80' },
            { id: 8, name: 'Art & Design', image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80' }
          ],
          enrollmentDate: 'Jan 2024'
        },
        {
          id: 5,
          name: 'David Brown',
          email: 'david.brown@student.academix.edu',
          phone: '+1 (555) 567-8901',
          address: '654 College Ave, Boston, MA 02115',
          shift: 'Evening',
          shiftColor: 'green',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
          courses: [
            { id: 1, name: 'Mathematics 101', image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80' },
            { id: 3, name: 'English Literature', image: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80' }
          ],
          enrollmentDate: 'Feb 2024'
        },
        {
          id: 6,
          name: 'Lisa Garcia',
          email: 'lisa.garcia@student.academix.edu',
          phone: '+1 (555) 678-9012',
          address: '987 Student St, Boston, MA 02115',
          shift: 'Morning',
          shiftColor: 'blue',
          image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
          courses: [
            { id: 2, name: 'Physics Fundamentals', image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80' },
            { id: 4, name: 'Computer Science', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80' }
          ],
          enrollmentDate: 'Apr 2024'
        },
        {
          id: 7,
          name: 'James Wilson',
          email: 'james.wilson@student.academix.edu',
          phone: '+1 (555) 789-0123',
          address: '147 Campus Rd, Boston, MA 02115',
          shift: 'Weekend',
          shiftColor: 'purple',
          image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
          courses: [
            { id: 5, name: 'History 201', image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80' },
            { id: 7, name: 'Biology Fundamentals', image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80' }
          ],
          enrollmentDate: 'Mar 2024'
        },
        {
          id: 8,
          name: 'Emma Taylor',
          email: 'emma.taylor@student.academix.edu',
          phone: '+1 (555) 890-1234',
          address: '258 University Ave, Boston, MA 02115',
          shift: 'Evening',
          shiftColor: 'green',
          image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
          courses: [
            { id: 6, name: 'Chemistry Basics', image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80' },
            { id: 8, name: 'Art & Design', image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80' }
          ],
          enrollmentDate: 'Feb 2024'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter students based on search
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.shift.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.courses.some(course => course.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Handle delete
  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name}?`)) {
      setStudents(students.filter(student => student.id !== id));
      // In real app: API call to delete
    }
  };

  // Get shift badge color
  const getShiftColor = (shift) => {
    switch (shift) {
      case 'Morning':
        return 'bg-blue-100 text-blue-700';
      case 'Evening':
        return 'bg-green-100 text-green-700';
      case 'Weekend':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header with title and add button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Students</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all your students and their course enrollments</p>
        </div>
        <button
          onClick={() => navigate('/students/new')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          <span>Add New Student</span>
        </button>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-xs text-gray-500">Total Students</p>
          <p className="text-xl font-bold text-gray-800">{students.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-xs text-gray-500">Morning Shift</p>
          <p className="text-xl font-bold text-blue-600">
            {students.filter(s => s.shift === 'Morning').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-xs text-gray-500">Evening Shift</p>
          <p className="text-xl font-bold text-green-600">
            {students.filter(s => s.shift === 'Evening').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-xs text-gray-500">Weekend Shift</p>
          <p className="text-xl font-bold text-purple-600">
            {students.filter(s => s.shift === 'Weekend').length}
          </p>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search students by name, email, shift, or course..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Students grid */}
      {filteredStudents.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
          <Users size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No students found</p>
          <button
            onClick={() => navigate('/students/new')}
            className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Add your first student
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Header with image and name */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {student.image ? (
                      <img
                        src={student.image}
                        alt={student.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                        <User size={32} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 truncate">{student.name}</h3>
                    <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${getShiftColor(student.shift)}`}>
                      <Clock size={10} className="inline mr-1" />
                      {student.shift} Shift
                    </span>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <Calendar size={12} />
                      Enrolled {student.enrollmentDate}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact details */}
              <div className="p-4 space-y-2 border-b border-gray-100">
                <div className="flex items-center gap-2 text-sm">
                  <Mail size={14} className="text-gray-400 flex-shrink-0" />
                  <a href={`mailto:${student.email}`} className="text-gray-600 hover:text-blue-600 truncate">
                    {student.email}
                  </a>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Phone size={14} className="text-gray-400 flex-shrink-0" />
                  <a href={`tel:${student.phone}`} className="text-gray-600 hover:text-blue-600">
                    {student.phone}
                  </a>
                </div>

                <div className="flex items-start gap-2 text-sm">
                  <MapPin size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 text-sm">{student.address}</span>
                </div>
              </div>

              {/* Courses Enrolled */}
              <div className="p-4">
                <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                  <BookOpen size={12} />
                  Courses Enrolled ({student.courses.length})
                </p>
                <div className="space-y-2">
                  {student.courses.map((course) => (
                    <div key={course.id} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                      <img
                        src={course.image}
                        alt={course.name}
                        className="w-6 h-6 rounded object-cover"
                      />
                      <span className="text-xs text-gray-700">{course.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2">
                <button
                  onClick={() => navigate(`/students/edit/${student.id}`)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <Edit size={14} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(student.id, student.name)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
                <button
                  onClick={() => navigate(`/students/${student.id}`)}
                  className="px-3 py-2 text-sm text-gray-500 hover:bg-gray-200 rounded-lg transition-colors"
                  title="View details"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Students;