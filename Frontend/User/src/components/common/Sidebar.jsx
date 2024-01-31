import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [expandedMenu, setExpandedMenu] = useState(null);
  const navigate = useNavigate();

  const handleMenuClick = (index) => {
    setExpandedMenu((prev) => (prev === index ? null : index));
  };

  const renderArrowIcon = (index) => {
    if (expandedMenu === index) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block  absolute right-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      );
    } else {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block absolute right-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      );
    }
  };

  return (
    <div className="col-span-2 border p-4 h-full bg-white min-w-[230px] text-[#697a8d] z-50 fixed ">
      <h1 className="font-bold pl-2 text-2xl my-6">Admin</h1>
      <ul className="list-none  relative">
        <li className={` p-2 my-2 px-2 rounded-md cursor-pointer ${expandedMenu === 0 ? "bg-gray-100" : "  "}`}>
          <span className="inline-block w-full" onClick={() => handleMenuClick(0)}>
            Dashboard
          </span>
          {renderArrowIcon(0)}
          {expandedMenu === 0 && (
            <ul className="flex flex-col gap-4 pt-4">
              <li className="pl-4 my-1">Submenu 1</li>
              <li className="pl-4 my-1">Submenu 2</li>
            </ul>
          )}
        </li>
        <li className={`p-2 my-2 px-2 rounded-md cursor-pointer ${expandedMenu === 1 ? "bg-gray-100" : "  "}`}>
          <span className="inline-block w-full" onClick={() => handleMenuClick(1)}>
            Products
          </span>
          {renderArrowIcon(1)}
          {expandedMenu === 1 && (
            <ul className="flex flex-col gap-4 pt-4">
              <Link to="/admin/view-products">
                <li className="pl-4 my-1">View all products</li>
              </Link>
              <Link to="/admin/add-product">
                <li className="pl-4 my-1">Add product</li>
              </Link>
            </ul>
          )}
        </li>
        <li className={`p-2 my-2  rounded-md cursor-pointer ${expandedMenu === 2 ? "bg-gray-100" : "  "}`}>
          <span className="inline-block w-full" onClick={() => handleMenuClick(2)}>
            Order
          </span>
          {renderArrowIcon(2)}
          {expandedMenu === 2 && (
            <ul className="flex flex-col gap-4 pt-4">
              <li className="pl-4 my-1">Submenu 5</li>
              <li className="pl-4 my-1">Submenu 6</li>
            </ul>
          )}
        </li>
        <li className={`p-2 my-2 px-2 rounded-md cursor-pointer ${expandedMenu === 3 ? "bg-gray-100" : "  "}`}>
          <span className="inline-block w-full" onClick={() => handleMenuClick(3)}>
            Users
          </span>
          {renderArrowIcon(3)}
          {expandedMenu === 3 && (
            <ul className="flex flex-col gap-4 pt-4">
              <Link to={"/admin/users"}>
                <li className="pl-4 my-1">All users</li>
              </Link>
              <Link to={"/admin/user-details"}>
                <li className="pl-4 my-1">User details</li>
              </Link>
            </ul>
          )}
        </li>
        <li className={`p-2 my-2 px-2 rounded-md cursor-pointer ${expandedMenu === 4 ? "bg-gray-100" : "  "}`}>
          <span className="inline-block w-full" onClick={() => handleMenuClick(4)}>
            Categories
          </span>
          {renderArrowIcon(4)}
          {expandedMenu === 4 && (
            <ul className="flex flex-col gap-4 pt-4">
              <Link to="/admin/categories">
                <li className="pl-4 my-1">View all categories</li>
              </Link>
              <Link to="/admin/add-category">
                <li className="pl-4 my-1">Add category</li>
              </Link>
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
