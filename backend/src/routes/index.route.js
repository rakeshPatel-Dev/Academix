// import express from "express";
// import { authMiddleware } from "../middlewares/auth.middleware.js";
// import * as courseController from "../controllers/course.controller.js";
// import * as teacherController from "../controllers/teacher.controller.js";
// import * as studentController from "../controllers/student.controller.js";

// const router = express.Router();

// // All routes protected by authMiddleware
// router.use(authMiddleware);

// // COURSE ROUTES
// router.get("/courses", courseController.getAllCourses);
// router.get("/courses/all", courseController.getAllCoursesForDropdown);
// router.get("/courses/search", courseController.searchCourses);
// router.get("/courses/:id", courseController.getCourseById);
// router.post("/courses", courseController.createCourse);
// router.put("/courses/:id", courseController.updateCourse);
// router.delete("/courses/:id", courseController.deleteCourse);

// // TEACHER ROUTES
// router.get("/teachers", teacherController.getAllTeachers);
// router.get("/teachers/all", teacherController.getAllTeachersForDropdown);
// router.get("/teachers/:id", teacherController.getTeacherById);
// router.post("/teachers", teacherController.createTeacher);
// router.put("/teachers/:id", teacherController.updateTeacher);
// router.delete("/teachers/:id", teacherController.deleteTeacher);

// // STUDENT ROUTES
// router.get("/students", studentController.getAllStudents);
// router.get("/students/all", studentController.getAllStudentsForDropdown);
// router.get("/students/search", studentController.searchStudents);
// router.get("/students/:id", studentController.getStudentById);
// router.post("/students", studentController.createStudent);
// router.put("/students/:id", studentController.updateStudent);
// router.delete("/students/:id", studentController.deleteStudent);

// export default router;
