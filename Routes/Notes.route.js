import express from "express";
import { createNote, deleteNote, getNotes, updateNote } from "../controllers/Notes.controller.js";

const router = express.Router();

router.get("/all-notes", getNotes);
router.post("/create-note", createNote);
router.put("/update-note/:id", updateNote);
router.delete("/delete-note/:id", deleteNote);

export default router;
