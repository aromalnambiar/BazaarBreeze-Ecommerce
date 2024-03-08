import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [expandedMenu, setExpandedMenu] = useState(null);
  const navigate = useNavigate();

  const handleMenuClick = (index) => {
    setExpandedMenu((prev) => (prev === index ? null : index));
  };

  const renderArrowIcon = (index) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 inline-block absolute right-4 ${expandedMenu === index ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={expandedMenu === index ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
    </svg>
  );

  const menuItems = [
    {
      label: "Dashboard",
      links: [
        { to: "/adminpanel/dashboard", text: "View Dashboard" },
        { to: "/adminpanel/dashboard/sales-report", text: "Sales report" },
      ],
    },
    {
      label: "Products",
      links: [
        { to: "/adminpanel/products/view-all", text: "View all products" },
        { to: "/adminpanel/products/add", text: "Add product" },
      ],
    },
    {
      label: "Order",
      links: [
        { to: "/adminpanel/orders/view-all", text: "View all orders" },
        {
          to: "/adminpanel/order/view",
          text: "View Order Details",
        },
      ],
    },
    {
      label: "Users",
      links: [
        { to: "/adminpanel/users/view-all", text: "All users" },
        { to: "/adminpanel/users/view", text: "User details" },
      ],
    },
    {
      label: "Categories",
      links: [
        { to: "/adminpanel/category/view-all", text: "View all categories" },
        { to: "/adminpanel/category/add", text: "Add category" },
      ],
    },
    {
      label: "Offers",
      links: [
        { to: "/adminpanel/offers", text: "View all offers" },
        { to: "/adminpanel/offers/add", text: "Add offer" },
      ],
    },
    {
      label: "Coupons",
      links: [
        { to: "/adminpanel/coupons", text: "View all coupons" },
        { to: "/adminpanel/coupons/add", text: "Add coupon" },
      ],
    },
    {
      label: "Banners",
      links: [
        { to: "/adminpanel/banners", text: "View all banners" },
        { to: "/adminpanel/banners/add", text: "Add banner" },
      ],
    },
  ];

  return (
    <div className="col-span-2 border p-4 px-[4px] h-full bg-white min-w-[230px] text-[#333] z-50 fixed">
      <h1 className="font-bold text-2xl ml-2 text-blue-600 mb-4">Admin Panel</h1>
      <ul className="list-none relative">
        {menuItems.map((menuItem, index) => (
          <li key={index} className={`p-2 my-2 px-2 rounded-md cursor-pointer transition-colors duration-300 ${expandedMenu === index ? "bg-blue-100" : "hover:bg-blue-50"}`}>
            <span className="inline-block w-full text-base font-normal" onClick={() => handleMenuClick(index)}>
              {menuItem.label}
            </span>
            {renderArrowIcon(index)}
            {expandedMenu === index && (
              <ul className="flex flex-col gap-2 pt-2">
                {menuItem.links.map((link, subIndex) => (
                  <Link key={subIndex} to={link.to}>
                    <li className="pl-6 my-1 text-sm hover:text-blue-600">{link.text}</li>
                  </Link>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
