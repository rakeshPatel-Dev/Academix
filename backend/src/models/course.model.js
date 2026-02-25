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
  teacher: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      default: null
    }
  ]

}, { timestamps: true })


const Course = mongoose.model("Course", courseSchema);

export default Course;