import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import HotelDetail from "./pages/HotelDetail";
import Login from "./pages/Login"; // We'll use this later

// Admin pages - we'll protect these later
import AddHotel from "./pages/AddHotel";
import EditHotels from "./components/EditHotels";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* --- Public User Routes --- */}
        <Route path="/" element={<Home />} />
        <Route path="/hotel/:id" element={<HotelDetail />} />
        <Route path="/login" element={<Login />} />

        {/* --- Admin Routes (Currently open for testing, we will protect later) --- */}
        <Route path="/add" element={<AddHotel />} />
        <Route path="/edit-hotels" element={<EditHotels />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
