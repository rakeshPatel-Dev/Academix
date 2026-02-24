import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageURL: {
    type: String,
    required: true,
  },
  student: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student"
    }
  ],
  teacher: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher"
    }
  ]

}, { timestamps: true })


const Course = mongoose.model("Course", courseSchema);

export default Course;