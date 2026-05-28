import {
  createCourse,
  getAllCourses,
  updateCourse,
  deleteCourse,
  getCourseById,
  searchCourses,
  getCourseStats,
  getAllCoursesForDropdown,
} from "../controllers/course.controller.js";
import express from "express";
import { authenticateAdmin } from "../middlewares/auth.middleware.js";
import { requiresAdminRole } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get("/search", authenticateAdmin, searchCourses);

router.get("/stats", authenticateAdmin, getCourseStats);
router.get("/all", authenticateAdmin, getAllCoursesForDropdown);

router.route("/:id")
  .put(authenticateAdmin, requiresAdminRole, updateCourse)
  .delete(authenticateAdmin, requiresAdminRole, deleteCourse)
  .get(authenticateAdmin, getCourseById)


router.route("/")
  .post(authenticateAdmin, requiresAdminRole, createCourse)
  .get(authenticateAdmin, getAllCourses);


export default router;