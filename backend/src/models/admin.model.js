import mongoose from "mongoose";


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

    // ── Roles ─────────────────────────────────────
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    // ── Verification ──────────────────────────────
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      default: null,
    },
    verificationCodeExpire: {
      type: Date,
      default: null,
    },

  },
  { timestamps: true }
);

const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);

export default Admin;