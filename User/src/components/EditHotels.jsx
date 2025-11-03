import React, { useEffect, useState } from "react";

const EditHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [editingHotel, setEditingHotel] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    title: "",
    description: "",
  });

  // Fetch all hotels
  useEffect(() => {
    fetch("http://localhost:5000/api/hotels")
      .then((res) => res.json())
      .then((data) => setHotels(data))
      .catch((err) => console.error("Error fetching hotels:", err));
  }, []);

  // Handle delete
  const deleteHotel = async (id) => {
    if (window.confirm("Are you sure you want to delete this hotel?")) {
      await fetch(`http://localhost:5000/api/hotels/${id}`, {
        method: "DELETE",
      });
      setHotels(hotels.filter((h) => h._id !== id));
    }
  };

  // Handle edit start
  const startEdit = (hotel) => {
    setEditingHotel(hotel._id);
    setUpdatedData({
      title: hotel.title,
      description: hotel.description,
    });
  };

  // Handle save edit
  const saveEdit = async (id) => {
    const res = await fetch(`http://localhost:5000/api/hotels/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    if (res.ok) {
      setHotels(
        hotels.map((h) =>
          h._id === id ? { ...h, ...updatedData } : h
        )
      );
      setEditingHotel(null);
      alert("✅ Hotel updated successfully!");
    } else {
      alert("❌ Error updating hotel");
    }
  };

  return (
    <div className="home">
      <h2>Manage Hotels</h2>
      <div className="hotel-grid">
        {hotels.map((hotel) => (
          <div key={hotel._id} className="hotel-card">
            {editingHotel === hotel._id ? (
              <>
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

                <div className="edit-buttons">
                  <button onClick={() => saveEdit(hotel._id)}>💾 Save</button>
                  <button onClick={() => setEditingHotel(null)}>❌ Cancel</button>
                </div>
              </>
            ) : (
              <>
                {/* ✅ FIXED image display */}
                <img
                  src={
                    hotel.images && hotel.images.length > 0
                      ? hotel.images[0]
                      : "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  alt={hotel.title}
                  className="hotel-img"
                />
                <h3>{hotel.title}</h3>
                <p>{hotel.description}</p>

                <div className="edit-buttons">
                  <button onClick={() => startEdit(hotel)}>✏️ Edit</button>
                  <button onClick={() => deleteHotel(hotel._id)}>🗑 Delete</button>
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
