// routes/admin.routes.js
import express from 'express';
import {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getCurrentAdminProfile,
  updateCurrentAdminProfile,
  sendVerificationCode,
  verifyCode
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
router.post('/send-code', authenticateAdmin, sendVerificationCode);
router.post('/verify-code', authenticateAdmin, verifyCode);

export default router;