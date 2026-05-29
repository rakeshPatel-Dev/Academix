// controllers/admin.controller.js
import Admin from "../models/admin.model.js";
import Otp from "../models/otp.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sendOtpEmail, sendAdminLoginMonitorEmail, sendRegistrationEmail, sendVerificationEmail, sendPasswordResetEmail } from "../service/email.service.js";


const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || SMTP_USER;

// @desc    Register new admin
// @route   POST /api/admins/register
export const registerAdmin = async (req, res) => {
  try {
    const { email, password, name, avatar, confirmPassword, role, pendingToken } = req.body;

    // Validate required fields
    if (!email || !password || !name || !avatar || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password and avatar, and confirm password are required.",
      });
    }

    if (role && !["admin", "user"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Role must be either 'admin' or 'user'.",
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

    // check if pending token is valid
    if (pendingToken === "") {
      // Generate 6 digit OTP for login confirmation
      const otpCode = (Math.floor(100000 + Math.random() * 900000)).toString();
      await Otp.create({
        email,
        otp: otpCode,
        expiresAt: new Date(Date.now() + 2 * 60 * 1000) // OTP expires in 2 minutes
      });

      // send login otp email
      await sendOtpEmail({ email, name, role }, otpCode).catch((err) => {
        console.error("❌ Failed to send login OTP email:", err);
      });

      return res.status(200).json({
        success: true,
        message: "OTP sent to email. Please verify to complete login.",
        email
      });

    }

    // verify pending token if valid then skip otp verification and login directly
    const decoded = jwt.verify(pendingToken, process.env.JWT_SECRET);
    if (decoded.email !== email) {
      return res.status(401).json({
        success: false,
        message: "Invalid pending token.",
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
      role: role || "user",
      isVerified: true
    });

    // create token
    const token = jwt.sign({
      id: admin._id,
      email: admin.email,
      role: admin.role
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
    await sendRegistrationEmail(admin, admin.role).catch((err) => {
      console.error("❌ Failed to send registration email:", err);
    });

    // send email to login monitor
    await sendAdminLoginMonitorEmail(admin, req, superAdminEmail).catch((err) => {
      console.error("❌ Failed to send admin login monitor email:", err);
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
    const { email, password, pendingToken } = req.body;

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


    if (pendingToken === "") {
      // Generate 6 digit OTP for login confirmation
      const otpCode = (Math.floor(100000 + Math.random() * 900000)).toString();
      await Otp.create({
        email: admin.email,
        otp: otpCode,
        expiresAt: new Date(Date.now() + 2 * 60 * 1000) // OTP expires in 2 minutes
      });

      // send login otp email
      await sendOtpEmail({ email: admin.email, name: admin.name, role: admin.role }, otpCode).catch((err) => {
        console.error("❌ Failed to send login OTP email:", err);
      });

      return res.status(200).json({
        success: true,
        message: "OTP sent to email. Please verify to complete login.",
        email: admin.email
      });

    }

    // verify pending token if valid then skip otp verification and login directly
    const decoded = jwt.verify(pendingToken, process.env.JWT_SECRET);
    if (decoded.email !== email) {
      return res.status(401).json({
        success: false,
        message: "Invalid pending token.",
      });
    }

    // Generate token
    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        role: admin.role
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

    // set admin as verified if not verified already
    if (!admin.isVerified) {
      admin.isVerified = true;
      await admin.save();
    }

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

    await sendLoginAlertEmail(admin, req).catch((err) => {
      console.error("❌ Failed to send login alert email:", err);
    });

    // send email to login monitor
    await sendAdminLoginMonitorEmail(admin, req, superAdminEmail).catch((err) => {
      console.error("❌ Failed to send admin login monitor email:", err);
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

// @desc    delete admin profile
// @route   DELETE /api/admins/delete/:id
export const deleteAdminProfile = async (req, res) => {
  try {
    // Get admin ID from the authenticated user (set by auth middleware)
    const adminId = req.user.id;

    // Validate required fields
    if (!adminId) {
      return res.status(400).json({
        success: false,
        message: "Admin ID is required."
      });
    }

    // Check if admin exists
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }

    // check if this is the last admin
    const admins = await Admin.find();
    if (admins.length === 1) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete the last admin. At least one admin is required."
      });
    }

    // Check single admin with role admin
    const adminCount = await Admin.countDocuments({ role: "admin" });
    if (admin.role === "admin" && adminCount === 1) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete the last admin with 'admin' role. At least one admin with 'admin' role is required."
      });
    }

    // Delete admin
    const deletedAdmin = await Admin.findByIdAndDelete(adminId);

    if (!deletedAdmin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile deleted successfully"
    });

  } catch (error) {
    console.error("❌ Delete profile error:", error);
    res.status(500).json({
      success: false,
      message: `Failed to delete profile. ${error.message}`
    });
  }
};


// @desc    Send verification code to admin email
// @route   POST /api/admins/send-code
export const sendVerificationCode = async (req, res) => {
  try {
    const admin = req.user;

    if (admin.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified"
      });
    }

    // Clear old verification code for resend
    admin.verificationCode = null;
    admin.verificationCodeExpire = null;

    // Generate new 6-digit code
    const vCode = (Math.floor(Math.random() * 900000) + 100000).toString();
    admin.verificationCode = vCode;
    admin.verificationCodeExpire = Date.now() + 10 * 60 * 1000;

    await admin.save();

    // Send the email
    await sendVerificationEmail(admin).catch((err) => {
      console.error("❌ Failed to send verification email:", err);
    });

    res.status(200).json({
      success: true,
      message: "Verification code sent to your email",
      data: {
        expiresIn: admin.verificationCodeExpire
      }

    });

  } catch (error) {
    console.error("❌ Send verification code error:", error);
    res.status(500).json({
      success: false,
      message: `Failed to send verification code. ${error.message}`
    });
  }
};

