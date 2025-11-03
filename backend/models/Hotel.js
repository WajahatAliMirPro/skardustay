import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: { type: [String], required: true }
});

// FIX: Check if model already exists before compiling it
const Hotel = mongoose.models.Hotel || mongoose.model("Hotel", hotelSchema);
export default Hotel;