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
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { logout } from "./redux/reducers/authSlice";

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);
  }, []);

  useEffect(() => {
    console.log("Inside socket1 : ", socket);
    if (socket) {
      console.count("socket : ", socket);
      socket.on("blockUser", () => {
        console.log("I am getting executed socket");
        try {
          dispatch(logout());
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          console.log("Logout dispatched successfully");
        } catch (error) {
          console.error("Error dispatching logout:", error);
        }
      });
    }
  }, [socket, dispatch]);

  return (
    <>
      <BrowserRouter>
        <Layout>
          <MaxWidth>
            <Routes>
              <Route path="/shop/*" element={<Shop />} />
              <Route path="/user/*" element={isAuthenticated ? <Navigate to="/dashboard" /> : <User />} />
              <Route path="/cart/*" element={<Cart />} />
              <Route path="/product/:id" element={<Product />} />
              <Route path="/dashboard/*" element={isAuthenticated ? <Dashboard /> : <Navigate to="/user/signin" />} />
              <Route path="/*" element={<Home />} />
            </Routes>
          </MaxWidth>
        </Layout>
      </BrowserRouter>
    </>
  );
}

export default App;
