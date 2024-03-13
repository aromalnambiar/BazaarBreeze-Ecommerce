import { useState, useEffect } from "react";

import { BASE_URL } from "../../../config";
import axiosInstance from "../../utils/axiosConfig";

const SideRadioCategories = ({ onCategoryChange }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const result = await axiosInstance.get(`/user/categories`);
        setCategories(result.data.categories);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDetails();
  }, []);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    onCategoryChange(categoryId);
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">CATEGORY</h2>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category._id}>
            <input type="radio" id={category.name} name="category" className="hidden" />
            <label htmlFor={category.name} className={`cursor-pointer flex items-center space-x-2 p-2 rounded-md transition duration-300 ${selectedCategory === category.name ? "bg-blue-100" : "hover:bg-gray-200"}`} onClick={() => handleCategoryChange(category.name)}>
              <span className="h-4 w-4 border border-gray-400 rounded-full flex items-center justify-center bg-white">
                <input type="radio" id={category.name} name="category" className="hidden" />
                <span className={`h-2 w-2 rounded-full ${selectedCategory === category.name ? "bg-blue-500" : "bg-transparent"}`}></span>
              </span>
              <span>{category.name}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideRadioCategories;
