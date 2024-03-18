import Banner from "../components/product/Banner.jsx";
import BestDeals from "../components/product/BestDeals";
import FeaturedProducts from "../components/product/FeaturedProducts";
import ShopWithCategories from "../components/product/ShopWithCategories";
import NotFound from "../components/common/NotFound";
import { useParams } from "react-router-dom";

function Home() {
  const d = useParams();
  // console.log(d);
  const section = d["*"];
  // console.log(section);

  const renderComponentBasedOnRoute = () => {
    switch (section) {
      case "":
        return (
          <>
            <Banner />
            <BestDeals />
            <ShopWithCategories />
            <FeaturedProducts />
          </>
        );
      case "home":
        return (
          <>
            <Banner />
            <BestDeals />
            <ShopWithCategories />
            <FeaturedProducts />
          </>
        );
      default:
        return <NotFound />;
    }
  };

  return <>{renderComponentBasedOnRoute()};</>;
}

export default Home;
