// backend/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import hotelRoutes from "./routes/hotelRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import authRoutes from "./routes/authRoutes.js"; // 1. Import Auth Routes

dotenv.config(); // Load .env variables

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/hoteldb";

// Fix path for uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes); // 2. Use Auth Routes (unprotected)
app.use("/api/hotels", hotelRoutes); // Hotel routes are now protected internally
app.use("/api/bookings", bookingRoutes); // Booking routes are now protected internally

// MongoDB connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ Mongo Error:", err));

// Server start
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


