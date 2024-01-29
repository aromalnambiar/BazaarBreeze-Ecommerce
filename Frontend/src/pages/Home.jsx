import Header from "../components/common/Header";
import BestDeals from "../components/product/BestDeals";
import FeaturedProducts from "../components/product/FeaturedProducts";
import ShopWithCategories from "../components/product/ShopWithCategories";
import ComputerAccessories from "../components/product/ComputerAccessories.jsx";
import QuickBuyProducts from "../components/product/QuickBuyProducts.jsx";
import Footer from "../components/common/Footer.jsx";
import SignUp from "../components/user/SignUp.jsx";
import SignIn from "../components/user/SignIn.jsx";
import ForgetPassword from "../components/user/ForgetPassword.jsx";
import EmailVerification from "../components/user/EmailVerification.jsx";
import ResetPassword from "../components/user/ResetPassword.jsx";
import Product from "../components/product/Product.jsx";

function Home() {
  return (
    <>
      {/* <BestDeals /> */}
      {/* <Product /> */}
      <ShopWithCategories />
      <FeaturedProducts />
      <ComputerAccessories />
      <QuickBuyProducts />
      {/* <Signin/> */}
      {/* <ForgetPassword /> */}
      {/* <EmailVerification/> */}
      {/* <Signup/> */}
    </>
  );
}

export default Home;
