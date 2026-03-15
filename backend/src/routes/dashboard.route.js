import express from "express";
import { getDashboardStats } from "../controllers/dashboard.controller.js";
import { authenticateAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/stats", authenticateAdmin, getDashboardStats);

export default router;
