import {
  getAllAdmins,
  loginUser,
  logoutUser,
  registerAdmin,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
  getCurrentUser
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js"

import express from "express";

const router = express.Router();

router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.post("/register", registerAdmin);
router.get("/", getAllAdmins);
router.get("/me", authMiddleware, getCurrentUser);
router.get("/:id", getSingleAdmin);
router.put("/:id", updateAdmin);
router.delete("/:id", deleteAdmin);

export default router;