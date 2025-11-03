// Admin/src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../App.css";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext.jsx"; // Import useAuth

const Navbar = () => {
  const { logout } = useAuth(); // Get logout function

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="Logo" className="navbar-logo" />
        <h2
          style={{
            fontSize: "1.5rem", // Smaller for admin
            fontWeight: "700",
            color: "#00c8ff",
          }}
        >
          Skardu Stay (Admin)
        </h2>
      </div>
      <div className="navbar-links">
        <Link to="/" className="nav-link">Dashboard</Link>
        <Link to="/bookings" className="nav-link">Bookings</Link>
        <Link to="/add" className="nav-link">Add Hotel</Link>
        <Link to="/edit-hotels" className="nav-link">Edit Hotels</Link>
        <button onClick={logout} className="nav-link logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

