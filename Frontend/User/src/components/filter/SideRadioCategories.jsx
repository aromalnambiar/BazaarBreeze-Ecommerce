// src/CategoryFilter.js
import React, { useState } from "react";

const SideRadioCategories = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([
    { id: "electronics", name: "Electronics Devices" },
    { id: "computer", name: "Computer & Laptop" },
    { id: "many-more", name: "Many More" },
    { id: "clothing", name: "Clothing" },
    { id: "furniture", name: "Furniture" },
    { id: "books", name: "Books" },
  ]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div className=" p-4">
      <h2 className="text-lg font-bold mb-4">CATEGORY</h2>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.id}>
            <input type="radio" id={category.id} name="category" className="hidden" />
            <label htmlFor={category.id} className={`cursor-pointer flex items-center space-x-2 p-2 rounded-md transition duration-300 ${selectedCategory === category.id ? "bg-blue-100" : "hover:bg-gray-200"}`} onClick={() => handleCategoryChange(category.id)}>
              <span className="h-4 w-4 border border-gray-400 rounded-full flex items-center justify-center bg-white">
                <input type="radio" id={category.id} name="category" className="hidden" />
                <span className={`h-2 w-2 rounded-full ${selectedCategory === category.id ? "bg-blue-500" : "bg-transparent"}`}></span>
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
