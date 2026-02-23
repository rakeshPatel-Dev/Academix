import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true
  },
  post: {
    type: String,
    required: true
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  },

}, { timestamps: true })

const Teacher = mongoose.model("Teacher", teacherSchema);

export default Teacher;