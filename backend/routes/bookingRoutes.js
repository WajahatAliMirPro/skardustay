import express from "express";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";

const router = express.Router();

// --- Create a new booking (User action) ---
router.post("/", async (req, res) => {
  try {
    const { 
      hotelId, 
      customerName, 
      customerEmail, 
      checkInDate, 
      daysToStay, 
      bedsRequired 
    } = req.body;

    // Basic validation
    if (!hotelId || !customerName || !customerEmail || !checkInDate || !daysToStay || !bedsRequired) {
      return res.status(400).json({ error: "All fields are required" });
    }
    
    // Get hotel name
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }

    const newBooking = new Booking({
      hotel: hotelId,
      hotelName: hotel.title,
      customerName,
      customerEmail,
      checkInDate: new Date(checkInDate),
      daysToStay: Number(daysToStay),
      bedsRequired: Number(bedsRequired),
    });

    await newBooking.save();
    res.status(201).json({ message: "✅ Booking successful!", booking: newBooking });
  } catch (err) {
    console.error("❌ Error creating booking:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// --- Get all bookings (Admin action - we'll use this later) ---
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error("❌ Error fetching bookings:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// --- Check if a hotel is booked for a SPECIFIC DATE (User action) ---
router.get("/check/:hotelId", async (req, res) => {
  try {
    const { hotelId } = req.params;
    const { date } = req.query; // e.g., ?date=2025-11-03

    if (!date) {
      return res.status(400).json({ error: "Date query parameter is required" });
    }

    // Get the start of the requested date
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    // Get the end of the requested date (start of next day)
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    const booking = await Booking.findOne({
      hotel: hotelId,
      checkInDate: {
        $gte: startDate, // Greater than or equal to start of day
        $lt: endDate,    // Less than start of next day
      },
    });

    res.json({ isBooked: !!booking }); // Send true if booking exists, false otherwise
  } catch (err) {
    console.error("❌ Error checking booking:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
