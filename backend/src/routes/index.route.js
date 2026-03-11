// // routes/index.js
// import express from "express";
// import { authMiddleware } from "../middlewares/auth.middleware.js";
// import { adminOnly, superAdminOnly } from "../middlewares/role.middleware.js";

// // Import controllers
// import {
//   registerAdmin,
//   loginUser,
//   logoutUser,
//   getAllAdmins,
//   getSingleAdmin,
//   updateAdmin,
//   deleteAdmin,
//   getCurrentUser
// } from "../controllers/user.controller.js";

// import * as courseController from "../controllers/course.controller.js";
// import * as teacherController from "../controllers/teacher.controller.js";
// import * as studentController from "../controllers/student.controller.js";

// const router = express.Router();

// // ========== PUBLIC ROUTES ==========
// router.post("/login", loginUser);
// router.post("/logout", logoutUser);

// // ========== USER/ADMIN ROUTES (Super Admin only) ==========
// router.post("/users/register", authMiddleware, superAdminOnly, registerAdmin);
// router.get("/users", authMiddleware, superAdminOnly, getAllAdmins);
// router.get("/users/me", authMiddleware, getCurrentUser);
// router.get("/users/:id", authMiddleware, superAdminOnly, getSingleAdmin);
// router.put("/users/:id", authMiddleware, superAdminOnly, updateAdmin);
// router.delete("/users/:id", authMiddleware, superAdminOnly, deleteAdmin);

// // ========== COURSE ROUTES (Admin and Super Admin) ==========
// router.get("/courses", authMiddleware, adminOnly, courseController.getAllCourses);
// router.get("/courses/all", authMiddleware, adminOnly, courseController.getAllCoursesForDropdown);
// router.get("/courses/search", authMiddleware, adminOnly, courseController.searchCourses);
// router.get("/courses/:id", authMiddleware, adminOnly, courseController.getCourseById);
// router.post("/courses", authMiddleware, adminOnly, courseController.createCourse);
// router.put("/courses/:id", authMiddleware, adminOnly, courseController.updateCourse);
// router.delete("/courses/:id", authMiddleware, adminOnly, courseController.deleteCourse);

// // ========== TEACHER ROUTES (Admin and Super Admin) ==========
// router.get("/teachers", authMiddleware, adminOnly, teacherController.getAllTeachers);
// router.get("/teachers/all", authMiddleware, adminOnly, teacherController.getAllTeachersForDropdown);
// router.get("/teachers/:id", authMiddleware, adminOnly, teacherController.getTeacherById);
// router.post("/teachers", authMiddleware, adminOnly, teacherController.createTeacher);
// router.put("/teachers/:id", authMiddleware, adminOnly, teacherController.updateTeacher);
// router.delete("/teachers/:id", authMiddleware, adminOnly, teacherController.deleteTeacher);

// // ========== STUDENT ROUTES (Admin and Super Admin) ==========
// router.get("/students", authMiddleware, adminOnly, studentController.getAllStudents);
// router.get("/students/all", authMiddleware, adminOnly, studentController.getAllStudentsForDropdown);
// router.get("/students/search", authMiddleware, adminOnly, studentController.searchStudents);
// router.get("/students/:id", authMiddleware, adminOnly, studentController.getStudentById);
// router.post("/students", authMiddleware, adminOnly, studentController.createStudent);
// router.put("/students/:id", authMiddleware, adminOnly, studentController.updateStudent);
// router.delete("/students/:id", authMiddleware, adminOnly, studentController.deleteStudent);

// export default router;