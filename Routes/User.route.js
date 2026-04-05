import express from "express"
import { createUser, deleteUser, getUser, loginUser } from "../controllers/User.controller.js"
import { authMiddleware } from "../middleware/User.middleware.js"

const userRouter = express.Router()

// To get self details
userRouter.get('/', authMiddleware, getUser)

// To create new User
userRouter.post('/signup', createUser)

// To login an existing user
userRouter.post('/login', loginUser)

// To delete an existing user by id
userRouter.delete('/delete/:id', deleteUser)

export default userRouter