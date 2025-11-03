// Admin/src/components/HotelCard.jsx
import { Link } from "react-router-dom";
import "../App.css";

const HotelCard = ({ hotel }) => (
  <div className="hotel-card">
    <img 
      src={hotel.images[0] || "https://placehold.co/300x200/0a0f0f/00cccc?text=No+Image"} 
      alt={hotel.title} 
      className="hotel-img" 
      onError={(e) => { e.target.src = 'https://placehold.co/300x200/0a0f0f/00cccc?text=No+Image' }}
    />
    <h3>{hotel.title}</h3>
    <p>{hotel.description.slice(0, 80)}...</p>
    {/* Link to the detail page, not edit page directly */}
    <Link to={`/hotel/${hotel._id}`} className="view-btn">View Details</Link>
  </div>
);

export default HotelCard;

