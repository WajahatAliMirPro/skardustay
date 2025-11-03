// Admin/src/Pages/Bookings.jsx
import React, { useEffect, useState } from 'react';
import { API_URL } from '../api.js';
import '../App.css'; // Assuming styles are here

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('adminToken');

    try {
      const res = await fetch(`${API_URL}/bookings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch bookings. Are you logged in?');
      }

      const data = await res.json();
      setBookings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch bookings on component mount
  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) {
      return;
    }

    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_URL}/bookings/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to delete booking.');
      }

      // Remove booking from state
      setBookings(bookings.filter((b) => b._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bookings-page">
      <h2>Manage Bookings</h2>
      {loading && <p>Loading bookings...</p>}
      {error && <p className="status error">{error}</p>}
      
      <div className="booking-list">
        {bookings.length === 0 && !loading && <p>No bookings found.</p>}
        
        {bookings.map((booking) => (
          <div key={booking._id} className="booking-item">
            <div className="booking-details">
              <h4>{booking.hotelName}</h4>
              <p><strong>Customer:</strong> {booking.customerName} ({booking.customerEmail})</p>
              <p><strong>Check-in:</strong> {formatDate(booking.checkInDate)}</p>
              <p><strong>Stay:</strong> {booking.daysToStay} days</p>
              <p><strong>Beds:</strong> {booking.bedsRequired}</p>
              <p className="booking-id">ID: {booking._id}</p>
            </div>
            <div className="booking-actions">
              <button onClick={() => handleDelete(booking._id)} className="btn-delete">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bookings;

