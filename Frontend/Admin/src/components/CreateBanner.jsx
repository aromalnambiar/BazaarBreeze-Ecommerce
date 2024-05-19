import  { useState } from "react";
import { BASE_URL } from "../../config";
import Swal from "sweetalert2";
import axios from "axios";

const CreateBanner = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
    link: "",
    startDate: "",
    endDate: "",
    isActive: false,
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      image: file,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (formData.title.trim() === "" || formData.description.trim() === "" || formData.link.trim() === "" || formData.startDate.trim() === "" || formData.endDate.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill in all required fields!",
      });
      return false;
    }
    if (formData.title.length > 25 || formData.description.length > 50 || formData.link.length > 40) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Length exceeded (title:max 20, description:max 50, link:max 40) !",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const formDataForServer = new FormData();
      // Append all form data to FormData
      Object.keys(formData).forEach((key) => {
        formDataForServer.append(key, formData[key]);
      });

      const response = await axios.post(`${BASE_URL}/admin/banner`, formDataForServer, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Banner created successfully:", response.data);
    } catch (error) {
      console.error("Error creating banner:", error.message);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
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
          <label className="block text-gray-600 font-semibold mb-2">Image</label>
          <input type="file" accept="image/*" name="image" onChange={handleImageChange} className="w-full border rounded-md p-2" />
          {formData.image && <img src={URL.createObjectURL(formData.image)} alt="Preview" className="mt-2 border rounded-md" style={{ maxWidth: "100%", maxHeight: "200px" }} />}
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

export default CreateBanner;
