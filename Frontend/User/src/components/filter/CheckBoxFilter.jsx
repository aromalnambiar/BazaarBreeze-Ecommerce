// CheckboxFilter.js
import React, { useState } from "react";

const CheckBoxFilter = ({ onOptionChange }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const options = ["Electronics", "Clothing", "Books", "Home Decor"];

  const handleOptionChange = (option) => {
    const updatedOptions = [...selectedOptions];
    const index = updatedOptions.indexOf(option);

    if (index === -1) {
      updatedOptions.push(option);
    } else {
      updatedOptions.splice(index, 1);
    }

    setSelectedOptions(updatedOptions);
    onOptionChange(option);
    console.log("Filtering by:", updatedOptions);
  };

  return (
    <>
      <p className="text-gray-700 mb-4 pl-6">Filter By : </p>
      <div className="flex  flex-col  gap-4 pl-6 text-sm">
        {options.map((option) => (
          <label key={option} className="flex items-center space-x-2  cursor-pointer">
            <input type="checkbox" value={option} checked={selectedOptions.includes(option)} onChange={() => handleOptionChange(option)} className="form-checkbox text-blue-500" />
            <span className="text-gray-800">{option}</span>
          </label>
        ))}
      </div>
    </>
  );
};

export default CheckBoxFilter;
