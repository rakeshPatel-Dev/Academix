import {
  createCourse,
  getAllCourses,
  updateCourse,
  deleteCourse,
  getCourseById,
} from "../controllers/course.controller.js";
import express from "express";

const router = express.Router();

router.route("/")
  .post(createCourse)
  .get(getAllCourses);

router.route("/:id")
  .put(updateCourse)
  .delete(deleteCourse)
  .get(getCourseById)

export default router;