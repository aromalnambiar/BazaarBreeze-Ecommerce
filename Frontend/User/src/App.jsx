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
import store from "./redux/store/configureStore.js";
import AdminSignIn from "./components/admin/AdminSignin";

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  // console.log("user : ", isAuthenticated);
  const isAdminAuthenticated = useSelector((state) => state.auth.isAdminAuthenticated);
  // console.log("admin : ", isAdminAuthenticated);

  const PrivateRoute = () => {
    // const isAdminAuthenticated = useSelector((state) => state.auth.isAdminAuthenticated);
    const isAdminAuthenticated = true;
    console.log("admin : ", isAdminAuthenticated);
    if (isAdminAuthenticated) {
      return <AdminHome />;
    } else {
      return <AdminSignIn />;
    }
  };

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
                    <Route path="/*" element={<Home />} />
                  </Routes>
                </MaxWidth>
              </Layout>
            }
          />
          <Route path="/admin/*" element={<PrivateRoute />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
