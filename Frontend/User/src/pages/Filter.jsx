import React, { useState, useEffect } from "react";
import SideRadioCategories from "../components/filter/SideRadioCategories";
import Search from "../components/filter/Search.jsx";
import PriceFilter from "../components/filter/PriceFilter.jsx";
import CheckBoxFilter from "../components/filter/CheckBoxFilter.jsx";
import Products from "../components/filter/Products.jsx";
import { useLocation } from "react-router-dom";

function Filter() {
  const [filter, setFilter] = useState({
    category: null,
    selectedOptions: [],
    selectedPrice: null,
  });
  let location = useLocation();
  // console.log("location : ", location.state.key);
  const [query, setQuery] = useState();
  const handleCategoryChange = (categoryId) => {
    setFilter((prevFilter) => ({ ...prevFilter, category: categoryId }));
  };

  const handleOptionChange = (option) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      selectedOptions: prevFilter.selectedOptions.includes(option) ? prevFilter.selectedOptions.filter((item) => item !== option) : [...prevFilter.selectedOptions, option],
    }));
  };

  const handlePriceChange = (price) => {
    setFilter((prevFilter) => ({ ...prevFilter, selectedPrice: price }));
  };

  useEffect(() => {
    // Fetch data using updated filter parameters
    const fetchData = async () => {
      try {
        const { category, selectedOptions, selectedPrice } = filter;
        const queryParams = new URLSearchParams();

        if (category) {
          queryParams.append("category", category);
        } else if (location?.state?.key) {
          queryParams.append("category", location?.state?.key);
        }
        if (selectedOptions.length > 0) {
          queryParams.append("selectedOptions", selectedOptions.join(","));
        }

        if (selectedPrice) {
          queryParams.append("selectedBrand", selectedPrice);
        }
        setQuery(queryParams.toString());
        window.scroll(0, 0);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [filter]);

  // console.log("Filter : ", query);
  return (
    <>
      <div className="grid grid-cols-12 px-4  gap-4 my-10">
        <div className="col-span-3 bg-gray-100 border hidden  md:block h-max pb-4">
          <SideRadioCategories onCategoryChange={handleCategoryChange} />
          <CheckBoxFilter onOptionChange={handleOptionChange} />
          <PriceFilter onPriceChange={handlePriceChange} />
        </div>
        <div className="col-span-12 md:col-span-9  min-h-[70vh]">
          <Search />
          <Products query={query} />
        </div>
      </div>
    </>
  );
}

export default Filter;
