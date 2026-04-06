import Note from "../models/Notes.models.js";

// Logic to create a new note
export const createNote = async (req, res) => {
  try {
    const { title, content, color } = req.body;
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and Content both are required"
      });
    }
    const newNote = await Note.create({ title, content, color, userId: req.user.id });
    res.status(201).json({
      success: true,
      message: "New Note Created",
      data: newNote
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Logic to display all notes
export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Successfully fetched all notes",
      data: notes
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Logic to update a note by it's id
export const updateNote = async (req, res) => {
  try {
    const { title, content, color } = req.body;
    const { id } = req.params;
    // auth check
    if(!req.user || !req.user.id){
      return res.status(401).json({
        success: false,
        message: "Unauthorized User"
      })
    }
    // check if empty title or content is not updating
    if(!title && !content){
      return res.status(400).json({
        success: false,
        message: "Title and Content are required"
      })
    }
    const newNote = await Note.findByIdAndUpdate(
      { _id: id, userId: req.user.id },
      { title, content, color },
      { new: true, runValidators: true }
    );
    if (!newNote) {
      return res.status(404).json({
        success: false,
        message: "Note not Updated"
      });
    }
    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      data: newNote
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Logic to delete a note by it's id
export const deleteNote = async (req, res) => {
  try {
    // check auth
    if(!req.user || !req.user.id){
      return res.status(401).json({
        success: false,
        message: "Unauthorized User"
      })
    }
    const { id } = req.params
    const removeNote = await Note.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!removeNote) {
      return res.status(404).json({
        success: false,
        message: "Note not found"
      });
    }
    res.status(200).json({
      success: true,
      message: "Note deleted successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};