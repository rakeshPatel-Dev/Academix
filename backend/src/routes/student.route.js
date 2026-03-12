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
import { authenticateAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Admin-protected routes 
router.get("/all", authenticateAdmin, getAllStudentsForDropdown); // For dropdowns
router.get("/search", authenticateAdmin, searchStudents);
router.get("/stats/overview", authenticateAdmin, getStudentStats);
router.get("/shift/:shift", authenticateAdmin, getStudentsByShift);

// CRUD routes
router.route("/")
  .get(authenticateAdmin, getAllStudents)
  .post(authenticateAdmin, createStudent);

router.route("/:id")
  .get(authenticateAdmin, getStudentById)
  .put(authenticateAdmin, updateStudent)
  .delete(authenticateAdmin, deleteStudent);

export default router;