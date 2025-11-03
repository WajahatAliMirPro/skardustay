import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../api";
import "../App.css";

const HotelDetail = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);

  useEffect(() => {
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
          <img key={index} src={img} alt={hotel.title} />
        ))}
      </div>
      <p>{hotel.description}</p>
    </div>
  );
};

export default HotelDetail;
