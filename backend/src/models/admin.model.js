import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },

    // ── Verification ──────────────────────────────
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: null,
    },
    verificationTokenExpire: {
      type: Date,
      default: null,
    },

    // ── OTP (2FA / login confirmation) ────────────
    otp: {
      type: String,
      default: null,
    },
    otpExpire: {
      type: Date,
      default: null,
    },
    otpVerified: {
      type: Boolean,
      default: false,
    },

    // ── Password Reset ────────────────────────────
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpire: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);

export default Admin;