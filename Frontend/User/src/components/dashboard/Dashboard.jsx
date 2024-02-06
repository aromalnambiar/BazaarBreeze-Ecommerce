import UserDetails from "./UserDetails";
import OrderList from "./OrderList";
import SideNav from "./SideNav";
import EditProfile from "./EditProfile";
import Settings from "./Settings";
import OrderDetails from "./OrderDetails.jsx";
import ShoppingCart from "../cart/ShoppingCart.jsx";
import { Routes, Route } from "react-router-dom";
import Address from "./Address.jsx";

function Dashboard() {
  return (
    <>
      <div className="grid grid-cols-12  gap-4 my-10">
        <div className="col-span-3 border hidden md:block h-max">
          <SideNav />
        </div>
        <div className="col-span-12 md:col-span-9  min-h-[70vh]">
          <Routes>
            <Route path="/" element={<UserDetails />} />
            <Route path="orders" element={<OrderList />} />
            <Route path="carts" element={<ShoppingCart />} />
            <Route path="profile" element={<EditProfile />} />
            {/* <Route path="address" element={<Address />} /> */}
            <Route path="settings" element={<Settings />} />
            <Route path="order-details/:orderId" element={<OrderDetails />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
