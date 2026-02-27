import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  address: {
    type: String,
  },
  avatar: {
    type: String,
  },
  phone: {
    type: String,
    required: true,
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    }
  ],
  shift: {
    type: String,
    enum: ["morning", "evening"],
    required: true,
  }

}, { timestamps: true })

const Student = mongoose.model("Student", studentSchema);

export default Student;