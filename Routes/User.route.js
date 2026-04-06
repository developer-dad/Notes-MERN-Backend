import express from "express"
import { deleteUser, getUser, loginUser, resetPassword, sendOTPController, signupUser } from "../controllers/User.controller.js"
import { authMiddleware } from "../middleware/User.middleware.js"

const userRouter = express.Router()

// To get self details
userRouter.get('/', authMiddleware, getUser)

// To create new User
userRouter.post('/signup', signupUser)

// To login an existing user
userRouter.post('/login', loginUser)

// To delete an existing user by id
userRouter.delete('/delete/:id', deleteUser)

// To send otp to reset password using nodeMailer
userRouter.post('/forget-password', sendOTPController)

// To reset password and verify from database
userRouter.post('/reset-password', resetPassword)

export default userRouter