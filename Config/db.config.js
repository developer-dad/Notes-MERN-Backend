import mongoose from "mongoose";

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

export default connectToDB