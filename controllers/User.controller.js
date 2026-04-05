import User from "../Models/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// Logic to create a new user
export const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // validate
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All Fields are required",
      });
    }

    // check existing
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // password hashing
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);

    // Save to database
    const user = await User.create({
      name: name,
      email: email,
      password: hashPassword,
    });

    // create token
    const JWT_SECRET = process.env.JWT_SECRET
    const accessToken = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "7d" })

    const { password: _, ...userData } = user._doc

    res.status(201).json({
      success: true,
      accessToken: accessToken,
      message: "User created Successfully",
      data: userData,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Logic to get self details (USER)
export const getUser = async (req, res) => {
  try {
    // req.user comes from authMiddleware (JWT decoded)
    const user = await User.findById(req.user.id).select("-password")
  
    if(!user){
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    const accessToken = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: "7d" })
  
    res.status(200).json({
      status: true,
      message: "User Fetched Successfully",
      accessToken: accessToken,
      data: user 
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

// Logic to LogIn an existing user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // validate
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // check email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    // password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // create token
    const JWT_SECRET = process.env.JWT_SECRET
    const accessToken = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({
      success: true,
      accessToken: accessToken,
      message: "Token Created Successfully",
      data: user
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Logic to delete an existing user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate id
    if(!mongoose.Types.ObjectId.isValid){
      return res.status(400).json({
        success: false,
        message: "UserId is not valid"
      })
    }

    // check if user exists
    const userDelete = await User.findByIdAndDelete(id);
    if (!userDelete) {
      return res.status(400).json({
        success: false,
        message: "User Not Found"
      });
    }
    res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};