import { useEffect, useState } from "react";
import { API_URL } from "../api";
import HotelCard from "../components/HotelCard";
import "../App.css";

const Home = () => {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/hotels`)
      .then(res => res.json())
      .then(data => setHotels(data));
  }, []);

  return (
    <div className="home">
      <h1>🏨 Trending Hotels</h1>
      <p>Discover beautiful places to stay in Skardu</p>
      <div className="hotel-grid">
        {hotels.map(hotel => (
          <HotelCard key={hotel._id} hotel={hotel} />
        ))}
      </div>
    </div>
  );
};

export default Home;
