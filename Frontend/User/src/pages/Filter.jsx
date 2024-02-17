import React from "react";
import SideRadioCategories from "../components/filter/SideRadioCategories";
import Search from "../components/filter/Search.jsx";
import BrandFilter from "../components/filter/BrandFilter.jsx";
import CheckBoxFilter from "../components/filter/CheckBoxFilter.jsx";
import Products from "../components/filter/Products.jsx";

function Filter() {
  return (
    <>
      <div className="grid grid-cols-12 px-4  gap-4 my-10">
        <div className="col-span-3 bg-gray-100 border hidden sticky top-[100px] md:block h-max pb-4">
          <SideRadioCategories />
          <CheckBoxFilter />
          <BrandFilter />
        </div>
        <div className="col-span-12 md:col-span-9  min-h-[70vh]">
          <Search />
          <Products />
        </div>
      </div>
    </>
  );
}

export default Filter;
