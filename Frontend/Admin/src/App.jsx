import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import AdminSignIn from "./components/AdminSignin";
import Sidebar from "./components/common/Sidebar";
import Headerbar from "./components/common/Headerbar";
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
import ViewBanners from "./components/ViewBanners.jsx";
import CreateBanner from "./components/CreateBanner.jsx";
import OrderList from "./components/OrdersList.jsx";

function App() {
  const { token } = useAuth();

  const routes = [
    { path: "/adminpanel", element: <Dashboard /> },
    { path: "/adminpanel/dashboard", element: <Dashboard /> },
    { path: "/adminpanel/date", element: <DatePick /> },
    { path: "/adminpanel/dashboard/sales-report", element: <SalesReport /> },
    { path: "/adminpanel/products/view-all", element: <ViewProducts /> },
    { path: "/adminpanel/products/add", element: <AddProduct /> },
    { path: "/adminpanel/products/edit/:productId", element: <EditProduct /> },
    { path: "/adminpanel/category/view-all", element: <CategoryList /> },
    { path: "/adminpanel/category/add", element: <AddCategory /> },
    { path: "/adminpanel/offers", element: <ViewOffers /> },
    { path: "/adminpanel/offers/add", element: <CreateOffer /> },
    { path: "/adminpanel/coupons", element: <ViewCoupons /> },
    { path: "/adminpanel/coupons/add", element: <AddCoupon /> },
    { path: "/adminpanel/users/view-all", element: <UsersList /> },
    { path: "/adminpanel/users/view", element: <UserDetails /> },
    { path: "/adminpanel/orders/view-all", element: <OrderList /> },
    { path: "/adminpanel/users/view", element: <UserDetails /> },
    { path: "/adminpanel/banners", element: <ViewBanners /> },
    { path: "/adminpanel/banners/add", element: <CreateBanner /> },
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
