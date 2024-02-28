import { Routes, Route } from "react-router-dom";
import Checkout from "../components/shop/Checkout";
import CheckoutSuccess from "../components/shop/CheckoutSuccess";
import ChooseAddress from "../components/cart/ChooseAddress";

function Shop() {
  return (
    <>
      <Routes>
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/choose-address" element={<ChooseAddress />} />
        <Route path="/checkoutsuccess" element={<CheckoutSuccess />} />
      </Routes>
    </>
  );
}

export default Shop;
