import { useState } from "react";
import AddImages from "./AddImages";

const AddProduct = () => {
  const [specifications, setSpecifications] = useState([{ name: "", value: "" }]);

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

  const handleAddProduct = () => {
    // Create FormData and append specifications
    const formData = new FormData();
    formData.append("name", "product name"); // Add other fields as needed

    specifications.forEach((spec, index) => {
      formData.append(`specifications[${index}][name]`, spec.name);
      formData.append(`specifications[${index}][value]`, spec.value);
    });

    // Perform the API request with formData
    // axios.post('/api/addProduct', formData, config);
  };

  return (
    <div className="bg-white p-8 shadow-md rounded-md max-w-3xl mx-auto text-[#566A7F]">
      <h2 className="text-left text-2xl font-bold mb-6">Product Information</h2>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">Name</label>
        <input type="text" className="w-full border border-gray-300 p-2" />
      </div>

      <div className="flex mb-4">
        <div className="w-1/2 pr-2">
          <label className="block text-sm font-semibold mb-1">Brand</label>
          <input type="text" className="w-full border border-gray-300 p-2" />
        </div>
        <div className="w-1/2 pl-2">
          <label className="block text-sm font-semibold mb-1">Category</label>
          <input type="text" className="w-full border border-gray-300 p-2" />
        </div>
      </div>

      <div className="flex mb-4">
        <div className="w-1/2 pr-2">
          <label className="block text-sm font-semibold mb-1">Product Variant</label>
          <input type="text" className="w-full border border-gray-300 p-2" />
        </div>
        <div className="w-1/2 pl-2">
          <label className="block text-sm font-semibold mb-1">Color</label>
          <input type="text" className="w-full border border-gray-300 p-2" />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">Stock</label>
        <input type="number" className="w-full border border-gray-300 p-2" />
      </div>

      <div className="flex mb-4">
        <div className="w-1/2 pr-2">
          <label className="block text-sm font-semibold mb-1">Regular Price</label>
          <input type="number" className="w-full border border-gray-300 p-2" />
        </div>
        <div className="w-1/2 pl-2">
          <label className="block text-sm font-semibold mb-1">Sale Price</label>
          <input type="number" className="w-full border border-gray-300 p-2" />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">Description</label>
        <textarea className="w-full border border-gray-300 p-2" rows="6"></textarea>
      </div>

      <button className="bg-blue-500 text-white py-2 px-4 rounded-md mt-6">Add Product</button>
      <AddImages />

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
    </div>
  );
};

export default AddProduct;
