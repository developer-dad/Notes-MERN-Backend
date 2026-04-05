import express from "express";
import cors from 'cors'
import dotenv from "dotenv";
dotenv.config();

import NoteRoute from "./Routes/Notes.route.js";
import userRouter from "./Routes/User.route.js";
import connectToDB from "./config/db.config.js";

const app = express();

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173"
}))

app.use("/api/v1/notes", NoteRoute); 
app.use('/api/v1/user', userRouter)

const startServer = async () => {
try {
    await connectToDB()
    
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`Server Listning on http://localhost:${PORT}`);
    });
} catch (err) {
  console.error("Error Connecting Server");
  process.exit(-1)
}}

startServer()