import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: { type: [String], required: true }
});

const Hotel = mongoose.model("Hotel", hotelSchema);
export default Hotel;
