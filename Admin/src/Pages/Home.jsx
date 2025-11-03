// Admin/src/Pages/Home.jsx
import { useEffect, useState } from "react";
import { API_URL } from "../api.js";
import HotelCard from "../components/HotelCard.jsx"; // Assuming this is for display
import "../App.css";

// This page now acts as a "Dashboard"
const Home = () => {
  const [hotels, setHotels] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      try {
        // Fetch hotels
        const hotelsRes = await fetch(`${API_URL}/hotels`);
        const hotelsData = await hotelsRes.json();
        setHotels(hotelsData);

        // Fetch bookings
        const bookingsRes = await fetch(`${API_URL}/bookings`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const bookingsData = await bookingsRes.json();
        setBookings(bookingsData);

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading Dashboard...</p>;
  }

  return (
    <div className="home">
      <h1>Admin Dashboard</h1>
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Hotels</h3>
          <p>{hotels.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Bookings</h3>
          <p>{bookings.length}</p>
        </div>
      </div>

      <h2>🏨 Recently Added Hotels</h2>
      <div className="hotel-grid">
        {hotels.slice(0, 3).map(hotel => ( // Show 3 most recent
          <HotelCard key={hotel._id} hotel={hotel} />
        ))}
      </div>
    </div>
  );
};

export default Home;

