// RadioButtonFilter.js
import React, { useState } from "react";

const PriceFilter = ({ onPriceChange }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const options = [100, 300, 500, 1000, 2000];

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    console.log(`Filtering by: ${option}`);
    onPriceChange(option);
  };
  // console.log("selectedOption : ", selectedOption);
  return (
    <div className="flex flex-col space-y-2 mt-8 items-start pl-2 space-x-4">
      <span className="text-gray-700 pl-4 mb-4">Price Range : </span>
      {options.map((option) => (
        <label key={option} className="flex items-center space-x-2 cursor-pointer">
          <input type="radio" name="filter" value={option} checked={selectedOption === option} onChange={() => handleOptionChange(option)} className="form-radio text-blue-500" />
          <span className="text-gray-800">{option}</span>
        </label>
      ))}
    </div>
  );
};

export default PriceFilter;
