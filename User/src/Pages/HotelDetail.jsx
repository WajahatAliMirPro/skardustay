import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../api";
import "../App.css";

const HotelDetail = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [isBookedToday, setIsBookedToday] = useState(false);
  const [loadingCheck, setLoadingCheck] = useState(true);

  // Form state
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [message, setMessage] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  // Fetch hotel details AND check booking status
  useEffect(() => {
    // 1. Fetch Hotel Details
    fetch(`${API_URL}/hotels/${id}`)
      .then((res) => res.json())
      .then((data) => setHotel(data));

    // 2. Check if booked for today
    setLoadingCheck(true);
    fetch(`${API_URL}/bookings/check/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setIsBookedToday(data.isBooked);
        setLoadingCheck(false);
      })
      .catch(err => {
        console.error("Error checking booking:", err);
        setLoadingCheck(false);
      });
      
  }, [id]); // Re-run if hotel ID changes

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!customerName || !customerEmail) {
      setMessage("❌ Please fill in your name and email.");
      return;
    }
    
    setBookingLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotelId: id,
          customerName,
          customerEmail,
          bookingDate: new Date().toISOString(), // Book for today
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Booking failed");
      }

      setMessage("✅ Booking successful! We will contact you shortly.");
      setIsBookedToday(true); // Disable form after booking
      setCustomerName("");
      setCustomerEmail("");

    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setBookingLoading(false);
    }
  };


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

      {/* --- NEW BOOKING SECTION --- */}
      <div className="booking-section">
        <h3>Book Your Stay for Today</h3>
        {loadingCheck ? (
          <p>Checking availability...</p>
        ) : isBookedToday ? (
          <button className="book-btn-disabled" disabled>
            Already Booked for Today
          </button>
        ) : (
          <form onSubmit={handleBookingSubmit} className="booking-form">
            <input
              type="text"
              placeholder="Your Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              required
            />
            <button type="submit" className="book-btn" disabled={bookingLoading}>
              {bookingLoading ? "Booking..." : "Book Now"}
            </button>
            {message && <p className="status">{message}</p>}
          </form>
        )}
      </div>
      {/* --- END BOOKING SECTION --- */}
    </div>
  );
};

export default HotelDetail;
