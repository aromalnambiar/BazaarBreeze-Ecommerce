// Import necessary libraries
import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../config";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
// Define the CouponForm component
const AddCoupon = () => {
  // State to manage form input values
  const [formData, setFormData] = useState({
    code: "",
    discountType: "Percentage",
    discountValue: 0,
    validFrom: "",
    validUntil: "",
    isActive: true,
    couponName: "",
    description: "",
  });

  const navigate = useNavigate();
  // Handle input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send the user input values to the API using Axios
      const response = await axios.post(`${BASE_URL}/admin/coupon`, formData, {
        headers: {
          Authorization: `${localStorage.getItem("adminToken")}`,
        },
      });
      console.log("Coupon created successfully:", response.data);
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "success",
        title: "Coupon created successfully",
      });
      navigate("/coupons");
    } catch (error) {
      console.error("Error creating coupon:", error.message);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Coupon Form</h2>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Code */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Code</label>
          <input type="text" name="code" value={formData.code} onChange={handleInputChange} className="mt-1 p-2 border rounded-md w-full" required />
        </div>

        {/* Discount Type */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Discount Type</label>
          <select name="discountType" value={formData.discountType} onChange={handleInputChange} className="mt-1 p-2 border rounded-md w-full" required>
            <option value="Percentage">Percentage</option>
            <option value="FixedAmount">Fixed Amount</option>
          </select>
        </div>

        {/* Discount Value */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Discount Value</label>
          <input type="number" name="discountValue" value={formData.discountValue} onChange={handleInputChange} className="mt-1 p-2 border rounded-md w-full" required />
        </div>

        {/* Valid From */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Valid From</label>
          <input type="datetime-local" name="validFrom" value={formData.validFrom} onChange={handleInputChange} className="mt-1 p-2 border rounded-md w-full" required />
        </div>

        {/* Valid Until */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Valid Until</label>
          <input type="datetime-local" name="validUntil" value={formData.validUntil} onChange={handleInputChange} className="mt-1 p-2 border rounded-md w-full" required />
        </div>

        {/* IsActive */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Is Active</label>
          <input type="checkbox" name="isActive" checked={formData.isActive} onChange={() => setFormData({ ...formData, isActive: !formData.isActive })} className="mt-1" />
        </div>

        {/* Coupon Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Coupon Name</label>
          <input type="text" name="couponName" value={formData.couponName} onChange={handleInputChange} className="mt-1 p-2 border rounded-md w-full" required />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Description</label>
          <textarea name="description" value={formData.description} onChange={handleInputChange} className="mt-1 p-2 border rounded-md w-full" rows="4" required></textarea>
        </div>

        {/* Submit Button */}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
          Create Coupon
        </button>
      </form>
    </div>
  );
};

export default AddCoupon;
