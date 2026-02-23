import Course from "../models/course.model.js";


// @desc    Create new course
// @route   POST /api/courses
export const createCourse = async (req, res) => {
  try {
    const { title, description, student, teacher, imageURL } = req.body;

    // Validate required fields
    if (!title || !description, !imageURL) {
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

    const course = await Course.create({
      title,
      description,
      student,
      teacher,
      imageURL
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    console.error('❌ Create course error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};


// @desc    Get all courses
// @route   GET /api/courses
export const getAllCourses = async (req, res) => {

  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalCourses = await Course.countDocuments();
    const totalPages = Math.ceil(totalCourses / limit);

    const courses = await Course.find()
      .populate('student')
      .populate('teacher')
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: totalCourses,
      currentPage: page,
      totalPages: totalPages,
      data: courses,
    });

  } catch (error) {

    console.error('❌ Get courses error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
      error: error.message,
    });

  }

}

// @desc    Get single course by ID
// @route   GET /api/courses/:id
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        course
      },
    });
  } catch (error) {
    console.error('❌ Get course error:', error);

    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch course",
      error: error.message,
    });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
export const updateCourse = async (req, res) => {
  try {
    const { title, description, imageURL } = req.body;

    // Check if course exists
    const courseExists = await Course.findById(req.params.id);
    if (!courseExists) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // If title is being updated, check if it's already taken by another course
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

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { title, description, imageURL },
      {
        returnDocument: 'after',
        runValidators: true, // Run schema validations

      }
    );

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

    res.status(500).json({
      success: false,
      message: "Failed to update course",
      error: error.message,
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

    // // Check if course has teachers assigned
    // const teacherCount = await Teacher.countDocuments({ coursId: req.params.id });
    // if (teacherCount > 0) {
    //   return res.status(400).json({
    //     success: false,
    //     message: `Cannot delete course. It has ${teacherCount} teacher(s) assigned. Please reassign or delete teachers first.`,
    //   });
    // }

    // // Check if course has students enrolled
    // const studentCount = await Student.countDocuments({ courseId: req.params.id });
    // if (studentCount > 0) {
    //   return res.status(400).json({
    //     success: false,
    //     message: `Cannot delete course. It has ${studentCount} student(s) enrolled. Please reassign or delete students first.`,
    //   });
    // }

    // If no dependencies, delete the course
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
      error: error.message
    });
  }
};