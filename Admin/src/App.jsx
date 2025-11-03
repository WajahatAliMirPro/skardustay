import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AddHotel from "./pages/AddHotel";
import HotelDetail from "./pages/HotelDetail";
import EditHotels from "./components/EditHotels";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddHotel />} />
        <Route path="/hotel/:id" element={<HotelDetail />} />
        <Route path="/edit-hotels" element={<EditHotels />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
