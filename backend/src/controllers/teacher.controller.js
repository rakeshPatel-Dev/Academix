// controllers/teacher.controller.js
import Teacher from "../models/teacher.model.js";
import Course from "../models/course.model.js";
import Student from "../models/student.model.js";

// @desc    Get all teachers
// @route   GET /api/teachers
export const getAllTeachers = async (req, res) => {
  try {
    // Add pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Add filtering
    const filter = {};
    if (req.query.post) filter.post = req.query.post;
    if (req.query.courseId) filter.coursId = req.query.courseId;

    const teachers = await Teacher.find(filter)
      .populate('coursId', 'title description') // Fixed: coursId not courseTutor
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get student count for each teacher
    const teachersWithStats = await Promise.all(
      teachers.map(async (teacher) => {
        const studentCount = await Student.countDocuments({ teacherId: teacher._id });
        return {
          ...teacher.toObject(),
          studentCount,
        };
      })
    );

    const totalTeachers = await Teacher.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: teachers.length,
      total: totalTeachers,
      totalPages: Math.ceil(totalTeachers / limit),
      currentPage: page,
      data: teachersWithStats,
    });
  } catch (error) {
    console.error('❌ Get teachers error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve teachers",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    Get single teacher by ID
// @route   GET /api/teachers/:id
export const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate('coursId', 'title description');

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    // Get students assigned to this teacher
    const students = await Student.find({ teacherId: teacher._id })
      .select('name email shift courseId')
      .populate('courseId', 'title')
      .sort({ name: 1 });

    // Get course details
    const course = await Course.findById(teacher.coursId);

    res.status(200).json({
      success: true,
      data: {
        ...teacher.toObject(),
        courseDetails: course,
        students,
        stats: {
          totalStudents: students.length,
          studentsByShift: {
            morning: students.filter(s => s.shift === 'Morning').length,
            evening: students.filter(s => s.shift === 'Evening').length,
            weekend: students.filter(s => s.shift === 'Weekend').length,
          }
        }
      },
    });
  } catch (error) {
    console.error('❌ Get teacher error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid teacher ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to retrieve teacher",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    Create new teacher
// @route   POST /api/teachers
export const createTeacher = async (req, res) => {
  try {
    const { name, email, address, phone, coursId, post } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !coursId || !post) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: name, email, phone, coursId, post",
      });
    }

    // Check if teacher with same email exists
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({
        success: false,
        message: "Teacher with this email already exists",
      });
    }

    // Check if course exists
    const courseExists = await Course.findById(coursId);
    if (!courseExists) {
      return res.status(400).json({
        success: false,
        message: "Assigned course does not exist",
      });
    }

    // Check if teacher with same phone exists (optional)
    const existingPhone = await Teacher.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "Teacher with this phone number already exists",
      });
    }

    const teacher = await Teacher.create({
      name,
      email,
      address,
      phone,
      coursId,
      post,
    });

    // Populate course details for response
    await teacher.populate('coursId', 'title');

    res.status(201).json({
      success: true,
      message: "Teacher created successfully",
      data: teacher,
    });
  } catch (error) {
    console.error('❌ Create teacher error:', error);

    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `Teacher with this ${field} already exists`,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create teacher",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    Update teacher
// @route   PUT /api/teachers/:id
export const updateTeacher = async (req, res) => {
  try {
    const { name, email, address, phone, coursId, post } = req.body;

    // Check if teacher exists
    const teacherExists = await Teacher.findById(req.params.id);
    if (!teacherExists) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    // If email is being updated, check if it's taken
    if (email && email !== teacherExists.email) {
      const existingTeacher = await Teacher.findOne({
        email,
        _id: { $ne: req.params.id }
      });

      if (existingTeacher) {
        return res.status(400).json({
          success: false,
          message: "Email already in use by another teacher",
        });
      }
    }

    // If phone is being updated, check if it's taken
    if (phone && phone !== teacherExists.phone) {
      const existingPhone = await Teacher.findOne({
        phone,
        _id: { $ne: req.params.id }
      });

      if (existingPhone) {
        return res.status(400).json({
          success: false,
          message: "Phone number already in use by another teacher",
        });
      }
    }

    // If course is being updated, check if it exists
    if (coursId && coursId !== teacherExists.coursId.toString()) {
      const courseExists = await Course.findById(coursId);
      if (!courseExists) {
        return res.status(400).json({
          success: false,
          message: "Assigned course does not exist",
        });
      }
    }

    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      { name, email, address, phone, coursId, post },
      {
        new: true,
        runValidators: true
      }
    ).populate('coursId', 'title');

    res.status(200).json({
      success: true,
      message: "Teacher updated successfully",
      data: teacher,
    });
  } catch (error) {
    console.error('❌ Update teacher error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid teacher ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update teacher",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    Delete teacher
// @route   DELETE /api/teachers/:id
export const deleteTeacher = async (req, res) => {
  try {
    // Check if teacher exists
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    // Check if teacher has students assigned
    const studentCount = await Student.countDocuments({ teacherId: req.params.id });
    if (studentCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete teacher. They have ${studentCount} student(s) assigned. Please reassign students first.`,
      });
    }

    await Teacher.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Teacher deleted successfully",
    });
  } catch (error) {
    console.error('❌ Delete teacher error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid teacher ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete teacher",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    Get teacher's students
// @route   GET /api/teachers/:id/students
export const getTeacherStudents = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    // Add pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const students = await Student.find({ teacherId: req.params.id })
      .select('name email shift courseId')
      .populate('courseId', 'title')
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit);

    const totalStudents = await Student.countDocuments({ teacherId: req.params.id });

    res.status(200).json({
      success: true,
      count: students.length,
      total: totalStudents,
      totalPages: Math.ceil(totalStudents / limit),
      currentPage: page,
      data: students,
    });
  } catch (error) {
    console.error('❌ Get teacher students error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch teacher's students",
    });
  }
};

// @desc    Get teacher's course details
// @route   GET /api/teachers/:id/course
export const getTeacherCourse = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate('coursId');

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    if (!teacher.coursId) {
      return res.status(404).json({
        success: false,
        message: "Teacher has no course assigned",
      });
    }

    // Get course statistics
    const studentCount = await Student.countDocuments({
      teacherId: teacher._id,
      courseId: teacher.coursId._id
    });

    res.status(200).json({
      success: true,
      data: {
        course: teacher.coursId,
        teacherName: teacher.name,
        studentsEnrolled: studentCount,
      },
    });
  } catch (error) {
    console.error('❌ Get teacher course error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch teacher's course",
    });
  }
};

// @desc    Get teacher statistics
// @route   GET /api/teachers/:id/stats
export const getTeacherStats = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    const [studentCount, studentsByShift] = await Promise.all([
      Student.countDocuments({ teacherId: req.params.id }),
      Student.aggregate([
        { $match: { teacherId: teacher._id } },
        { $group: { _id: "$shift", count: { $sum: 1 } } }
      ])
    ]);

    const shiftStats = {
      morning: 0,
      evening: 0,
      weekend: 0
    };

    studentsByShift.forEach(item => {
      if (item._id === 'Morning') shiftStats.morning = item.count;
      else if (item._id === 'Evening') shiftStats.evening = item.count;
      else if (item._id === 'Weekend') shiftStats.weekend = item.count;
    });

    res.status(200).json({
      success: true,
      data: {
        teacherId: teacher._id,
        teacherName: teacher.name,
        teacherPost: teacher.post,
        courseId: teacher.coursId,
        stats: {
          totalStudents: studentCount,
          studentsByShift: shiftStats,
        },
        contact: {
          email: teacher.email,
          phone: teacher.phone,
        }
      },
    });
  } catch (error) {
    console.error('❌ Get teacher stats error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch teacher statistics",
    });
  }
};