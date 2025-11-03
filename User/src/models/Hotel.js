import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: { type: [String], required: true }, // array of image URLs
});

export default mongoose.model("Hotel", hotelSchema);
