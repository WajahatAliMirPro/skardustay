// backend/routes/bookingRoutes.js
import express from "express";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import authMiddleware from "../middleware/authMiddleware.js"; // Import auth middleware

const router = express.Router();

// --- Create a new booking (User action - Public) ---
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

// --- Get all bookings (Admin action - Protected) ---
router.get("/", authMiddleware, async (req, res) => {
  try {
    // Sort by checkInDate descending (newest first)
    const bookings = await Booking.find().sort({ checkInDate: -1 }); 
    res.json(bookings);
  } catch (err) {
    console.error("❌ Error fetching bookings:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// --- Check if a hotel is booked for a SPECIFIC DATE (User action - Public) ---
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

// --- Get a single booking (Admin action - Protected) ---
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json(booking);
  } catch (err) {
    console.error("❌ Error fetching single booking:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// --- Update a booking (Admin action - Protected) ---
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { 
      customerName, 
      customerEmail, 
      checkInDate, 
      daysToStay, 
      bedsRequired 
    } = req.body;

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        customerName,
        customerEmail,
        checkInDate: new Date(checkInDate),
        daysToStay: Number(daysToStay),
        bedsRequired: Number(bedsRequired),
      },
      { new: true } // Return the updated document
    );

    if (!updatedBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json({ message: "✅ Booking updated", booking: updatedBooking });
  } catch (err) {
    console.error("❌ Error updating booking:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// --- Delete a booking (Admin action - Protected) ---
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
    if (!deletedBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json({ message: "✅ Booking deleted" });
  } catch (err) {
    console.error("❌ Error deleting booking:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;


