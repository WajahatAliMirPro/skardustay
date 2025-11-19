// backend/routes/hotelRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import Hotel from "../models/Hotel.js";
import authMiddleware from "../middleware/authMiddleware.js"; // Import auth middleware

const router = express.Router();

// 📸 Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ➕ Add hotel (with images) - Admin Protected
router.post("/", authMiddleware, upload.array("images", 3), async (req, res) => {
  try {
    // Extract totalRooms along with title and description
    const { title, description, totalRooms } = req.body; 

    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }

    // Handle case where no files are uploaded
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map(
        (file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
      );
    }

    // Create new hotel with totalRooms (default to 10 if not provided)
    const newHotel = new Hotel({ 
      title, 
      description, 
      images: imageUrls,
      totalRooms: Number(totalRooms) || 10 
    });

    await newHotel.save();
    res.status(201).json({ message: "✅ Hotel added successfully", hotel: newHotel });
  } catch (err) {
    console.error("❌ Error adding hotel:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 📜 Get all hotels - Public
router.get("/", async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.json(hotels);
  } catch (err) {
    console.error("❌ Error fetching hotels:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 🏨 Get single hotel - Public
router.get("/:id", async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }
    res.json(hotel);
  } catch (err) {
    console.error("❌ Error fetching single hotel:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// --- ✏️ Update hotel (text fields + rooms) - Admin Protected ---
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    // Extract totalRooms to allow updating inventory
    const { title, description, totalRooms } = req.body;

    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { 
        title, 
        description,
        totalRooms: Number(totalRooms) // Update totalRooms
      },
      { new: true } // Return the updated document
    );

    if (!updatedHotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }
    res.json({ message: "✅ Hotel updated", hotel: updatedHotel });
  } catch (err) {
    console.error("❌ Error updating hotel:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// --- 🗑️ Delete hotel - Admin Protected ---
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedHotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!deletedHotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }
    // Optional: Delete associated images from the 'uploads' folder here if needed.
    res.json({ message: "✅ Hotel deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting hotel:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;