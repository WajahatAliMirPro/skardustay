import { useState } from "react";
import { API_URL } from "../api";

const AddHotel = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Uploading...");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      images.forEach((img) => formData.append("images", img));

      const res = await fetch(`${API_URL}/hotels`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Hotel added successfully!");
        setTitle("");
        setDescription("");
        setImages([]);
      } else {
        setMessage("❌ " + (data.error || "Failed to add hotel"));
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Something went wrong!");
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

        {/* Optional: Preview selected images */}
        <div className="preview">
          {images.length > 0 &&
            images.map((img, i) => (
              <img
                key={i}
                src={URL.createObjectURL(img)}
                alt="preview"
                className="preview-img"
              />
            ))}
        </div>

        <button type="submit">Add Hotel</button>
      </form>

      {message && <p className="status">{message}</p>}
    </div>
  );
};

export default AddHotel;
