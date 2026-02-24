import mongoose, { model, Schema } from "mongoose";

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    unique: true
  },
  imageURL: {
    type: String,
    required: true,
  },

}, { timestamps: true })

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;