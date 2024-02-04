import React, { useEffect, useState } from "react";
import axios from "axios"; // Import axios for making API requests
import AddImages from "./AddImages";
import { BASE_URL } from "../../../User/config";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const [productName, setProductName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [productVariant, setProductVariant] = useState("");
  const [color, setColor] = useState("");
  const [stock, setStock] = useState(0);
  const [regularPrice, setRegularPrice] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  const [description, setDescription] = useState("");

  const [specifications, setSpecifications] = useState([{ name: "", value: "" }]);
  const [images, setImages] = useState([]);
  const [imagesObjects, setImagesObjects] = useState([]);
  const [isProductAdded, setIsProductAdded] = useState(false);
  const [productId, setProductId] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin/products/category`);
        console.log("category list : ", response);
        setCategoryOptions(response.data.categories);
      } catch (error) {}
    };
    fetchData();
  }, []);

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

  const handleInputChange = (fieldName, value) => {
    // Generic handler for input changes
    switch (fieldName) {
      case "productName":
        setProductName(value);
        break;
      case "brand":
        setBrand(value);
        break;
      case "category":
        setCategory(value);
        break;
      case "productVariant":
        setProductVariant(value);
        break;
      case "color":
        setColor(value);
        break;
      case "stock":
        setStock(value);
        break;
      case "regularPrice":
        setRegularPrice(value);
        break;
      case "salePrice":
        setSalePrice(value);
        break;
      case "description":
        setDescription(value);
        break;
      default:
        break;
    }
  };

  const handleAddProduct = async () => {
    try {
      if (!productName || !brand || !category || !stock || !regularPrice || !salePrice || !description) {
        alert("Please fill in all required fields.");
        return;
      }
      const formData = new FormData();
      formData.append("name", productName);
      formData.append("brand", brand);
      formData.append("category", category);
      formData.append("productVariant", productVariant);
      formData.append("color", color);
      formData.append("stock", stock);
      formData.append("regularPrice", regularPrice);
      formData.append("salePrice", salePrice);
      formData.append("description", description);

      specifications.forEach((spec, index) => {
        formData.append(`specifications[${index}][name]`, spec.name);
        formData.append(`specifications[${index}][value]`, spec.value);
      });

      // Perform the API request with formData
      const response = await axios.post(`${BASE_URL}/admin/products`, {
        brand,
        name: productName,
        category,
        description,
      });

      console.log("RESPONSE : ", response.data);
      setProductId(response.data.productId);

      setIsProductAdded(true);
    } catch (error) {
      console.error("Error adding product:", error);
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
      const variantFormData = new FormData();
      variantFormData.append("productId", productId);
      variantFormData.append("stock", stock);
      variantFormData.append("color", color);
      variantFormData.append("regularprice", regularPrice);
      variantFormData.append("specialprice", salePrice);
      variantFormData.append("variantName", productVariant);

      // images.forEach((image, index) => {
      //   variantFormData.append(`photos[${index}]`, image);
      // });

      // imagesObjects.forEach((image, index) => {
      //   variantFormData.append(`photos[${index}]`, image);
      // });
      imagesObjects.forEach((image, index) => {
        variantFormData.append("photos", image);
      });

      console.log("Images : ", imagesObjects);
      console.log("variantFormData : ", variantFormData);
      specifications.forEach((spec, index) => {
        variantFormData.append(`specification[${index}][name]`, spec.name);
        variantFormData.append(`specification[${index}][value]`, spec.value);
      });

      const variantResponse = await axios.post(`${BASE_URL}/admin/products/variant`, variantFormData);
      navigate("/products/view-all");
      console.log(variantResponse.data);
      alert(variantResponse.data.message);
    } catch (error) {
      console.error("Error adding product variant:", error);
    }
  };

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
          <select className="w-full border border-gray-300 p-2" value={category} onChange={(e) => handleInputChange("category", e.target.value)}>
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
        <label className="block text-sm font-semibold mb-1">Stock</label>
        <input type="number" className="w-full border border-gray-300 p-2" onChange={(e) => handleInputChange("stock", e.target.value)} />
      </div>

      <div className="flex mb-4">
        <div className="w-1/2 pr-2">
          <label className="block text-sm font-semibold mb-1">Regular Price</label>
          <input type="number" className="w-full border border-gray-300 p-2" onChange={(e) => handleInputChange("regularPrice", e.target.value)} />
        </div>
        <div className="w-1/2 pl-2">
          <label className="block text-sm font-semibold mb-1">Sale Price</label>
          <input type="number" className="w-full border border-gray-300 p-2" onChange={(e) => handleInputChange("salePrice", e.target.value)} />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">Description</label>
        <textarea className="w-full border border-gray-300 p-2" rows="6" onChange={(e) => handleInputChange("description", e.target.value)}></textarea>
      </div>

      <button className="bg-blue-500 text-white py-2 px-4 rounded-md mt-6" onClick={handleAddProduct}>
        Add Product
      </button>

      {isProductAdded && (
        <>
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
        </>
      )}
    </div>
  );
};

export default AddProduct;
