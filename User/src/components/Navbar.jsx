import React from "react";
import { Link } from "react-router-dom";
import "../App.css";
import logo from "../assets/logo.png"; // adjust your logo path

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="Logo" className="navbar-logo" />
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: "900",
            textAlign: "center",
            color: "#00c8ff",
            letterSpacing: "2px",
            animation: "floatText 3s ease-in-out infinite",
            transition: "all 0.4s ease",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.target.style.color = "#ff0099";
            e.target.style.transform = "scale(1.08) rotate(2deg)";
          }}
          onMouseLeave={(e) => {
            e.target.style.color = "#00c8ff";
            e.target.style.transform = "scale(1) rotate(0deg)";
          }}
        >
          Skardu Stay
        </h2>

        <style>
          {`@keyframes floatText {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }`}
        </style>
      </div>
      <div className="navbar-links">
        {/* --- User-Facing Links --- */}
        <Link to="/" className="nav-link">Home</Link>
        
        {/* --- Admin Link Removed --- */}
      </div>
    </nav>
  );
};

export default Navbar;