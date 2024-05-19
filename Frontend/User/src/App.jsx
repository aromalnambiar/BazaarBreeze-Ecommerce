import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Shop from "./pages/Shop";
import User from "./pages/User";
import Cart from "./pages/Cart";
import Home from "./pages/Home";
import Product from "./components/product/Product";
import Dashboard from "./components/dashboard/Dashboard";
import Layout from "./components/common/Layout";
import MaxWidth from "./components/common/MaxWidth";
import Wishlist from "./components/cart/Wishlist";
import Filter from "./pages/Filter";

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const routes = [
    { path: "/shop/*", element: isAuthenticated ? <Shop /> : <Navigate to="/user/signin" replace /> },
    { path: "/user/*", element: isAuthenticated ? <Navigate to="/dashboard" replace /> : <User /> },
    { path: "/cart/*", element: isAuthenticated ? <Cart /> : <Navigate to="/user/signin" replace /> },
    { path: "/wishlist/*", element: isAuthenticated ? <Wishlist /> : <Navigate to="/user/signin" replace /> },
    { path: "/product/:id", element: isAuthenticated ? <Product /> : <Navigate to="/user/signin" replace /> },
    { path: "/dashboard/*", element: isAuthenticated ? <Dashboard /> : <Navigate to="/user/signin" replace /> },
    { path: "/filter/*", element: <Filter /> },
    { path: "/Offers/*", element: <Filter /> },
    { path: "/*", element: isAuthenticated ? <Home /> : <Navigate to="/user/signin" replace /> },
  ];

  return (
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
  );
}

export default App;
