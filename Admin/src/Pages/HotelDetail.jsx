// Admin/src/Pages/HotelDetail.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../api.js";
import "../App.css";

// This page is now protected, but it's just fetching public hotel data.
// In a real app, you might add admin-specific info here.
const HotelDetail = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);

  useEffect(() => {
    // This endpoint is public, so no auth token needed for GET
    fetch(`${API_URL}/hotels/${id}`)
      .then(res => res.json())
      .then(data => setHotel(data));
  }, [id]);

  if (!hotel) return <p>Loading...</p>;

  return (
    <div className="hotel-detail">
      <h2>{hotel.title}</h2>
      <div className="hotel-images">
        {hotel.images.map((img, index) => (
          <img 
            key={index} 
            src={img} 
            alt={hotel.title} 
            onError={(e) => { e.target.src = 'https://placehold.co/300x200/0a0f0f/00cccc?text=No+Image' }}
          />
        ))}
      </div>
      <p>{hotel.description}</p>
    </div>
  );
};

export default HotelDetail;

