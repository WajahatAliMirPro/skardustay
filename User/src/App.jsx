// User/src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import HotelDetail from "./pages/HotelDetail";
import Login from "./pages/Login"; // We'll keep this as the "Admin Login" link target

// Admin pages are removed, as they are now in a separate app
// import AddHotel from "./pages/AddHotel";
// import EditHotels from "./components/EditHotels";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* --- Public User Routes --- */}
        <Route path="/" element={<Home />} />
        <Route path="/hotel/:id" element={<HotelDetail />} />
        {/* This link now just points to the future admin app's login page.
            In a real scenario, you'd redirect this /login to your admin app's URL.
            For this project, we'll just leave the original placeholder. */}
        <Route path="/login" element={<Login />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;


