import { Link } from "react-router-dom";
import "../App.css";

const HotelCard = ({ hotel }) => (
  <div className="hotel-card">
    <img src={hotel.images[0]} alt={hotel.title} className="hotel-img" />
    <h3>{hotel.title}</h3>
    <p>{hotel.description.slice(0, 80)}...</p>
    <Link to={`/hotel/${hotel._id}`} className="view-btn">View Details</Link>
  </div>
);

export default HotelCard;
