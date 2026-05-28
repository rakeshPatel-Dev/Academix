

import Admin from "../models/admin.model.js";

export const requiresAdminRole = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only admins can access this resource.",
    });
  }
  next();
};