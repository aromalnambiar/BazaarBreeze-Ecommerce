import Banner from "../components/product/Banner.jsx";
import BestDeals from "../components/product/BestDeals";
import FeaturedProducts from "../components/product/FeaturedProducts";
import ShopWithCategories from "../components/product/ShopWithCategories";
import ComputerAccessories from "../components/product/ComputerAccessories.jsx";
import QuickBuyProducts from "../components/product/QuickBuyProducts.jsx";
import Product from "../components/product/Product.jsx";
import NotFound from "../components/common/NotFound";
import { Link, useParams } from "react-router-dom";

function Home() {
  const d = useParams();
  console.log(d);
  const section = d["*"];
  console.log(section);

  const renderComponentBasedOnRoute = () => {
    switch (section) {
      case "":
        return (
          <>
            <Banner />
            <BestDeals />
            <ShopWithCategories />
            <FeaturedProducts />
            <ComputerAccessories />
            <QuickBuyProducts />
          </>
        );

      default:
        return <NotFound />;
    }
  };

  return <>{renderComponentBasedOnRoute()};</>;
}

export default Home;
