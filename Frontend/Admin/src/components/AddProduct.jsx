import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../../User/config";
import AddImages from "./AddImages";
import Swal from "sweetalert2";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    productName: "",
    brand: "",
    category: "",
    productVariant: "",
    color: "",
    stock: 0,
    regularPrice: 0,
    salePrice: 0,
    description: "",
  });

  const [specifications, setSpecifications] = useState([{ name: "", value: "" }]);
  const [images, setImages] = useState([]);
  const [imagesObjects, setImagesObjects] = useState([]);
  const [isProductAdded, setIsProductAdded] = useState(false);
  const [productId, setProductId] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([]);

  //for category fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin/categories`, {
          headers: {
            Authorization: `${localStorage.getItem("adminToken")}`,
          },
        });
        setCategoryOptions(response.data.categories);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAddProduct = async () => {
    try {
      if (!formData.productName || formData.productName.trim() === "" || formData.productName.split(/\s+/).length > 15) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Product name must not be empty, whitespace only, or exceed 15 words!",
        });
        return;
      }

      // Check for empty or whitespace description and limit length to 100 characters
      if (!formData.description || formData.description.trim() === "" || formData.description.length > 100) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Description must not be empty, whitespace only, or exceed 100 characters!",
        });
        return;
      }

      // Check for empty branch or limit length to 10 characters
      if (!formData.brand || formData.brand.trim() === "" || formData.brand.length > 10) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Brand must not be empty, whitespace only, or exceed 10 characters!",
        });
        return;
      }

      // Check if category is selected
      if (!formData.category) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please select a category!",
        });
        return;
      }
      const response = await axios.post(
        `${BASE_URL}/admin/products`,
        {
          brand: formData.brand.trim(),
          name: formData.productName.trim(),
          category: formData.category,
          description: formData.description.trim(),
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("adminToken")}`,
          },
        }
      );

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
        title: "Product added successfully",
      });
      setProductId(response.data.productId);
      setIsProductAdded(true);
    } catch (error) {
      // console.error("Error adding product:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  };

  const handleImageUpload = (e) => {
    if (isProductAdded && images.length < 8) {
      const file = e.target.files[0];

      if (file) {
        setImages([...images, URL.createObjectURL(file)]);
        setImagesObjects([...imagesObjects, file]);
      }
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...images];
    const updatedImagesObjects = [...imagesObjects];
    updatedImages.splice(index, 1);
    updatedImagesObjects.splice(index, 1);
    setImages(updatedImages);
    setImagesObjects(updatedImagesObjects);
  };

  const handleSendDataToVariant = async () => {
    try {
      if (!formData.stock || !formData.regularPrice || !formData.salePrice || !formData.productVariant || imagesObjects.length === 0 || specifications.length === 0) {
        Swal.fire({
          title: "Fill all!",
          text: "Please fill in all required fields and also add specifications and images.",
          icon: "error",
        });
        return;
      }

      if (formData.productVariant.length > 15 || formData.productVariant.trim() === "") {
        Swal.fire({
          title: "Invalid input!",
          text: "Variant name must not exceed 15 characters and it must not be empty space.",
          icon: "error",
        });
        return;
      }

      const numericRegex = /^\d+$/;
      if (!numericRegex.test(formData.stock) || !numericRegex.test(formData.regularPrice) || !numericRegex.test(formData.salePrice)) {
        Swal.fire({
          title: "Invalid input!",
          text: "Stock, Regular Price, and Sale Price must contain only numbers.",
          icon: "error",
        });
        return;
      }
      if (formData.regularPrice < 500 || formData.salePrice < 500) {
        Swal.fire({
          title: "Invalid input!",
          text: " Regular Price, and Sale Price must not be less than 500.",
          icon: "error",
        });
        return;
      }
      if (imagesObjects.length === 0) {
        Swal.fire({
          title: "Fill all!",
          text: "At least one image is required.",
          icon: "error",
        });
        return;
      }

      if (specifications.some((spec) => !spec.name || !spec.value)) {
        Swal.fire({
          title: "Fill all!",
          text: "Specifications must not be empty.",
          icon: "error",
        });
        return;
      }

      const confirmed = await Swal.fire({
        title: "Are you sure?",
        text: "Your edit will be submitted!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Submit!",
      });

      if (confirmed.isConfirmed) {
        const variantFormData = new FormData();
        variantFormData.append("productId", productId);
        variantFormData.append("stock", formData.stock);
        variantFormData.append("color", formData.color);
        variantFormData.append("regularprice", formData.regularPrice);
        variantFormData.append("specialprice", formData.salePrice);
        variantFormData.append("variantName", formData.productVariant);

        imagesObjects.forEach((image, index) => {
          variantFormData.append("photos", image);
        });

        specifications.forEach((spec, index) => {
          variantFormData.append(`specification[${index}][name]`, spec.name);
          variantFormData.append(`specification[${index}][value]`, spec.value);
        });

        const variantResponse = await axios.put(`${BASE_URL}/admin/products/variant/${variantId}`, variantFormData, {
          headers: {
            Authorization: `${localStorage.getItem("adminToken")}`,
          },
        });

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
          title: "Product Variant added successfully",
        });
      }
    } catch (error) {
      console.error("Error adding product variant:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  };

  const clearVariant = () => {
    setFormData({
      ...formData,
      stock: 0,
      color: "",
      regularPrice: 0,
      salePrice: 0,
    });
    setSpecifications([{ name: "", value: "" }]);
    setImages([]);
    setImagesObjects([]);
  };

  const handleAddSpecification = () => {
    setSpecifications([...specifications, { name: "", value: "" }]);
  };

  const handleSpecificationChange = (index, field, e) => {
    const updatedSpecifications = [...specifications];
    updatedSpecifications[index][field] = e.target.value;
    setSpecifications(updatedSpecifications);
  };

  const handleRemoveSpecification = (index) => {
    const updatedSpecifications = [...specifications];
    updatedSpecifications.splice(index, 1);
    setSpecifications(updatedSpecifications);
  };

  const renderProductInformation = () => (
    <>
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">Variant name</label>
        <input value={formData.productVariant} type="text" className="w-full border border-gray-300 p-2" onChange={(e) => handleInputChange("productVariant", e.target.value)} />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">Stock</label>
        <input type="number" value={formData.stock} className="w-full border border-gray-300 p-2" onChange={(e) => handleInputChange("stock", e.target.value)} />
      </div>
      <div className="flex mb-4">
        <div className="w-1/2 pr-2">
          <label className="block text-sm font-semibold mb-1">Regular Price</label>
          <input value={formData.regularPrice} type="number" className="w-full border border-gray-300 p-2" onChange={(e) => handleInputChange("regularPrice", e.target.value)} />
        </div>
        <div className="w-1/2 pl-2">
          <label className="block text-sm font-semibold mb-1">Sale Price</label>
          <input value={formData.salePrice} type="number" className="w-full border border-gray-300 p-2" onChange={(e) => handleInputChange("salePrice", e.target.value)} />
        </div>
      </div>
    </>
  );

  return (
    <div className="bg-white p-8 shadow-md rounded-md max-w-3xl mx-auto text-[#566A7F]">
      <h2 className="text-left text-2xl font-bold mb-6">Product Information</h2>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">Name</label>
        <input type="text" className="w-full border border-gray-300 p-2" onChange={(e) => handleInputChange("productName", e.target.value)} />
      </div>

      <div className="flex mb-4">
        <div className="w-1/2 pr-2">
          <label className="block text-sm font-semibold mb-1">Brand</label>
          <input type="text" className="w-full border border-gray-300 p-2" onChange={(e) => handleInputChange("brand", e.target.value)} />
        </div>
        <div className="w-1/2 pl-2">
          <label className="block text-sm font-semibold mb-1">Category</label>
          <select className="w-full border border-gray-300 p-2" value={formData.category} onChange={(e) => handleInputChange("category", e.target.value)}>
            <option value="" disabled>
              Select a category
            </option>
            {categoryOptions.map((option) => (
              <option key={option._id} value={option._id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">Description</label>
        <textarea className="w-full border border-gray-300 p-2" rows="6" onChange={(e) => handleInputChange("description", e.target.value)}></textarea>
      </div>

      <button className="bg-blue-500 mb-8 text-white py-2 px-4 rounded-md mt-6" onClick={handleAddProduct}>
        Add Product
      </button>

      {isProductAdded && (
        <>
          {renderProductInformation()}
          <AddImages images={images} onImageUpload={handleImageUpload} onRemoveImage={handleRemoveImage} />
          <div className="mt-10">
            <label className="block text-xl font-semibold mb-4">Specifications</label>
            {specifications.map((spec, index) => (
              <div key={index} className="flex mb-4">
                <input type="text" className="w-1/2 mr-4 border border-gray-300 p-3 rounded-md" placeholder="Specification Name" value={spec.name} onChange={(e) => handleSpecificationChange(index, "name", e)} />
                <input type="text" className="w-1/2 border border-gray-300 p-3 rounded-md" placeholder="Define Specification" value={spec.value} onChange={(e) => handleSpecificationChange(index, "value", e)} />
                <button type="button" className="ml-4 text-red-600" onClick={() => handleRemoveSpecification(index)}>
                  Remove
                </button>
              </div>
            ))}
            <button type="button" className="bg-green-500 text-white py-2 px-4 rounded-md" onClick={handleAddSpecification}>
              Add Specification
            </button>
          </div>
          <button type="button" className="bg-lime-500 ms-auto block py-4 my-8 text-white  px-4 rounded-md" onClick={handleSendDataToVariant}>
            Send Data to Variant
          </button>
          <button type="button" className="bg-orange-500 ms-auto block py-4 my-8 text-white  px-4 rounded-md" onClick={clearVariant}>
            Add another variant
          </button>
        </>
      )}
    </div>
  );
};

export default AddProduct;
