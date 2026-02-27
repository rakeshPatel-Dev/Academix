// controllers/student.controller.js
import Student from "../models/student.model.js";
import Course from "../models/course.model.js";
import mongoose from "mongoose";

// @desc    Get all students
// @route   GET /api/students
export const getAllStudents = async (req, res) => {
  try {
    // Add pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Add filtering by shift
    const filter = {};
    if (req.query.shift) filter.shift = req.query.shift;

    const students = await Student.find(filter)
      .populate('courses', 'title imageURL description') // Get course details
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalStudents = await Student.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: students.length,
      total: totalStudents,
      totalPages: Math.ceil(totalStudents / limit),
      currentPage: page,
      data: students,
    });
  } catch (error) {
    console.error('❌ Get students error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch students",
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

// @desc    Get all students WITHOUT pagination (for dropdowns)
// @route   GET /api/students/all
export const getAllStudentsForDropdown = async (req, res) => {
  try {
    const students = await Student.find()
      .select('name email avatar shift') // Only select needed fields
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    console.error('❌ Get all students error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch students",
    });
  }
};

// @desc    Get single student by ID
// @route   GET /api/students/:id
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('courses', 'title imageURL description');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error('❌ Get student error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch student",
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

// @desc    Create new student
// @route   POST /api/students
export const createStudent = async (req, res) => {
  try {
    const { name, email, phone, address, courses, shift, avatar } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !shift) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: name, email, phone, shift",
      });
    }

    // Validate shift enum
    if (!['morning', 'evening'].includes(shift)) {
      return res.status(400).json({
        success: false,
        message: "Shift must be either 'morning' or 'evening'",
      });
    }

    // Check if student already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Student with this email already exists",
      });
    }

    // Validate courses if provided
    if (courses && courses.length > 0) {
      const validCourses = await Course.find({ _id: { $in: courses } });
      if (validCourses.length !== courses.length) {
        return res.status(400).json({
          success: false,
          message: "One or more course IDs are invalid",
        });
      }
    }

    const student = await Student.create({
      name,
      email,
      address,
      phone,
      courses: courses || [],
      shift,
      avatar: avatar || null, // Add avatar field
    });

    // Populate courses for response
    await student.populate('courses', 'title imageURL');

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: student,
    });
  } catch (error) {
    console.error('❌ Create student error:', error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Student with this email already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create student",
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
export const updateStudent = async (req, res) => {
  try {
    const { name, email, phone, address, courses, shift, avatar } = req.body;

    // Check if student exists
    const studentExists = await Student.findById(req.params.id);
    if (!studentExists) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Validate shift if provided
    if (shift && !['morning', 'evening'].includes(shift)) {
      return res.status(400).json({
        success: false,
        message: "Shift must be either 'morning' or 'evening'",
      });
    }

    // If email is being updated, check if it's taken
    if (email && email !== studentExists.email) {
      const existingStudent = await Student.findOne({
        email,
        _id: { $ne: req.params.id }
      });

      if (existingStudent) {
        return res.status(400).json({
          success: false,
          message: "Email already in use by another student",
        });
      }
    }

    // Validate courses if provided
    if (courses && courses.length > 0) {
      const validCourses = await Course.find({ _id: { $in: courses } });
      if (validCourses.length !== courses.length) {
        return res.status(400).json({
          success: false,
          message: "One or more course IDs are invalid",
        });
      }
    }

    // Build update object dynamically
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (shift !== undefined) updateData.shift = shift;
    if (avatar !== undefined) updateData.avatar = avatar; // Add avatar to update
    if (courses !== undefined) updateData.courses = courses;

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).populate('courses', 'title imageURL');

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: student,
    });
  } catch (error) {
    console.error('❌ Update student error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID format",
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already in use by another student",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update student",
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Optional: Check if student has any dependencies
    // For example, if you have attendance records, grades, etc.
    // const attendanceCount = await Attendance.countDocuments({ studentId: req.params.id });
    // if (attendanceCount > 0) {
    //   return res.status(400).json({
    //     success: false,
    //     message: `Cannot delete student. They have ${attendanceCount} attendance records.`,
    //   });
    // }


    await Student.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error('❌ Delete student error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete student",
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

// @desc    Search students by query
// @route   GET /api/students/search?q=john&page=1&limit=10
export const searchStudents = async (req, res) => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!q || q.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "Please provide a search query"
      });
    }

    // Sanitize search term
    const sanitizedQuery = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const searchQuery = {
      $or: [
        { name: { $regex: sanitizedQuery, $options: "i" } },
        { email: { $regex: sanitizedQuery, $options: "i" } },
        { phone: { $regex: sanitizedQuery, $options: "i" } },
        { address: { $regex: sanitizedQuery, $options: "i" } },
        { shift: { $regex: sanitizedQuery, $options: "i" } }
      ]
    };

    const [students, totalCount] = await Promise.all([
      Student.find(searchQuery)
        .populate('courses', 'title imageURL')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Student.countDocuments(searchQuery)
    ]);

    res.status(200).json({
      success: true,
      data: students,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1
      },
      searchTerm: q
    });

  } catch (error) {
    console.error("❌ Student search error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search students",
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};

// @desc    Get students by shift
// @route   GET /api/students/shift/:shift
export const getStudentsByShift = async (req, res) => {
  try {
    const { shift } = req.params;

    if (!['morning', 'evening'].includes(shift)) {
      return res.status(400).json({
        success: false,
        message: "Shift must be either 'morning' or 'evening'",
      });
    }

    const students = await Student.find({ shift })
      .populate('courses', 'title imageURL')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    console.error('❌ Get students by shift error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch students",
    });
  }
};

// @desc    Get student statistics
// @route   GET /api/students/stats/overview
export const getStudentStats = async (req, res) => {
  try {
    const stats = await Student.aggregate([
      {
        $group: {
          _id: null,
          totalStudents: { $sum: 1 },
          morningShift: {
            $sum: { $cond: [{ $eq: ["$shift", "morning"] }, 1, 0] }
          },
          eveningShift: {
            $sum: { $cond: [{ $eq: ["$shift", "evening"] }, 1, 0] }
          },
          withCourses: {
            $sum: { $cond: [{ $gt: [{ $size: "$courses" }, 0] }, 1, 0] }
          },
          withoutCourses: {
            $sum: { $cond: [{ $eq: [{ $size: "$courses" }, 0] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalStudents: 1,
          morningShift: 1,
          eveningShift: 1,
          withCourses: 1,
          withoutCourses: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: stats[0] || {
        totalStudents: 0,
        morningShift: 0,
        eveningShift: 0,
        withCourses: 0,
        withoutCourses: 0
      },
    });
  } catch (error) {
    console.error('❌ Get student stats error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch student statistics",
    });
  }
};