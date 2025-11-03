// Admin/src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home.jsx";
import AddHotel from "./Pages/AddHotel.jsx";
import HotelDetail from "./Pages/HotelDetail.jsx";
import EditHotels from "./components/EditHotels.jsx";
import Login from "./Pages/Login.jsx";
import Bookings from "./Pages/Bookings.jsx"; // Import new Bookings page
import { AuthProvider } from "./context/AuthContext.jsx"; // Import AuthProvider
import ProtectedRoute from "./components/ProtectedRoute.jsx"; // Import ProtectedRoute
import AdminLayout from "./components/AdminLayout.jsx"; // Import AdminLayout

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Login Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Admin Routes */}
          <Route
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/add" element={<AddHotel />} />
            <Route path="/edit-hotels" element={<EditHotels />} />
            <Route path="/hotel/:id" element={<HotelDetail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

