import User from "../Models/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import sendOTP from "../utilis/sendOTP.config.js"

// Logic to create a new user
export const signupUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // normalize name and email
    const normName = name.trim().toLowerCase();
    const normEmail = email.trim().toLowerCase();

    // validate
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All Fields are required",
      });
    }

    // password validation
    if (password.length < 6) {
      return res.status(401).json({
        success: false,
        message: "Password must me more then 6 letters.",
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
      name: normName,
      email: normEmail,
      password: hashPassword,
    });

    // create token
    const JWT_SECRET = process.env.JWT_SECRET;
    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    const { password: _, ...userData } = user._doc;

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

// Logic to LogIn an existing user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // normailze email
    const normEmail = email.trim().toLowerCase();

    // validate
    if (!normEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // password validation
    if (password.length < 6) {
      return res.status(401).json({
        success: false,
        message: "Password must have 6 letters",
      });
    }

    // check email exists
    const user = await User.findOne({ email: normEmail });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    // removing password from response
    const { password: _, ...userData } = user._doc;

    // password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // create token
    const JWT_SECRET = process.env.JWT_SECRET;
    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );
    res.json({
      success: true,
      accessToken: accessToken,
      message: "Token Created Successfully",
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
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "User Fetched Successfully",
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Logic to delete an existing user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate id
    if (!mongoose.Types.ObjectId.isValid) {
      return res.status(400).json({
        success: false,
        message: "UserId is not valid",
      });
    }

    // check if user exists
    const userDelete = await User.findByIdAndDelete(id);
    if (!userDelete) {
      return res.status(400).json({
        success: false,
        message: "User Not Found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Logic for sending OTP to Forgot password - (NodeMailer)
export const sendOTPController = async (req, res) => {
try {
    const { email } = req.body;
    // validate email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email not registered",
      });
    }
  
    // create OTP
    const OTP = Math.floor(1000 + Math.random() * 9000);
  
    // save otp to database
    user.otp = OTP
    user.otpExpiry = Date.now() + 10 * 60 * 1000
    await user.save()
  
    // send OTP
    await sendOTP(email, OTP)
    res.status(200).json({
      success: true,
      message: "OTP sent successfully"
    })
} catch (err) {
  res.status(500).json({
    success: false,
    message: "Something went wrong"
  })
}
};

// Logic for resetting password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // validation
    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.otp !== otp.toString()) {
      return res.status(400).json({
        success: false,
        message: "Incorrect OTP"
      });
    }

    // check otp expiry
    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired"
      });
    }

    // hash new password
    const hashNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashNewPassword;

    // clear OTP after use
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password Reset Successful"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};