import express from "express";
import multer from "multer";
import path from "path";
import Hotel from "../models/Hotel.js";

const router = express.Router();

// 📸 Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ➕ Add hotel (with images) - Admin
router.post("/", upload.array("images", 3), async (req, res) => {
  try {
    const { title, description } = req.body; 

    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }

    const imageUrls = req.files.map(
      (file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
    );

    const newHotel = new Hotel({ title, description, images: imageUrls });
    await newHotel.save();
    res.json({ message: "✅ Hotel added successfully", hotel: newHotel });
  } catch (err) {
    console.error("❌ Error adding hotel:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 📜 Get all hotels - User & Admin
router.get("/", async (req, res) => {
  const hotels = await Hotel.find();
  res.json(hotels);
});

// 🏨 Get single hotel - User & Admin
router.get("/:id", async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  res.json(hotel);
});

// --- ✏️ Update hotel - Admin ---
router.put("/:id", async (req, res) => {
  try {
    const { title, description } = req.body;
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { title, description },
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

// --- 🗑️ Delete hotel - Admin ---
router.delete("/:id", async (req, res) => {
  try {
    const deletedHotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!deletedHotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }
    res.json({ message: "✅ Hotel deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting hotel:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
