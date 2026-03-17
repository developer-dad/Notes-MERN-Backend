import Note from "../Models/Notes.models.js";

export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

export const createNote = async (req, res) => {
  try {
    const { title, content, color } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "Title and Content both are required" });
    }
    const newNote = new Note({ title, content, color });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { title, content, color } = req.body;
    const { id } = req.params;
    const updateNote = await Note.findByIdAndUpdate(
      id,
      { title, content, color },
      { new: true },
    );
    if (!updateNote) {
      return res.status(404).json({ message: "Note not Updated" });
    }
    res.status(200).json(updateNote);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const deleteNote = await Note.findByIdAndDelete(req.params.id);
    if (!deleteNote) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
