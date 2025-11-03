import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv"; // Import dotenv
import hotelRoutes from "./routes/hotelRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js"; // 1. Import Booking Routes
// We will add authRoutes later
// import authRoutes from "./routes/authRoutes.js";       

dotenv.config(); // Load .env variables

const app = express();
const PORT = process.env.PORT || 5000; // Use PORT from .env
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/hoteldb"; // Use MONGO_URI from .env

// Fix path for uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/hotels", hotelRoutes);
app.use("/api/bookings", bookingRoutes); // 2. Use Booking Routes
// app.use("/api/auth", authRoutes);       // 3. We will use Auth Routes later

// MongoDB connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ Mongo Error:", err));

// Server start
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
