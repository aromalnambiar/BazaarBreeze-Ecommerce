import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../../config";
import { useNavigate } from "react-router-dom";
import { IoIosHeartEmpty, IoMdHeart } from "react-icons/io";
import Skeleton from "react-loading-skeleton";

function BestDeals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistStatus, setWishlistStatus] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/user/products`, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });
        // console.log("productVariants : ", res.data);

        // Store wishlist status locally
        const wishlistStatusMap = {};
        res.data.products.forEach((item) => {
          wishlistStatusMap[item.productVariantId] = item.isWishlist;
        });
        setWishlistStatus(wishlistStatusMap);

        setProducts(res.data.products);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };

    fetchData();
  }, []);

  const handleClick = (item) => {
    navigate(`/product/${item.productId}`);
  };

  const handleAddToWishlist = async (productVariant) => {
    try {
      await axios.post(
        `${BASE_URL}/user/wishlist`,
        { productVariant },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );

      // Update wishlist status locally
      setWishlistStatus((prevStatus) => ({
        ...prevStatus,
        [productVariant]: true,
      }));
    } catch (error) {
      console.error("Error adding item to wishlist:", error);
    }
  };

  const handleRemoveFromWishlist = async (productVariant) => {
    try {
      await axios.put(
        `${BASE_URL}/user/wishlist`,
        { productVariant },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );

      // Update wishlist status locally
      setWishlistStatus((prevStatus) => ({
        ...prevStatus,
        [productVariant]: false,
      }));
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
    }
  };

  return (
    <div className="mx-auto text-xs md:text-base break-all">
      <div className="flex my-4 justify-between mx-2 sm:mx-20 md:mx-0">
        <h4 className="font-bold">Best Deals</h4>
        <p className="text-[#2DA5F3] font-medium cursor-pointer">Browse All product</p>
      </div>
      <div className="flex flex-wrap justify-center gap-3 ">
        {loading
          ? Array.from({ length: 15 }).map((_, index) => (
              <div key={index} className="w-40 sm:w-48 h-64 rounded-lg bg-slate-50 p-2 shadow-lg border">
                <Skeleton height={176} />
              </div>
            ))
          : products.map((item) => (
              <div key={item.productVariantId} className="flex w-[138px]  sm:w-48 h-56 sm:h-64 rounded-lg relative  flex-col p-2 shadow-lg border">
                {console.log("item Best : ", item)}
                <div onClick={() => handleClick(item)} className="w-full h-44 overflow-hidden cursor-pointer">
                  <img className="w-30 sm:w-44 h-36 mx-auto sm:h-44 object-contain rounded-sm" src={`${BASE_URL}/uploads/${item.image}` || ""} alt="" />
                </div>
                <div className="absolute bottom-2">
                  <p className="text-sm  sm:text-base font-semibold text-gray-500 w-[100px] sm:w-[140px] overflow-hidden whitespace-nowrap overflow-ellipsis max-w-full">{item.description}</p>
                  <p className="text-xs text-[#2DA5F3]">₹ {item.salePrice}</p>
                </div>
                {wishlistStatus[item.productVariantId] ? <IoMdHeart onClick={() => handleRemoveFromWishlist(item.productVariantId)} className="text-red-500  absolute right-1 sm:right-4 bottom-6 text-xl cursor-pointer" /> : <IoIosHeartEmpty onClick={() => handleAddToWishlist(item.productVariantId)} className="absolute text-xl right-1 sm:right-4 bottom-6 cursor-pointer" />}
              </div>
            ))}
      </div>
    </div>
  );
}

export default BestDeals;
