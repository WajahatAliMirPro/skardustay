import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../api";
import "../App.css";

// Helper function to get today's date in YYYY-MM-DD format
const getTodayString = () => {
  return new Date().toISOString().split("T")[0];
};

const HotelDetail = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  
  // New state for availability
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [availability, setAvailability] = useState({ totalRooms: 0, bookedRooms: 0, availableRooms: 0 });
  const [availabilityLoading, setAvailabilityLoading] = useState(true);

  // Form state
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [daysToStay, setDaysToStay] = useState(1);
  const [bedsRequired, setBedsRequired] = useState(1);

  // Status/Loading state
  const [message, setMessage] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  // Fetch hotel details
  useEffect(() => {
    fetch(`${API_URL}/hotels/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setHotel(data);
        // Set default room count from hotel data
        setAvailability(prev => ({ ...prev, totalRooms: data.totalRooms || 0, availableRooms: data.totalRooms || 0 }));
      })
      .catch(err => console.error("Error fetching hotel details:", err));
  }, [id]); // Re-run if hotel ID changes

  // Fetch availability whenever the date or hotel changes
  useEffect(() => {
    if (!hotel || !selectedDate) return;

    setAvailabilityLoading(true);
    setMessage(""); // Clear old messages

    fetch(`${API_URL}/bookings/availability/${id}?date=${selectedDate}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }
        setAvailability(data);
      })
      .catch(err => {
        console.error("Error checking availability:", err);
        setMessage(`❌ Error checking availability: ${err.message}`);
        setAvailability({ totalRooms: hotel.totalRooms, bookedRooms: 0, availableRooms: 0 }); // Reset
      })
      .finally(() => {
        setAvailabilityLoading(false);
      });
      
  }, [id, hotel, selectedDate]); // Re-run if date or hotel changes

  
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !selectedDate || daysToStay < 1 || bedsRequired < 1) {
      setMessage("❌ Please fill in all fields correctly.");
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
          checkInDate: selectedDate,
          daysToStay: Number(daysToStay),
          bedsRequired: Number(bedsRequired),
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Booking failed");
      }

      setMessage("✅ Booking successful! We will contact you shortly.");
      setCustomerName("");
      setCustomerEmail("");
      
      // Re-check availability after successful booking
      setAvailability(prev => ({
        ...prev,
        bookedRooms: prev.bookedRooms + 1,
        availableRooms: prev.availableRooms - 1,
      }));

    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setBookingLoading(false);
    }
  };

  if (!hotel) return <p>Loading...</p>;

  const isFullyBooked = availability.availableRooms <= 0;

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

      {/* --- NEW BOOKING SECTION --- */}
      <div className="booking-section">
        <h3>Book Your Stay</h3>
        
        <form onSubmit={handleBookingSubmit} className="booking-form">
          {/* Form Grid */}
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                placeholder="Your Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Your Email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="checkIn">Check-in Date</label>
              <input
                type="date"
                id="checkIn"
                value={selectedDate}
                min={getTodayString()} // Don't allow past dates
                onChange={(e) => setSelectedDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="days">Days to Stay</label>
              <input
                type="number"
                id="days"
                value={daysToStay}
                onChange={(e) => setDaysToStay(Number(e.target.value))}
                required
                min="1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="beds">Beds Required</label>
              <input
                type="number"
                id="beds"
                value={bedsRequired}
                onChange={(e) => setBedsRequired(Number(e.target.value))}
                required
                min="1"
              />
            </div>
          </div>
          
          {/* Availability Status */}
          <div className="status" style={{ marginTop: '15px' }}>
            {availabilityLoading ? (
              <p>Checking availability...</p>
            ) : isFullyBooked ? (
              <p className="status error">Fully booked for {selectedDate}</p>
            ) : (
              <p>
                {availability.availableRooms} of {availability.totalRooms} rooms available
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className={isFullyBooked || availabilityLoading ? "book-btn-disabled" : "book-btn"} 
            disabled={bookingLoading || availabilityLoading || isFullyBooked}
          >
            {bookingLoading ? "Booking..." : (isFullyBooked ? "Fully Booked" : "Book Now")}
          </button>
          
          {/* Form Message */}
          {message && <p className="status">{message}</p>}
        </form>

      </div>
      {/* --- END BOOKING SECTION --- */}
    </div>
  );
};

export default HotelDetail;