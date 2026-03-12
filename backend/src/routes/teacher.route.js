import {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getAllTeachersForDropdown
} from "../controllers/teacher.controller.js";
import { authenticateAdmin } from "../middlewares/auth.middleware.js";

import express from "express";

const router = express.Router();

router.get("/all", authenticateAdmin, getAllTeachersForDropdown)

router.route("/:id")
  .get(authenticateAdmin, getTeacherById)
  .put(authenticateAdmin, updateTeacher)
  .delete(authenticateAdmin, deleteTeacher)

router.route("/")
  .get(authenticateAdmin, getAllTeachers)
  .post(authenticateAdmin, createTeacher)

export default router;