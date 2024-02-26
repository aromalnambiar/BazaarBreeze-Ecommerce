import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminSignIn from "./components/AdminSignin";
import Sidebar from "./components/common/Sidebar";
import Headerbar from "./components/common/Headerbar";
import { useAuth } from "./context/AuthContext.jsx";

// Import your components
import Dashboard from "./components/Dashboard";
import DatePick from "./components/DatePick";
import SalesReport from "./components/SalesReport";
import ViewProducts from "./components/ViewProducts";
import AddProduct from "./components/AddProduct";
import EditProduct from "./components/EditProduct";
import CategoryList from "./components/CategoryList";
import AddCategory from "./components/AddCategory";
import ViewOffers from "./components/ViewOffers.jsx";
import CreateOffer from "./components/CreateOffer.jsx";
import ViewCoupons from "./components/ViewCoupons.jsx";
import AddCoupon from "./components/AddCoupon.jsx";
import UsersList from "./components/UsersList";
import UserDetails from "./components/UserDetails";
import OrdersList from "./components/OrdersList";
import ViewBanners from "./components/ViewBanners.jsx";
// import AddBanner from "./components/CreateBanner.jsx";
import CreateBanner from "./components/CreateBanner.jsx";

function App() {
  const { token } = useAuth();

  // Define an array of route configurations
  const routes = [
    { path: "/", element: <Dashboard /> },
    { path: "/dashboard", element: <Dashboard /> },
    { path: "/date", element: <DatePick /> },
    { path: "/dashboard/sales-report", element: <SalesReport /> },
    { path: "/products/view-all", element: <ViewProducts /> },
    { path: "/products/add", element: <AddProduct /> },
    { path: "/products/edit/:productId", element: <EditProduct /> },
    { path: "/category/view-all", element: <CategoryList /> },
    { path: "/category/add", element: <AddCategory /> },
    { path: "/offers", element: <ViewOffers /> },
    { path: "/offers/add", element: <CreateOffer /> },
    { path: "/coupons", element: <ViewCoupons /> },
    { path: "/coupons/add", element: <AddCoupon /> },
    { path: "/users/view-all", element: <UsersList /> },
    { path: "/users/view", element: <UserDetails /> },
    { path: "/banners", element: <ViewBanners /> },
    { path: "/banners/add", element: <CreateBanner /> },
  ];

  return (
    <>
      {!token ? (
        <AdminSignIn />
      ) : (
        <BrowserRouter>
          <div className="grid gap-8 grid-cols-12 pr-10 min-h-screen h-full bg-[#f5f5f9]">
            <Sidebar />
            <div className="col-span-12 mb-10 ml-[250px]">
              <Headerbar />
              <Routes>
                {/* Dynamically generate routes based on the array */}
                {routes.map((route, index) => (
                  <Route key={index} path={route.path} element={route.element} />
                ))}
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      )}
    </>
  );
}

export default App;
