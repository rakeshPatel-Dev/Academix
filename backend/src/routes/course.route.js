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

const router = express.Router();

router.get("/search", searchCourses);

router.get("/stats", getCourseStats);
router.get("/all", getAllCoursesForDropdown)

router.route("/:id")
  .put(updateCourse)
  .delete(deleteCourse)
  .get(getCourseById)


router.route("/")
  .post(createCourse)
  .get(getAllCourses);


export default router;