// middleware/auth.middleware.js
import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";

export const authMiddleware = async (req, res, next) => {
  try {
    // Get token from cookies or Authorization header
    let token = req.cookies.authToken;

    if (!token && req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No token provided",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find admin and attach to request
    const admin = await Admin.findById(decoded.id).select('-password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Admin not found",
      });
    }

    // Attach admin to request object
    req.admin = admin;
    req.userId = admin._id; // Keep userId for backward compatibility if needed
    // Note: role is not in your Admin model, so req.userRole is removed

    next();
  } catch (error) {
    console.error('❌ Auth middleware error:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Invalid token",
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Token expired",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};