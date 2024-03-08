import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
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
    selectedCategories: [], // New state for selected categories
    selectedProducts: [], // New state for selected products
  };

  const [formData, setFormData] = useState(initialFormData);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch categories when component mounts
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin/categories`, {
          headers: {
            Authorization: `${localStorage.getItem("adminToken")}`,
          },
        });
        // console.log("response categories : ", response);
        setCategories(response.data.categories);
      } catch (error) {
        // console.error("Error fetching categories:", error.message);
      }
    };

    // Fetch products when component mounts
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin/products`, {
          headers: {
            Authorization: `${localStorage.getItem("adminToken")}`,
          },
        });
        console.log("response of products : ", response);
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error.message);
      }
    };

    if (formData.offerType === "Category") {
      fetchCategories();
    } else if (formData.offerType === "Product") {
      fetchProducts();
    }
  }, [formData.offerType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCategoryCheckboxChange = (categoryId) => {
    // Toggle the selected category
    setFormData((prevData) => ({
      ...prevData,
      selectedCategories: prevData.selectedCategories.includes(categoryId) ? prevData.selectedCategories.filter((id) => id !== categoryId) : [...prevData.selectedCategories, categoryId],
    }));
  };

  const handleProductCheckboxChange = (productId) => {
    // Toggle the selected product
    setFormData((prevData) => ({
      ...prevData,
      selectedProducts: prevData.selectedProducts.includes(productId) ? prevData.selectedProducts.filter((id) => id !== productId) : [...prevData.selectedProducts, productId],
    }));
  };

  const renderCategoryList = () => {
    return (
      <div>
        {categories.map((category) => (
          <div key={category._id} className="mb-2">
            <input type="radio" id={`category_${category._id}`} name="selectedCategories" value={category._id} checked={formData.selectedCategories.includes(category._id)} onChange={() => handleCategoryCheckboxChange(category._id)} />
            <label htmlFor={`category_${category._id}`} className="ml-2">
              {category.name}
            </label>
          </div>
        ))}
      </div>
    );
  };

  const renderProductList = () => {
    return (
      <div>
        {products.map((product) => (
          <div key={product._id} className="mb-2">
            <input type="checkbox" id={`product_${product._id}`} name="selectedProducts" value={product._id} checked={formData.selectedProducts.includes(product._id)} onChange={() => handleProductCheckboxChange(product._id)} />
            <label htmlFor={`product_${product._id}`} className="ml-2">
              {product.name}
            </label>
          </div>
        ))}
      </div>
    );
  };

  const renderOfferDetails = () => {
    if (formData.offerType === "Category") {
      return renderCategoryList();
    } else if (formData.offerType === "Product") {
      return renderProductList();
    }

    return null;
  };

  const validateDiscountValue = (value, discountType) => {
    const maxFixedAmount = 100;
    const maxPercentage = 70;
    const max = discountType === "FixedAmount" ? maxFixedAmount : maxPercentage;

    return value >= 0 && value <= max;
  };

  const validateForm = () => {
    // Check if any required field is empty
    if (
      formData.discountValue === 0 || // Assuming 0 is not a valid value
      formData.validFrom.trim() === "" ||
      formData.validUntil.trim() === "" ||
      formData.description.trim() === "" ||
      (formData.offerType === "Category" && formData.selectedCategories.length === 0) ||
      (formData.offerType === "Product" && formData.selectedProducts.length === 0)
    ) {
      // console.error("Please fill in all required fields.");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill in all required fields.!",
      });
      return false;
    }

    // Validate discount value
    if (!validateDiscountValue(formData.discountValue, formData.discountType)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Invalid discount value. Please enter a valid value based on the discount type(maxFixed:100, maxPercentage:70) .!",
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
      console.log("formdata : ", formData);
      // Send data to the server using Axios
      const response = await axios.post(`${BASE_URL}/admin/offer`, formData, {
        headers: {
          Authorization: `${localStorage.getItem("adminToken")}`,
        },
      });

      // Handle the server response as needed
      // console.log("Server response:", response.data);
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
        title: "Offer added successfully",
      });
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
        {/* Existing form fields */}
        {/* ... */}
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

        {/* Render dynamic category or product list */}
        {renderOfferDetails()}

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

// import React, { useState } from "react";
// import axios from "axios";
// import { BASE_URL } from "../../config";

// const CreateOffer = () => {
//   const initialFormData = {
//     discountType: "FixedAmount",
//     discountValue: 0,
//     validFrom: "",
//     validUntil: "",
//     isActive: true,
//     description: "",
//     offerType: "Category",
//   };

//   const [formData, setFormData] = useState(initialFormData);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       console.log("formdata : ", formData);
//       // Send data to the server using Axios
//       const response = await axios.post(`${BASE_URL}/admin/offer`, formData, {
//         headers: {
//           Authorization: `${localStorage.getItem("adminToken")}`,
//         },
//       });

//       // Handle the server response as needed
//       console.log("Server response:", response.data);

//       // Optionally, reset the form after successful submission
//       setFormData(initialFormData);
//     } catch (error) {
//       console.error("Error submitting form:", error.message);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow-md">
//       <h2 className="text-2xl font-semibold mb-4">Offer Form</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label htmlFor="discountType" className="block text-sm font-medium text-gray-600">
//             Discount Type
//           </label>
//           <select id="discountType" name="discountType" value={formData.discountType} onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded-md w-full">
//             <option value="FixedAmount">Fixed Amount</option>
//             <option value="Percentage">Percentage</option>
//           </select>
//         </div>

//         <div className="mb-4">
//           <label htmlFor="discountValue" className="block text-sm font-medium text-gray-600">
//             Discount Value
//           </label>
//           <input type="number" id="discountValue" name="discountValue" value={formData.discountValue} placeholder="40" onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded-md w-full" />
//         </div>

//         <div className="mb-4">
//           <label htmlFor="validFrom" className="block text-sm font-medium text-gray-600">
//             Valid From
//           </label>
//           <input type="datetime-local" id="validFrom" name="validFrom" value={formData.validFrom} onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded-md w-full" />
//         </div>

//         <div className="mb-4">
//           <label htmlFor="validUntil" className="block text-sm font-medium text-gray-600">
//             Valid Until
//           </label>
//           <input type="datetime-local" id="validUntil" name="validUntil" value={formData.validUntil} onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded-md w-full" />
//         </div>

//         <div className="mb-4">
//           <label htmlFor="isActive" className="flex items-center">
//             <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={() => setFormData((prevData) => ({ ...prevData, isActive: !prevData.isActive }))} className="mr-2" />
//             <span className="text-sm font-medium text-gray-600">Is Active</span>
//           </label>
//         </div>

//         <div className="mb-4">
//           <label htmlFor="description" className="block text-sm font-medium text-gray-600">
//             Description
//           </label>
//           <textarea id="description" name="description" value={formData.description} placeholder="New Year Special - $50 off on a specific category" onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded-md w-full" />
//         </div>

//         <div className="mb-4">
//           <label htmlFor="offerType" className="block text-sm font-medium text-gray-600">
//             Offer Type
//           </label>
//           <select id="offerType" name="offerType" value={formData.offerType} onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded-md w-full">
//             <option value="Category">Category</option>
//             <option value="Product">Product</option>
//             <option value="Referral">Referral</option>
//           </select>
//         </div>

//         <div className="mt-4">
//           <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
//             Submit
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateOffer;
