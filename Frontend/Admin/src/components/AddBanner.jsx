import React, { useState } from "react";
import axios from "axios";

const AddBanner = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    link: "",
    startDate: "",
    endDate: "",
    isActive: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Assuming your API endpoint for creating a banner is '/api/banners'
      const response = await axios.post("/api/banners", formData);

      // Handle success, e.g., show a success message
      console.log("Banner created successfully:", response.data);
    } catch (error) {
      // Handle error, e.g., show an error message
      console.error("Error creating banner:", error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Create New Banner</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-600 font-semibold mb-2">Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border rounded-md p-2" required />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 font-semibold mb-2">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border rounded-md p-2" required />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 font-semibold mb-2">Image URL</label>
          <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="w-full border rounded-md p-2" required />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 font-semibold mb-2">Link</label>
          <input type="text" name="link" value={formData.link} onChange={handleChange} className="w-full border rounded-md p-2" required />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 font-semibold mb-2">Start Date</label>
          <input type="datetime-local" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full border rounded-md p-2" required />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 font-semibold mb-2">End Date</label>
          <input type="datetime-local" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full border rounded-md p-2" required />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 font-semibold mb-2">Is Active</label>
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={() =>
              setFormData((prevData) => ({
                ...prevData,
                isActive: !prevData.isActive,
              }))
            }
            className="mr-2"
          />
          <span className="text-gray-700">Activate Banner</span>
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Create Banner
        </button>
      </form>
    </div>
  );
};

export default AddBanner;
