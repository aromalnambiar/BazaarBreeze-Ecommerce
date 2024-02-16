import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminSignIn from "./components/AdminSignin";
import ViewProducts from "./components/ViewProducts";
import AddProduct from "./components/AddProduct";
import CategoryList from "./components/CategoryList";
import EditCategory from "./components/EditCategory";
import AddCategory from "./components/AddCategory";
import UsersList from "./components/UsersList";
import UserDetails from "./components/UserDetails";
import Sidebar from "./components/common/Sidebar";
import Headerbar from "./components/common/Headerbar";
import EditProduct from "./components/EditProduct";

import OrdersList from "./components/OrdersList";
import Dashboard from "./components/Dashboard";
import SalesReport from "./components/SalesReport";
import DatePick from "./components/DatePick";

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="grid gap-8 grid-cols-12 pr-10 min-h-screen h-full bg-[#f5f5f9]">
          <Sidebar />
          <div className="col-span-12 mb-10 ml-[250px]">
            <Headerbar />
            <Routes>
              <Route path="/" element={<AdminSignIn />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/date" element={<DatePick />} />
              <Route path="/dashboard/sales-report" element={<SalesReport />} />
              <Route path="/products/view-all" element={<ViewProducts />} />
              {/* <Route path="/products/view" element={<AdminSignIn />} /> */}
              {/* <Route path="/products/edit" element={<AdminSignIn />} /> */}
              <Route path="/products/add" element={<AddProduct />} />
              <Route path="/products/edit/:productId" element={<EditProduct />} />
              <Route path="/category/view-all" element={<CategoryList />} />
              <Route path="/category/add" element={<AddCategory />} />
              <Route path="/users/view-all" element={<UsersList />} />
              <Route path="/users/view" element={<UserDetails />} />
              <Route path="/orders/view-all" element={<OrdersList />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
