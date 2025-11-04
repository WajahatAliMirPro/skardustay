// User/src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import HotelDetail from "./pages/HotelDetail";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;


