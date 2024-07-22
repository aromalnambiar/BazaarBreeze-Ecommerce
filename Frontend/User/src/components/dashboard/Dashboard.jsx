import { useState } from "react";
import UserDetails from "./UserDetails";
import OrderList from "./OrderList";
import SideNav from "./SideNav";
import EditProfile from "./EditProfile";
import Settings from "./Settings";
import OrderDetails from "./OrderDetails.jsx";
import ShoppingCart from "../cart/ShoppingCart.jsx";
import { Routes, Route } from "react-router-dom";
import Wishlist from "../cart/Wishlist.jsx";
import Wallet from "./Wallet.jsx";
import Offers from "./Offers.jsx";
import { FaBars } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

function Dashboard() {
  const [showMobileNav, setShowMobileNav] = useState(false);

  return (
    <>
      <div className="grid grid-cols-12 px-4 gap-4 my-10">
        <div className="col-span-3 border hidden md:block h-max sticky top-[50px]">
          <SideNav />
        </div>
        <div className="md:hidden">
          <button
            onClick={() => setShowMobileNav(!showMobileNav)}
            className="text-2xl p-2 bg-gray-200 rounded-md"
          >
            <FaBars />
          </button>
        </div>
        {showMobileNav && (
          <div className="fixed left-2 right-2 top-12 sm:top-20 z-50 bg-white">
            <SideNav />
            <IoClose onClick={() => setShowMobileNav(false)}
              className="absolute top-5 right-2 text-3xl px-2 bg-gray-200 rounded-md"/>
          </div>
        )}
        <div className="col-span-12 md:col-span-9 min-h-[70vh]">
          <Routes>
            <Route path="/" element={<UserDetails />} />
            <Route path="orders" element={<OrderList />} />
            <Route path="carts" element={<ShoppingCart />} />
            <Route path="profile" element={<EditProfile />} />
            <Route path="wishlists" element={<Wishlist />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="offers" element={<Offers />} />
            <Route path="settings" element={<Settings />} />
            <Route path="order-details/:orderId" element={<OrderDetails />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
