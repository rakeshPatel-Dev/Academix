import {
  createCourse,
  getAllCourses,
  updateCourse,
  deleteCourse,
  getCourseById,
  searchCourses
} from "../controllers/course.controller.js";
import express from "express";

const router = express.Router();

router.get("/search", searchCourses);


router.route("/:id")
  .put(updateCourse)
  .delete(deleteCourse)
  .get(getCourseById)

router.route("/")
  .post(createCourse)
  .get(getAllCourses);

export default router;