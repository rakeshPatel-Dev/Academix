import {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getAllTeachersForDropdown
} from "../controllers/teacher.controller.js";
import { authenticateAdmin } from "../middlewares/auth.middleware.js";
import { requiresAdminRole } from "../middlewares/role.middleware.js";

import express from "express";

const router = express.Router();

router.get("/all", authenticateAdmin, getAllTeachersForDropdown)

router.route("/:id")
  .get(authenticateAdmin, getTeacherById)
  .put(authenticateAdmin, requiresAdminRole, updateTeacher)
  .delete(authenticateAdmin, requiresAdminRole, deleteTeacher)

router.route("/")
  .get(authenticateAdmin, getAllTeachers)
  .post(authenticateAdmin, requiresAdminRole, createTeacher)

export default router;