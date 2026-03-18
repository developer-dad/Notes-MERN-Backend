import express from "express";
import mongoose from "mongoose";
import cors from 'cors'
import dotenv from "dotenv";
dotenv.config();

import NoteRoute from "./Routes/Notes.route.js";

const connectToDB = async () => {
  try {
    const URI = process.env.MONGO_URI;
    await mongoose.connect(URI);
    console.log("Connected to DB");
  } catch (err) {
    console.log("Failed Connecting to DB", err);
    process.exit(-1);
  }
};
connectToDB();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "No Route here",
    GET: "/api/v1/all-notes",
    POST: "/api/v1/create-note",
    PUT: "/api/v1/update-note/:id",
    DELETE: "/api/v1/delete-note/:id",
  });
});

app.use(cors())

app.use("/api/v1", NoteRoute); 

const PORT = process.env.PORT || 5001;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server Listning on http://localhost:${PORT}`);
});
