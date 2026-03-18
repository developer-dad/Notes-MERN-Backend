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
      type: Object,
      default: {
        border: "border-none",
        bg: "bg-none"
      },
    },
  },
  {
    timestamps: true,
  },
);

const Note = mongoose.model("Note", NotesSchema);
export default Note;
