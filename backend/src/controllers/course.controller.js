// controllers/course.controller.js
import Course from "../models/course.model.js";
import Teacher from "../models/teacher.model.js";

// @desc    Create new course
// @route   POST /api/courses
export const createCourse = async (req, res) => {
  try {
    const { title, description, teacher, imageURL } = req.body;

    // ✅ FIXED: Validation syntax error (comma instead of &&)
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Please provide title and description",
      });
    }

    // Check if course with same title already exists
    const existingCourse = await Course.findOne({ title });
    if (existingCourse) {
      return res.status(400).json({
        success: false,
        message: "Course with this title already exists",
      });
    }

    // ✅ IMPROVED: Only include teacher if provided
    const courseData = {
      title,
      description,
      imageURL: imageURL || null,
    };

    // Only add teacher if it's provided and valid
    if (teacher) {
      courseData.teacher = teacher;
    }

    const course = await Course.create(courseData);

    // ✅ IMPROVED: Populate teacher for response
    await course.populate('teacher', 'name email post');

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    console.error('❌ Create course error:', error);

    // ✅ ADDED: Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Course with this title already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create course",
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

// @desc    Get all courses
// @route   GET /api/courses
export const getAllCourses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const totalCourses = await Course.countDocuments();
    const totalPages = Math.ceil(totalCourses / limit);

    const courses = await Course.find()
      .populate("teacher", "name email post avatar") // ✅ IMPROVED: Select only needed fields
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      total: totalCourses,
      currentPage: page,
      totalPages,
      data: courses,
    });
  } catch (error) {
    console.error('❌ Get courses error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("teacher", "name email post avatar phone");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      data: course, // ✅ FIXED: Removed extra { course } wrapper
    });
  } catch (error) {
    console.error('❌ Get course error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch course",
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

// @desc    Get all courses WITHOUT pagination (for dropdowns)
// @route   GET /api/courses/all
export const getAllCoursesForDropdown = async (req, res) => {
  try {
    // No pagination, just return all with minimal fields
    const courses = await Course.find()
      .select('title imageURL') // Only select needed fields
      .sort({ title: 1 }); // Sort alphabetically

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    console.error('❌ Get all courses error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
    });
  }
};

// @desc    Search courses by query
// @route   GET /api/courses/search?q=math
export const searchCourses = async (req, res) => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
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
        { title: { $regex: sanitizedQuery, $options: "i" } },
        { description: { $regex: sanitizedQuery, $options: "i" } },
      ]
    };

    const [courses, totalCount] = await Promise.all([
      Course.find(searchQuery)
        .populate('teacher', 'name email post avatar')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Course.countDocuments(searchQuery)
    ]);

    res.status(200).json({
      success: true,
      data: courses,
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
    console.error("❌ Course search error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search courses",
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
export const updateCourse = async (req, res) => {
  try {
    const { title, description, imageURL, teacher } = req.body;

    // Check if course exists
    const courseExists = await Course.findById(req.params.id);
    if (!courseExists) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // If title is being updated, check uniqueness
    if (title && title !== courseExists.title) {
      const existingCourse = await Course.findOne({
        title,
        _id: { $ne: req.params.id }
      });

      if (existingCourse) {
        return res.status(400).json({
          success: false,
          message: "Another course with this title already exists",
        });
      }
    }

    // ✅ IMPROVED: Build update object dynamically
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (imageURL !== undefined) updateData.imageURL = imageURL;

    // ✅ FIXED: Handle teacher field (can be null to unassign)
    if (teacher !== undefined) {
      updateData.teacher = teacher || null;
    }

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        returnDocument: 'after',
        runValidators: true,
      }
    ).populate("teacher", "name email post avatar");

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  } catch (error) {
    console.error('❌ Update course error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID format",
      });
    }

    // ✅ ADDED: Handle duplicate key error on update
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Another course with this title already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update course",
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
export const deleteCourse = async (req, res) => {
  try {
    // Check if course exists
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // ✅ FIXED: Check if course has any teachers assigned (array)
    // Since 'teachers' is an array field in the course model
    const teacherCount = course.teachers?.length || course.teacher?.length || 0;

    if (teacherCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete course. It has ${teacherCount} teacher(s) assigned. Please remove teachers first.`,
      });
    }

    // Also check if any teachers reference this course in their schema
    // This is a secondary check in case your teacher model has a course reference
    const teachersReferencingCourse = await Teacher.countDocuments({
      $or: [
        { course: req.params.id },
        { courseId: req.params.id },
        { courses: req.params.id }
      ]
    });

    if (teachersReferencingCourse > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete course. It is referenced by ${teachersReferencingCourse} teacher(s).`,
      });
    }

    // If no teachers assigned, delete the course
    await Course.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error('❌ Delete course error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete course",
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

// @desc    Get courses by teacher
// @route   GET /api/courses/teacher/:teacherId
export const getCoursesByTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;

    const courses = await Course.find({ teacher: teacherId })
      .populate('teacher', 'name email post');

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    console.error('❌ Get courses by teacher error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

// @desc    Get course statistics
// @route   GET /api/courses/stats/overview
export const getCourseStats = async (req, res) => {
  try {
    const stats = await Course.aggregate([
      {
        $group: {
          _id: null,
          totalCourses: { $sum: 1 },
          coursesWithTeachers: {
            $sum: { $cond: [{ $ifNull: ["$teacher", false] }, 1, 0] }
          },
          coursesWithoutTeachers: {
            $sum: { $cond: [{ $ifNull: ["$teacher", false] }, 0, 1] }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalCourses: 1,
          coursesWithTeachers: 1,
          coursesWithoutTeachers: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: stats[0] || {
        totalCourses: 0,
        coursesWithTeachers: 0,
        coursesWithoutTeachers: 0
      },
    });
  } catch (error) {
    console.error('❌ Get course stats error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch course statistics",
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

// controllers/course.controller.js - Add this helper function
const syncTeacherCourseAssignment = async (courseId, teacherIds, session) => {
  // Get current course to see its existing teachers
  const course = await Course.findById(courseId).session(session);
  if (!course) throw new Error("Course not found");

  // Get current teachers of this course
  const currentTeacherIds = course.teacher.map(id => id.toString());

  // Find teachers to add (in new list but not in current)
  const teachersToAdd = teacherIds.filter(id => !currentTeacherIds.includes(id));

  // Find teachers to remove (in current but not in new list)
  const teachersToRemove = currentTeacherIds.filter(id => !teacherIds.includes(id));

  // Update course's teachers
  course.teachers = teacherIds;
  await course.save({ session });

  // Add course to new teachers' courses array
  if (teachersToAdd.length > 0) {
    await Teacher.updateMany(
      { _id: { $in: teachersToAdd } },
      { $addToSet: { courses: courseId } },
      { session }
    );
  }

  // Remove course from removed teachers' courses array
  if (teachersToRemove.length > 0) {
    await Teacher.updateMany(
      { _id: { $in: teachersToRemove } },
      { $pull: { courses: courseId } },
      { session }
    );
  }

  return {
    added: teachersToAdd,
    removed: teachersToRemove,
    final: teacherIds
  };
};