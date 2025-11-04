// Admin/src/Pages/AddHotel.jsx
import { useState } from "react";
import { API_URL } from "../api.js";

const AddHotel = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [totalRooms, setTotalRooms] = useState(10); // 1. Add state for totalRooms
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Uploading...");
    setLoading(true);
    const token = localStorage.getItem('adminToken'); // Get token

    if (!token) {
      setMessage("❌ You are not logged in.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("totalRooms", totalRooms); // 2. Append totalRooms to form data
      images.forEach((img) => formData.append("images", img));

      const res = await fetch(`${API_URL}/hotels`, {
        method: "POST",
        headers: {
          // Note: Content-Type is NOT set for FormData, browser does it
          'Authorization': `Bearer ${token}`, // Add auth header
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Hotel added successfully!");
        setTitle("");
        setDescription("");
        setImages([]);
        setTotalRooms(10); // 3. Reset totalRooms
        e.target.reset(); // Reset file input
      } else {
        setMessage("❌ " + (data.error || "Failed to add hotel"));
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-hotel">
      <h2>Add New Hotel</h2>

      <form onSubmit={handleSubmit} className="add-hotel-form">
        <input
          type="text"
          placeholder="Hotel Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Hotel Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
        
        {/* 4. Add input for totalRooms */}
        <label htmlFor="totalRooms" style={{ margin: '10px 0 5px', display: 'block' }}>Total Rooms:</label>
        <input
          type="number"
          id="totalRooms"
          placeholder="Total Rooms"
          value={totalRooms}
          onChange={(e) => setTotalRooms(e.target.value)}
          required
          min="1"
        />

        <label htmlFor="images" style={{ margin: '10px 0 5px', display: 'block' }}>Images (Max 3):</label>
        <input
          type="file"
          id="images"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Hotel"}
        </button>
      </form>

      {message && <p className="status">{message}</p>}
    </div>
  );
};

export default AddHotel;