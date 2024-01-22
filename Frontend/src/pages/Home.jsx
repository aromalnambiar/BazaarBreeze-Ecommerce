import Header from "../components/common/Header";
import BestDeals from "../components/product/BestDeals";
import FeaturedProducts from "../components/product/FeaturedProducts";
import ShopWithCategories from "../components/product/ShopWithCategories";
import ComputerAccessories from "../components/product/ComputerAccessories.jsx";
import QuickBuyProducts from "../components/product/QuickBuyProducts.jsx";
import Footer from "../components/common/Footer.jsx";

function Home() {
  return (
    <>
      <Header />
      <BestDeals />
      <ShopWithCategories />
      <FeaturedProducts />
      <ComputerAccessories />
      <QuickBuyProducts />
      <Footer />
    </>
  );
}

export default Home;
