import Student from "../models/student.model"
import express from "express"

const router = express.Router()

export const getAllStudents = async () => {

  try {
    const students = await Student.find();
    res.status(201).json({
      success: true,
      student,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get students data."
    })
  }

}


