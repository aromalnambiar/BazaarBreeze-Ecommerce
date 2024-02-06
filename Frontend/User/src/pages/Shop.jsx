import {Routes,Route} from "react-router-dom";
import Checkout from "../components/shop/Checkout";
import CheckoutSuccess from "../components/shop/CheckoutSuccess";

function Shop() {
    return (
    <>
        <Routes>
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkoutsuccess" element={<CheckoutSuccess />} />
        </Routes>
    </>        
    )
}

export default Shop
