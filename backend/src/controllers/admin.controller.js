import Admin from "../models/admin.model"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import cookieParser from "cookie-parser"

export const registerAdmin = async (req, res) => {

  const { email, password, imageURL, name } = req.body;

  if (!email, !imageURL, !name) {
    console.log("Required fields are missing.");
  }

  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    console.log("Admin with this email already exists.");
    res.status(409).json({
      success: false,
      message: "Admin with this email already exists.",
    })
  }

  try {

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hash(password, salt)

    const admin = await Admin.create({
      name,
      email,
      imageURL,
      password: hash
    })

    const token = jwt.sign({
      id: admin._id
    }, process.env.JWT_SECRET)

    res.cookie("authToken", token);

    res.status(201).json({
      success: true,
      message: "Admin registered successfully!",
      user,
      token,
    })

  } catch (error) {

    console.log("Error while registering admin.", error);
    res.status(500).json({
      success: false,
      message: `Error occured. ${error.message}`,
    })

  }

}