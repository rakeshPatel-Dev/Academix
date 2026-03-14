// controllers/admin.controller.js
import Admin from "../models/admin.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sendEmail, sendAdminLoginAlert, sendUserRegisteredAlert } from "../service/email.service.js";

// @desc    Register new admin
// @route   POST /api/admins/register
export const registerAdmin = async (req, res) => {
  try {
    const { email, password, name, avatar, confirmPassword } = req.body;

    // Validate required fields
    if (!email || !password || !name || !avatar || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password and avatar, and confirm password are required.",
      });
    }

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: "Admin with this email already exists.",
      });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      avatar,
    });

    // create token
    const token = jwt.sign({
      id: admin._id,
      email: admin.email
    }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Set cookie with proper options for browser
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

    // Remove password from response
    const adminResponse = admin.toObject();
    delete adminResponse.password;

    res.status(201).json({
      success: true,
      message: "Admin created successfully! You can now login.",
      data: adminResponse,
      token
    });

    // send email to admin 

    sendUserRegisteredAlert(admin, req).catch((err) => {
      console.error("❌ Failed to send registration alert email:", err);
    });

  } catch (error) {
    console.error("❌ Register error:", error);
    res.status(500).json({
      success: false,
      message: `Failed to register admin. ${error.message}`,
    });
  }
};

// @desc    Login admin
// @route   POST /api/admins/login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // Find admin and include password
    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Generate token
    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set cookie with proper options for browser
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

    // Remove password from response
    const adminResponse = admin.toObject();
    delete adminResponse.password;

    const loginTime = new Date().toLocaleString();

    res.status(200).json({
      success: true,
      message: "Login successful!",
      data: adminResponse,
      token,
      loginTime
    });

    // send login email

    // await sendEmail({
    //   to: admin.email,
    //   subject: "Admin Login Alert",
    //   html: `
    //     <h2>Admin Login Detected</h2>
    //     <p>An admin user logged into the system:</p>
    //     <ul>
    //       <li><strong>Admin:</strong> ${admin.name} (${admin.email})</li>
    //       <li><strong>Time:</strong> ${loginTime}</li>
    //     </ul>
    //     <p>If this wasn't you, please contact IT immediately.</p>
    //   `,
    // });

    sendAdminLoginAlert(admin, req).catch((err) => {
      console.error("❌ Failed to send login alert email:", err);
    });

  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({
      success: false,
      message: `Error occurred. ${error.message}`,
    });
  }
};

// @desc    Logout admin
// @route   POST /api/admins/logout
export const logoutAdmin = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
};

// @desc    Get current admin profile
// @route   GET /api/admins/profile
export const getCurrentAdminProfile = async (req, res) => {
  try {
    // Get admin ID from the authenticated user (set by auth middleware)
    const adminId = req.user.id;

    const admin = await Admin.findById(adminId).select('-password');

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }

    res.status(200).json({
      success: true,
      data: admin
    });

  } catch (error) {
    console.error("❌ Get profile error:", error);
    res.status(500).json({
      success: false,
      message: `Failed to get profile. ${error.message}`
    });
  }
};

// @desc    Update current admin profile
// @route   PUT /api/admins/profile
export const updateCurrentAdminProfile = async (req, res) => {
  try {
    const { name, email, avatar } = req.body;

    // Get admin ID from the authenticated user (set by auth middleware)
    const adminId = req.user.id;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required."
      });
    }

    // Check if email is already taken by another admin
    if (email) {
      const existingAdmin = await Admin.findOne({
        email,
        _id: { $ne: adminId }
      });

      if (existingAdmin) {
        return res.status(409).json({
          success: false,
          message: "Email is already in use by another admin"
        });
      }
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address"
      });
    }
    // Build update object with only provided fields
    const updateData = {
      name,
      email,
      updatedAt: Date.now()
    };

    if (avatar !== undefined) {
      updateData.avatar = avatar;
    }

    // Update admin
    const updatedAdmin = await Admin.findByIdAndUpdate(
      adminId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedAdmin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedAdmin
    });

  } catch (error) {
    console.error("❌ Update profile error:", error);
    res.status(500).json({
      success: false,
      message: `Failed to update profile. ${error.message}`
    });
  }
};