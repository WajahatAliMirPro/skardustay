// Admin/src/Pages/AddHotel.jsx
import { useState } from "react";
import { API_URL } from "../api.js";

const AddHotel = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
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

        <input
          type="file"
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

