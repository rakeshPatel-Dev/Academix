// pages/Teachers.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  BookOpen,
  Edit,
  Trash2,
  Plus,
  Search,
  ChevronRight,
  User,
  Calendar
} from 'lucide-react';

const Teachers = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - Replace with actual API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTeachers([
        {
          id: 1,
          name: 'Dr. Sarah Wilson',
          email: 'sarah.wilson@academix.edu',
          phone: '+1 (555) 123-4567',
          address: '123 University Ave, Boston, MA 02115',
          post: 'Professor',
          courseId: 1,
          courseName: 'Mathematics 101',
          courseImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
          avatar: 'https://images.unsplash.com/photo-1494790108777-766d1f0f3f7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
          joinDate: 'Jan 2020',
          studentsCount: 156
        },
        {
          id: 2,
          name: 'Prof. James Brown',
          email: 'james.brown@academix.edu',
          phone: '+1 (555) 234-5678',
          address: '456 College St, Boston, MA 02115',
          post: 'Associate Professor',
          courseId: 2,
          courseName: 'Physics Fundamentals',
          courseImage: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
          joinDate: 'Mar 2019',
          studentsCount: 98
        },
        {
          id: 3,
          name: 'Prof. Emily Davis',
          email: 'emily.davis@academix.edu',
          phone: '+1 (555) 345-6789',
          address: '789 Campus Rd, Boston, MA 02115',
          post: 'Professor',
          courseId: 3,
          courseName: 'English Literature',
          courseImage: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
          joinDate: 'Aug 2018',
          studentsCount: 112
        },
        {
          id: 4,
          name: 'Dr. Michael Chen',
          email: 'michael.chen@academix.edu',
          phone: '+1 (555) 456-7890',
          address: '321 Tech Square, Cambridge, MA 02142',
          post: 'Assistant Professor',
          courseId: 4,
          courseName: 'Computer Science',
          courseImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
          joinDate: 'Feb 2021',
          studentsCount: 203
        },
        {
          id: 5,
          name: 'Prof. Robert Anderson',
          email: 'robert.anderson@academix.edu',
          phone: '+1 (555) 567-8901',
          address: '654 History Ln, Boston, MA 02115',
          post: 'Professor',
          courseId: 5,
          courseName: 'History 201',
          courseImage: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
          joinDate: 'Nov 2017',
          studentsCount: 67
        },
        {
          id: 6,
          name: 'Dr. Lisa White',
          email: 'lisa.white@academix.edu',
          phone: '+1 (555) 678-9012',
          address: '987 Science Park, Boston, MA 02115',
          post: 'Associate Professor',
          courseId: 6,
          courseName: 'Chemistry Basics',
          courseImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
          joinDate: 'Jul 2020',
          studentsCount: 134
        },
        {
          id: 7,
          name: 'Dr. Maria Garcia',
          email: 'maria.garcia@academix.edu',
          phone: '+1 (555) 789-0123',
          address: '147 Bio Lane, Boston, MA 02115',
          post: 'Assistant Professor',
          courseId: 7,
          courseName: 'Biology Fundamentals',
          courseImage: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
          avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
          joinDate: 'Sep 2021',
          studentsCount: 145
        },
        {
          id: 8,
          name: 'Prof. David Lee',
          email: 'david.lee@academix.edu',
          phone: '+1 (555) 890-1234',
          address: '258 Art Avenue, Boston, MA 02115',
          post: 'Professor',
          courseId: 8,
          courseName: 'Art & Design',
          courseImage: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
          avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
          joinDate: 'Apr 2019',
          studentsCount: 89
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter teachers based on search
  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.post.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle delete
  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name}?`)) {
      setTeachers(teachers.filter(teacher => teacher.id !== id));
      // In real app: API call to delete
    }
  };

  // Get post badge color
  const getPostColor = (post) => {
    switch (post) {
      case 'Professor':
        return 'bg-purple-100 text-purple-700';
      case 'Associate Professor':
        return 'bg-blue-100 text-blue-700';
      case 'Assistant Professor':
        return 'bg-green-100 text-green-700';
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
          <h1 className="text-2xl font-bold text-gray-800">Teachers</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all your teachers and their course assignments</p>
        </div>
        <button
          onClick={() => navigate('/teachers/new')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          <span>Add New Teacher</span>
        </button>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-xs text-gray-500">Total Teachers</p>
          <p className="text-xl font-bold text-gray-800">{teachers.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-xs text-gray-500">Professors</p>
          <p className="text-xl font-bold text-purple-600">
            {teachers.filter(t => t.post === 'Professor').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-xs text-gray-500">Associate Professors</p>
          <p className="text-xl font-bold text-blue-600">
            {teachers.filter(t => t.post === 'Associate Professor').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-xs text-gray-500">Assistant Professors</p>
          <p className="text-xl font-bold text-green-600">
            {teachers.filter(t => t.post === 'Assistant Professor').length}
          </p>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search teachers by name, email, post, or course..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Teachers grid */}
      {filteredTeachers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
          <GraduationCap size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No teachers found</p>
          <button
            onClick={() => navigate('/teachers/new')}
            className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Add your first teacher
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Header with avatar and name */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {teacher.avatar ? (
                      <img
                        src={teacher.avatar}
                        alt={teacher.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                        <User size={32} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 truncate">{teacher.name}</h3>
                    <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${getPostColor(teacher.post)}`}>
                      {teacher.post}
                    </span>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <Calendar size={12} />
                      Joined {teacher.joinDate}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact details */}
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail size={14} className="text-gray-400 flex-shrink-0" />
                  <a href={`mailto:${teacher.email}`} className="text-gray-600 hover:text-blue-600 truncate">
                    {teacher.email}
                  </a>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Phone size={14} className="text-gray-400 flex-shrink-0" />
                  <a href={`tel:${teacher.phone}`} className="text-gray-600 hover:text-blue-600">
                    {teacher.phone}
                  </a>
                </div>

                <div className="flex items-start gap-2 text-sm">
                  <MapPin size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">{teacher.address}</span>
                </div>
              </div>

              {/* Assigned Course */}
              <div className="px-4 pb-2">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <BookOpen size={12} />
                    Assigned Course
                  </p>
                  <div className="flex items-center gap-2">
                    <img
                      src={teacher.courseImage}
                      alt={teacher.courseName}
                      className="w-8 h-8 rounded object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{teacher.courseName}</p>
                      <p className="text-xs text-gray-500">{teacher.studentsCount} students</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2">
                <button
                  onClick={() => navigate(`/teachers/edit/${teacher.id}`)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <Edit size={14} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(teacher.id, teacher.name)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
                <button
                  onClick={() => navigate(`/teachers/${teacher.id}`)}
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

export default Teachers;