// @desc    verify admin
// @route   POST /api/admins/verify-code
export const verifyCode = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    // Validate required fields
    if (!email || !verificationCode) {
      return res.status(400).json({
        success: false,
        message: "Email and verification code are required."
      });
    }

    const admin = await Admin.findOne({ email });

    // Check if admin exists
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }

    // Check if email is already verified
    if (admin.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified"
      });
    }

    // Check if verification code is valid
    if (admin.verificationCode !== verificationCode) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code"
      });
    }

    // Check if verification code has expired
    if (admin.verificationCodeExpire < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Verification code has expired"
      });
    }

    // Verify email and nullify related fields
    admin.isVerified = true;
    admin.verificationCode = null;
    admin.verificationCodeExpire = null;
    await admin.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully"
    });

  } catch (error) {
    console.error("❌ Verify email error:", error);
    res.status(500).json({
      success: false,
      message: `Failed to verify email. ${error.message}`
    });
  }
};

// @desc    send reset password code
// @route   POST /api/admins/reset-password/send-code
export const sendResetCode = async (req, res) => {

  try {
    const { email } = req.body;

    // Validate required fields
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required."
      });
    }

    const admin = await Admin.findOne({ email });

    // Check if admin exists
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }

    // Generate new 6-digit code
    const vCode = (Math.floor(Math.random() * 900000) + 100000).toString();
    admin.verificationCode = vCode;
    admin.verificationCodeExpire = Date.now() + 10 * 60 * 1000;

    await admin.save();

    // Send the email
    await sendPasswordResetEmail(admin).catch((err) => {
      console.error("❌ Failed to send reset password email:", err);
    });

    res.status(200).json({
      success: true,
      message: "Reset password code sent to your email",
      data: {
        expiresIn: admin.verificationCodeExpire
      }
    });

  } catch (error) {
    console.error("❌ Send reset password code error:", error);
    res.status(500).json({
      success: false,
      message: `Failed to send reset password code. ${error.message}`
    });
  }
}

//@desc    validate reset password code
// @route   POST /api/admins/reset-password/verify-code
export const validateResetCode = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    // Validate required fields
    if (!email || !verificationCode) {
      return res.status(400).json({
        success: false,
        message: "Email and verification code are required."
      });
    }

    const admin = await Admin.findOne({ email });

    // Check if admin exists
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }

    // Check if verification code is valid
    if (admin.verificationCode !== verificationCode) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code"
      });
    }

    // Check if verification code has expired
    if (admin.verificationCodeExpire < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Verification code has expired"
      });
    }

    res.status(200).json({
      success: true,
      message: "Verification code is valid"
    });

  } catch (error) {
    console.error("❌ Validate reset password code error:", error);
    res.status(500).json({
      success: false,
      message: `Failed to validate reset password code. ${error.message}`
    });
  }
}

// @desc    reset password
// @route   POST /api/admins/reset-password
export const resetPassword = async (req, res) => {
  try {
    const { email, verificationCode, newPassword } = req.body;

    // Validate required fields
    if (!email || !verificationCode || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, verification code, and new password are required."
      });
    }

    const admin = await Admin.findOne({ email });

    // Check if admin exists
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    admin.password = hashedPassword;
    admin.verificationCode = null;
    admin.verificationCodeExpire = null;

    await admin.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully"
    });

  } catch (error) {
    console.error("❌ Reset password error:", error);
    res.status(500).json({
      success: false,
      message: `Failed to reset password. ${error.message}`
    });
  }
}

// @desc    verify login OTP
// @route   POST /api/admins/verify-otp
export const verifyOpt = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validate required fields
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required."
      });
    }

    const requestedAdmin = await Otp.findOne({ email, otp });

    // Check if admin exists
    if (!requestedAdmin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }

    // Check if otp is valid
    if (requestedAdmin.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    // Check if otp code has expired
    if (requestedAdmin.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired"
      });
    }

    // send pendingToken for login and register
    const pendingToken = jwt.sign(
      {
        email: requestedAdmin.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '2m' }
    );

    res.status(200).json({
      success: true,
      message: "Login OTP verified successfully",
      requestedAdmin: {
        email: requestedAdmin.email,
        pendingToken
      }
    });

    // set otp as null after successful verification
    await Otp.deleteOne({ _id: requestedAdmin._id });


  } catch (error) {
    console.error("❌ Verify login OTP error:", error);
    res.status(500).json({
      success: false,
      message: `Failed to verify login OTP. ${error.message}`
    });
  }
}