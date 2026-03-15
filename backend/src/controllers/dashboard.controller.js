// controllers/dashboard.controller.js
import Student from "../models/student.model.js";
import Teacher from "../models/teacher.model.js";
import Course from "../models/course.model.js";

// @desc    Get all dashboard statistics in one call
// @route   GET /api/dashboard/stats
export const getDashboardStats = async (req, res) => {
  try {
    // Run all queries in parallel for performance
    const [
      // Counts
      studentCount,
      teacherCount,
      courseCount,

      // Student shift distribution
      studentShiftStats,

      // Teacher post distribution
      teacherPostStats,

      // Course teacher status
      courseTeacherStats,

      // Recent items (latest 3, sorted by creation date)
      recentStudents,
      recentTeachers,
      recentCourses,
    ] = await Promise.all([
      // --- Counts ---
      Student.countDocuments(),
      Teacher.countDocuments(),
      Course.countDocuments(),

      // --- Student shift aggregation ---
      Student.aggregate([
        {
          $group: {
            _id: { $toLower: "$shift" },
            count: { $sum: 1 },
          },
        },
      ]),

      // --- Teacher post aggregation ---
      Teacher.aggregate([
        {
          $group: {
            _id: { $toLower: "$post" },
            count: { $sum: 1 },
          },
        },
      ]),

      // --- Course teacher status aggregation ---
      Course.aggregate([
        {
          $project: {
            hasTeacher: {
              $cond: {
                if: {
                  $and: [
                    { $ne: ["$teacher", null] },
                    { $ne: ["$teacher", []] },
                    { $gt: [{ $size: { $ifNull: ["$teacher", []] } }, 0] },
                  ],
                },
                then: true,
                else: false,
              },
            },
          },
        },
        {
          $group: {
            _id: "$hasTeacher",
            count: { $sum: 1 },
          },
        },
      ]),

      // --- Recent students (3 latest) ---
      Student.find()
        .select("name email avatar shift createdAt")
        .sort({ createdAt: -1 })
        .limit(3)
        .lean(),

      // --- Recent teachers (3 latest) ---
      Teacher.find()
        .select("name email avatar post createdAt")
        .sort({ createdAt: -1 })
        .limit(3)
        .lean(),

      // --- Recent courses (3 latest) ---
      Course.find()
        .select("title description imageURL teacher createdAt")
        .populate("teacher", "name")
        .sort({ createdAt: -1 })
        .limit(3)
        .lean(),
    ]);

    // --- Process student shift stats ---
    const morningStudents =
      studentShiftStats.find((s) => s._id === "morning")?.count || 0;
    const eveningStudents =
      studentShiftStats.find((s) => s._id === "evening")?.count || 0;
    const morningPercentage = studentCount
      ? Math.round((morningStudents / studentCount) * 100)
      : 0;
    const eveningPercentage = studentCount
      ? Math.round((eveningStudents / studentCount) * 100)
      : 0;

    // --- Process teacher post stats ---
    const professors =
      teacherPostStats.find((t) => t._id === "professor")?.count || 0;
    const associateProfessors =
      teacherPostStats.find(
        (t) => t._id === "associate professor" || t._id === "associate"
      )?.count || 0;
    const assistantProfessors =
      teacherPostStats.find(
        (t) => t._id === "assistant professor" || t._id === "assistant"
      )?.count || 0;

    // --- Process course teacher stats ---
    const coursesWithTeacher =
      courseTeacherStats.find((c) => c._id === true)?.count || 0;
    const coursesWithoutTeacher =
      courseTeacherStats.find((c) => c._id === false)?.count || 0;

    res.status(200).json({
      success: true,
      data: {
        // Counts
        studentCount,
        teacherCount,
        courseCount,

        // Student distribution
        morningStudents,
        eveningStudents,
        morningPercentage,
        eveningPercentage,

        // Teacher distribution
        professors,
        associateProfessors,
        assistantProfessors,

        // Course status
        coursesWithTeacher,
        coursesWithoutTeacher,

        // Recent items
        recentStudents,
        recentTeachers,
        recentCourses,
      },
    });
  } catch (error) {
    console.error("❌ Dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      ...(process.env.NODE_ENV === "development" && { error: error.message }),
    });
  }
};
