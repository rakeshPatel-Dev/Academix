import {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getAllTeachersForDropdown
} from "../controllers/teacher.controller.js";
import express from "express";

const router = express.Router();

router.get("/all", getAllTeachersForDropdown)

router.route("/:id")
  .get(getTeacherById)
  .put(updateTeacher)
  .delete(deleteTeacher)

router.route("/")
  .get(getAllTeachers)
  .post(createTeacher)

export default router;