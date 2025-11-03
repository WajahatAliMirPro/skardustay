import express from "express";
import multer from "multer";
import path from "path";
import Hotel from "../models/Hotel.js";

const router = express.Router();

// 📸 Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ➕ Add new hotel (with images)
router.post("/", upload.array("images", 3), async (req, res) => {
  try {
    const title = req.body.title;
    const description = req.body.description;

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

// 📜 Get all hotels
router.get("/", async (req, res) => {
  const hotels = await Hotel.find();
  res.json(hotels);
});

// 🏨 Get one hotel by ID
router.get("/:id", async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  res.json(hotel);
});

// 👇👇 THIS LINE IS THE FIX 👇👇
export default router;
