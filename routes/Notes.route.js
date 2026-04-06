import express from "express";
import { createNote, deleteNote, getNotes, updateNote } from "../controllers/Notes.controller.js";
import { authMiddleware } from "../middleware/User.middleware.js";

const router = express.Router();

// Create New Notes
router.post("/", authMiddleware, createNote); // /api/v1/notes

// To display all notes
router.get("/", authMiddleware, getNotes); // /api/v1/notes

// To update a note by id
router.put("/:id", authMiddleware, updateNote); // /api/v1/notes/:id

// To delete a note by id
router.delete("/:id", authMiddleware, deleteNote); // /api/v1/notes/:id

export default router;
