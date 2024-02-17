// src/PriceRangeSlider.js
import React, { useState } from "react";

const PriceRangeSlider = () => {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);

  const handleMinChange = (e) => {
    setMinPrice(e.target.value);
  };

  const handleMaxChange = (e) => {
    setMaxPrice(e.target.value);
  };

  return (
    <div className="flex items-center justify-center mt-8">
      <div className="w-96">
        <label className="text-lg font-semibold mb-2 block">Price Range</label>

        <div className="flex items-center justify-between">
          <span className="text-gray-600">${minPrice}</span>
          <span className="text-gray-600">${maxPrice}</span>
        </div>

        <input type="range" min="0" max="1000" value={minPrice} onChange={handleMinChange} className="slider-thumb" />

        <input type="range" min="0" max="1000" value={maxPrice} onChange={handleMaxChange} className="slider-thumb" />
      </div>
    </div>
  );
};

export default PriceRangeSlider;
