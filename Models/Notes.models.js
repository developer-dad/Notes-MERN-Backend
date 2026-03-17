import mongoose from "mongoose";

const NotesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: "border-none",
    },
  },
  {
    timestamps: true,
  },
);

const Note = mongoose.model("Note", NotesSchema);
export default Note;
