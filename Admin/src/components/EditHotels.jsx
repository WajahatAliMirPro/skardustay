// Admin/src/components/EditHotels.jsx
import React, { useEffect, useState } from "react";
import { API_URL } from "../api.js"; // Import API_URL
import "../App.css"; // Import CSS

const EditHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [editingHotel, setEditingHotel] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    title: "",
    description: "",
    totalRooms: 10, // 1. Add totalRooms to state
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all hotels
  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/hotels`) // Use API_URL
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => {
        setHotels(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching hotels:", err);
        setError("Error fetching hotels.");
        setLoading(false);
      });
  }, []);

  const getToken = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      alert("❌ You are not logged in.");
      return null;
    }
    return token;
  }

  // Handle delete
  const deleteHotel = async (id) => {
    const token = getToken();
    if (!token) return;
    
    if (window.confirm("Are you sure you want to delete this hotel?")) {
      try {
        const res = await fetch(`${API_URL}/hotels/${id}`, {
          method: "DELETE",
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        if (!res.ok) throw new Error('Failed to delete');
        
        setHotels(hotels.filter((h) => h._id !== id));
        alert("✅ Hotel deleted.");
      } catch (err) {
        alert("❌ Error deleting hotel.");
      }
    }
  };

  // Handle edit start
  const startEdit = (hotel) => {
    setEditingHotel(hotel._id);
    setUpdatedData({
      title: hotel.title,
      description: hotel.description,
      totalRooms: hotel.totalRooms || 10, // 2. Set totalRooms on edit start
    });
  };

  // Handle save edit
  const saveEdit = async (id) => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/hotels/${id}`, {
        method: "PUT",
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData), // 3. updatedData now includes totalRooms
      });

      if (res.ok) {
        const { hotel } = await res.json();
        setHotels(
          hotels.map((h) =>
            h._id === id ? hotel : h // Use updated hotel from response
          )
        );
        setEditingHotel(null);
        alert("✅ Hotel updated successfully!");
      } else {
        throw new Error('Failed to update');
      }
    } catch (err) {
      alert("❌ Error updating hotel");
    }
  };

  if (loading) return <p>Loading hotels...</p>
  if (error) return <p className="status error">{error}</p>

  return (
    <div className="home">
      <h2>Manage Hotels</h2>
      <div className="hotel-grid">
        {hotels.map((hotel) => (
          <div key={hotel._id} className="hotel-card">
            {editingHotel === hotel._id ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={updatedData.title}
                  onChange={(e) =>
                    setUpdatedData({
                      ...updatedData,
                      title: e.target.value,
                    })
                  }
                  placeholder="Hotel Title"
                />
                <textarea
                  value={updatedData.description}
                  onChange={(e) =>
                    setUpdatedData({
                      ...updatedData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Hotel Description"
                ></textarea>

                {/* 4. Add input for totalRooms */}
                <input
                  type="number"
                  value={updatedData.totalRooms}
                  onChange={(e) =>
                    setUpdatedData({
                      ...updatedData,
                      totalRooms: Number(e.target.value),
                    })
                  }
                  placeholder="Total Rooms"
                  min="1"
                />

                <div className="edit-buttons">
                  <button onClick={() => saveEdit(hotel._id)} className="btn-save">💾 Save</button>
                  <button onClick={() => setEditingHotel(null)} className="btn-cancel">❌ Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <img
                  src={
                    hotel.images && hotel.images.length > 0
                      ? hotel.images[0]
                      : "https://placehold.co/300x200/0a0f0f/00cccc?text=No+Image"
                  }
                  alt={hotel.title}
                  className="hotel-img"
                  onError={(e) => { e.target.src = 'https://placehold.co/300x200/0a0f0f/00cccc?text=No+Image' }}
                />
                <h3>{hotel.title}</h3>
                <p>{hotel.description.slice(0, 100)}...</p>
                {/* 5. Display total rooms */}
                <p style={{color: '#b2ffff', fontWeight: 500, padding: '0 15px'}}>
                  Total Rooms: {hotel.totalRooms || 'N/A'}
                </p>


                <div className="edit-buttons">
                  <button onClick={() => startEdit(hotel)} className="btn-edit">✏️ Edit</button>
                  <button onClick={() => deleteHotel(hotel._id)} className="btn-delete">🗑 Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditHotels;