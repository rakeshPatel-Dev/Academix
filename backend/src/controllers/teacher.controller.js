// controllers/teacher.controller.js
import Teacher from "../models/teacher.model.js";
import Course from "../models/course.model.js";
import Student from "../models/student.model.js";
import { sendProfileCreatedEmail } from "../service/email.service.js";

// @desc    Get all teachers
// @route   GET /api/teachers
export const getAllTeachers = async (req, res) => {
  try {
    // Add pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;


    const teachers = await Teacher.find()
      .populate('courseId', 'title description imageURL') // Fixed: proper field selection
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalTeachers = await Teacher.countDocuments();

    res.status(200).json({
      success: true,
      count: teachers.length,
      total: totalTeachers,
      totalPages: Math.ceil(totalTeachers / limit),
      currentPage: page,
      data: teachers,
    });
  } catch (error) {
    console.error('❌ Get teachers error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve teachers",
      error: error.message,
    });
  }
};

// @desc    Get single teacher by ID
// @route   GET /api/teachers/:id
export const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate('courseId', 'title description');

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
    const course = await Course.findById(teacher.courseId);

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

// @desc    Get all teachers WITHOUT pagination (for dropdowns)
// @route   GET /api/teachers/all
export const getAllTeachersForDropdown = async (req, res) => {
  try {
    const teachers = await Teacher.find()
      .select('name post avatar') // Only select needed fields
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: teachers.length,
      data: teachers,
    });
  } catch (error) {
    console.error('❌ Get all teachers error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch teachers",
    });
  }
};

// @desc    Create new teacher
// @route   POST /api/teachers
export const createTeacher = async (req, res) => {
  try {
    const { name, email, avatar, address, phone, courseId, post } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !post) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: name, email, phone, post",
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
    // const courseExists = await Course.findById(courseId);
    // if (!courseExists) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Assigned course does not exist",
    //   });
    // }

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
      avatar,
      courseId,
      post,
    });

    // Populate course details for response
    await teacher.populate('courseId', 'title');

    res.status(201).json({
      success: true,
      message: "Teacher created successfully",
      data: teacher,
    });

    // Add teacher to course
    await Course.findByIdAndUpdate(courseId, { $push: { teacherId: teacher._id } });

    // send email
    await sendProfileCreatedEmail(teacher, 'teacher');

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
      error: error.message,
    });
  }
};


// @desc Update teacher
// @route PUT /api/teachers/:id

export const updateTeacher = async (req, res) => {
  try {
    const { name, email, address, avatar, phone, post, courseId } = req.body;

    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    const oldCourses = teacher.courseId.map(id => id.toString());
    const newCourses = courseId ? courseId.map(id => id.toString()) : oldCourses;

    // Find differences
    const coursesToAdd = newCourses.filter(id => !oldCourses.includes(id));
    const coursesToRemove = oldCourses.filter(id => !newCourses.includes(id));

    // Update teacher
    teacher.name = name ?? teacher.name;
    teacher.email = email ?? teacher.email;
    teacher.address = address ?? teacher.address;
    teacher.phone = phone ?? teacher.phone;
    teacher.avatar = avatar ?? teacher.avatar;
    teacher.post = post ?? teacher.post;
    teacher.courseId = courseId ?? teacher.courseId;

    await teacher.save();

    // Add teacher to new courses
    if (coursesToAdd.length > 0) {
      await Course.updateMany(
        { _id: { $in: coursesToAdd } },
        { $addToSet: { teacher: teacher._id } }
      );
    }

    // Remove teacher from old courses
    if (coursesToRemove.length > 0) {
      await Course.updateMany(
        { _id: { $in: coursesToRemove } },
        { $pull: { teacher: teacher._id } }
      );
    }

    const updatedTeacher = await Teacher.findById(teacher._id)
      .populate("courseId", "title");

    res.status(200).json({
      success: true,
      message: "Teacher updated successfully",
      data: updatedTeacher,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update teacher",
    });
  }
};

// @desc    Delete teacher
// @route   DELETE /api/teachers/:id
export const deleteTeacher = async (req, res) => {
  try {
    // Check if teacher exists
    const teacher = await Teacher.findById(req.params.id)
      .populate('courseId', 'title'); // Populate to get course titles for better error messages

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    // ✅ Check for course assignments
    const courseCount = teacher.courseId?.length || 0;

    if (courseCount > 0) {
      // Get course titles for better error message
      const courseTitles = teacher.courseId.map(c => c.title).join(', ');

      return res.status(400).json({
        success: false,
        message: `Cannot delete teacher. They are assigned to ${courseCount} course(s): ${courseTitles}. Please remove course assignments first.`,
      });
    }

    // ✅ Check for student assignments
    const studentCount = await Student.countDocuments({ teacherId: req.params.id });

    if (studentCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete teacher. They have ${studentCount} student(s) assigned. Please reassign students first.`,
      });
    }

    // If all checks pass, delete the teacher
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
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};