import Course from "../models/course.model.js";
import Teacher from "../models/teacher.model.js"


// @desc    Create new course
// @route   POST /api/courses
export const createCourse = async (req, res) => {
  try {
    const { title, description, teacher, imageURL } = req.body;

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
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const totalCourses = await Course.countDocuments();
    const totalPages = Math.ceil(totalCourses / limit);

    const courses = await Course.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })

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


// @desc    Search courses by query
// @route   GET /api/courses/search?q=math&page=1&limit=6
export const searchCourses = async (req, res) => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    // Validate search query
    if (!q || q.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "Please provide a search query"
      });
    }

    // Sanitize search term (remove special regex characters)
    const sanitizedQuery = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Build search query
    const searchQuery = {
      $or: [
        { title: { $regex: sanitizedQuery, $options: "i" } },
        { description: { $regex: sanitizedQuery, $options: "i" } },
      ]
    };

    // Execute search with pagination
    const [courses, totalCount] = await Promise.all([
      Course.find(searchQuery)
        .populate('teacher', 'name email post avatar')
        .select('title description imageURL teacher createdAt')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),

      Course.countDocuments(searchQuery)
    ]);

    // If no results
    if (courses.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No courses found matching your search",
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
          pages: 0
        }
      });
    }

    // Format response
    const formattedCourses = courses.map(course => ({
      id: course._id,
      title: course.title,
      description: course.description,
      imageURL: course.imageURL,
      teacher: course.teacher ? {
        id: course.teacher._id,
        name: course.teacher.name,
        email: course.teacher.email,
        post: course.teacher.post
      } : null,
      createdAt: course.createdAt
    }));

    res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      data: formattedCourses,
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
      error: error.message
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

    // Check if course has teachers assigned
    const teacherCount = await Teacher.countDocuments({ coursId: req.params.id });
    if (teacherCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete course. It has ${teacherCount} teacher(s) assigned. Please reassign or delete teachers first.`,
      });
    }

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