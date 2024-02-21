import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../config";

const CreateOffer = () => {
  const initialFormData = {
    discountType: "FixedAmount",
    discountValue: 0,
    validFrom: "",
    validUntil: "",
    isActive: true,
    description: "",
    offerType: "Category",
  };

  const [formData, setFormData] = useState(initialFormData);

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
      console.log("formdata : ", formData);
      // Send data to the server using Axios
      const response = await axios.post(`${BASE_URL}/admin/offer`, formData, {
        headers: {
          Authorization: `${localStorage.getItem("adminToken")}`,
        },
      });

      // Handle the server response as needed
      console.log("Server response:", response.data);

      // Optionally, reset the form after successful submission
      setFormData(initialFormData);
    } catch (error) {
      console.error("Error submitting form:", error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Offer Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="discountType" className="block text-sm font-medium text-gray-600">
            Discount Type
          </label>
          <select id="discountType" name="discountType" value={formData.discountType} onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded-md w-full">
            <option value="FixedAmount">Fixed Amount</option>
            <option value="Percentage">Percentage</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="discountValue" className="block text-sm font-medium text-gray-600">
            Discount Value
          </label>
          <input type="number" id="discountValue" name="discountValue" value={formData.discountValue} placeholder="40" onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded-md w-full" />
        </div>

        <div className="mb-4">
          <label htmlFor="validFrom" className="block text-sm font-medium text-gray-600">
            Valid From
          </label>
          <input type="datetime-local" id="validFrom" name="validFrom" value={formData.validFrom} onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded-md w-full" />
        </div>

        <div className="mb-4">
          <label htmlFor="validUntil" className="block text-sm font-medium text-gray-600">
            Valid Until
          </label>
          <input type="datetime-local" id="validUntil" name="validUntil" value={formData.validUntil} onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded-md w-full" />
        </div>

        <div className="mb-4">
          <label htmlFor="isActive" className="flex items-center">
            <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={() => setFormData((prevData) => ({ ...prevData, isActive: !prevData.isActive }))} className="mr-2" />
            <span className="text-sm font-medium text-gray-600">Is Active</span>
          </label>
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-600">
            Description
          </label>
          <textarea id="description" name="description" value={formData.description} placeholder="New Year Special - $50 off on a specific category" onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded-md w-full" />
        </div>

        <div className="mb-4">
          <label htmlFor="offerType" className="block text-sm font-medium text-gray-600">
            Offer Type
          </label>
          <select id="offerType" name="offerType" value={formData.offerType} onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded-md w-full">
            <option value="Category">Category</option>
            <option value="Product">Product</option>
            <option value="Referral">Referral</option>
          </select>
        </div>

        <div className="mt-4">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateOffer;
