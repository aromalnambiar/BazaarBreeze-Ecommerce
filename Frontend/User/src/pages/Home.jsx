import BestDeals from "../components/product/BestDeals";
import FeaturedProducts from "../components/product/FeaturedProducts";
import ShopWithCategories from "../components/product/ShopWithCategories";
import ComputerAccessories from "../components/product/ComputerAccessories.jsx";
import QuickBuyProducts from "../components/product/QuickBuyProducts.jsx";
import Product from "../components/product/Product.jsx";
import { Link, useParams } from "react-router-dom";

function Home() {
  const d = useParams();
  const section = d["*"];
  console.log(section);

  const renderComponentBasedOnRoute = () => {
    switch (section) {
      case "":
        return (
          <>
            <BestDeals />
            <ShopWithCategories />
            <FeaturedProducts />
            <ComputerAccessories />
            <QuickBuyProducts />
          </>
        );
      case "product":
        return <Product />;

      default:
        return <h3>Invalid url</h3>;
    }
  };

  return <>{renderComponentBasedOnRoute()};</>;
}

export default Home;
