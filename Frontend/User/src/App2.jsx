import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Shop from "./pages/Shop";
import User from "./pages/User";
import Cart from "./pages/Cart";
import Home from "./pages/Home";
import Product from "./components/product/Product";
import Dashboard from "./components/dashboard/Dashboard";
import Layout from "./components/common/Layout";
import MaxWidth from "./components/common/MaxWidth";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "./redux/reducers/authSlice";
import Wishlist from "./components/cart/Wishlist";
import Filter from "./pages/Filter";

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const routes = [
    { path: "/shop/*", element: <Shop /> },
    { path: "/user/*", element: <User /> },
    { path: "/cart/*", element: <Cart /> },
    { path: "/wishlist/*", element: <Wishlist /> },
    { path: "/product/:id", element: <Product /> },
    { path: "/dashboard/*", element: <Dashboard /> },
    { path: "/filter/*", element: <Filter /> },
    { path: "/Offers/*", element: <Filter /> },
    { path: "/*", element: <Home /> },
  ];
  return (
    <>
      <BrowserRouter>
        <Layout>
          <MaxWidth>
            <Routes>
              {routes.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
              ))}
            </Routes>
          </MaxWidth>
        </Layout>
      </BrowserRouter>
    </>
  );
}

export default App;
