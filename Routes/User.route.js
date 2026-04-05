import express from "express"
import { createUser, deleteUser, getUser, loginUser } from "../controllers/User.controller.js"

const userRouter = express.Router()

// To get self details
userRouter.get('/', getUser)

// To create new User
userRouter.post('/signup', createUser)

// To login an existing user
userRouter.post('/login', loginUser)

// To delete an existing user by id
userRouter.delete('/delete/:id', deleteUser)

export default userRouter