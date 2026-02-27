// routes/student.routes.js
import express from "express";
import {
  getAllStudents,
  getAllStudentsForDropdown,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  searchStudents,
  getStudentsByShift,
  getStudentStats
} from "../controllers/student.controller.js";

const router = express.Router();

// Public routes
router.get("/all", getAllStudentsForDropdown); // For dropdowns
router.get("/search", searchStudents);
router.get("/stats/overview", getStudentStats);
router.get("/shift/:shift", getStudentsByShift);

// CRUD routes
router.route("/")
  .get(getAllStudents)
  .post(createStudent);

router.route("/:id")
  .get(getStudentById)
  .put(updateStudent)
  .delete(deleteStudent);

export default router;