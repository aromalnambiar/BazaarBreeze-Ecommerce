import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import Shop from "./pages/Shop";
import User from "./pages/User";
import Cart from "./pages/Cart";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import AdminHome from "./pages/AdminHome";
import Layout from "./components/common/Layout";
import MaxWidth from "./components/common/MaxWidth";

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  console.log("user : ", isAuthenticated);
  const isAdminAuthenticated = useSelector((state) => state.auth.isAdminAuthenticated);
  console.log("admin : ", isAdminAuthenticated);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/*"
            element={
              <Layout>
                <MaxWidth>
                  <Routes>
                    <Route path="/shop/*" element={<Shop />} />
                    <Route path="/user/*" element={<User />} />
                    <Route path="/cart/*" element={<Cart />} />
                    <Route path="/dashboard/*" element={<Dashboard />} />
                    <Route path="/" element={<Home />} />
                  </Routes>
                </MaxWidth>
              </Layout>
            }
          />
          <Route path="/admin/*" element={<AdminHome />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
