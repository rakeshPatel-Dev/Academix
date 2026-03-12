// middleware/auth.middleware.js
import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";

export const authenticateAdmin = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please log in."
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verify admin still exists and is active
    const admin = await Admin.findById(decoded.id).select("-password");
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists."
      });
    }

    // Attach user info to request
    req.user = admin;

    next();
  } catch (error) {
    console.error("❌ Auth middleware error:", error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please log in again."
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please log in again."
      });
    }

    return res.status(500).json({
      success: false,
      message: "Authentication failed."
    });
  }
};