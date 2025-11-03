import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: true,
  },
  hotelName: { // Storing hotel name for easier display in admin
    type: String, 
    required: true
  },
  customerName: {
    type: String,
    required: true,
  },
  customerEmail: {
    type: String,
    required: true,
  },
  checkInDate: { // Changed from bookingDate
    type: Date,
    required: true,
  },
  daysToStay: { // NEW
    type: Number,
    required: true,
  },
  bedsRequired: { // NEW
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// FIX: Check if model already exists before compiling it
const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
export default Booking;
