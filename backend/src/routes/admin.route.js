// routes/admin.routes.js
import express from 'express';
import {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getCurrentAdminProfile,
  updateCurrentAdminProfile
} from '../controllers/admin.controller.js';
import { authenticateAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes (no authentication required)
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);

// Protected routes (authentication required)
router.get('/profile', authenticateAdmin, getCurrentAdminProfile);
router.put('/profile', authenticateAdmin, updateCurrentAdminProfile);

export default router;