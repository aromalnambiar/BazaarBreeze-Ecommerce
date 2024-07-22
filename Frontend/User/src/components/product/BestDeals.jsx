import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosConfig";
import ProductGrid from "./ProductGrid";

function BestDeals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(`/user/products`);
        setProducts(res.data.products);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <ProductGrid
      products={products}
      loading={loading}
      title="Best Deals"
      viewAllText="Browse All product"
    />
  );
}

export default BestDeals;
