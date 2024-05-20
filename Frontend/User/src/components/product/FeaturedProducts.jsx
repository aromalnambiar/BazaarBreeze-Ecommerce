import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosHeartEmpty, IoMdHeart } from "react-icons/io";
import Skeleton from "react-loading-skeleton";
import axiosInstance from "../../utils/axiosConfig";

function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistStatus, setWishlistStatus] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(`/user/products/SmartPhone`);
        const wishlistStatusMap = {};
        res.data.products.forEach((item) => {
          wishlistStatusMap[item.productVariantId] = item.isWishlist;
        });
        setWishlistStatus(wishlistStatusMap);
        // console.log("Smartphones : ", res.data.products);
        setProducts(res.data.products);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleClick = (item) => {
    navigate(`/product/${item.productId}`);
  };

  const handleAddToWishlist = async (productVariant) => {
    try {
      await axiosInstance.post(`/user/wishlist`, { productVariant });

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
      await axiosInstance.put(`/user/wishlist`, { productVariant });

      setWishlistStatus((prevStatus) => ({
        ...prevStatus,
        [productVariant]: false,
      }));
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
    }
  };

  return (
    <div className="mx-auto text-xs md:text-base break-all mb-10">
      <div className="flex my-16 justify-between mx-2 sm:mx-20 md:mx-0">
        <h4 className="font-bold text-xl">Smart Phone</h4>
        <p className="text-[#2DA5F3] font-medium cursor-pointer">
          Browse All product
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3 ">
        {loading
          ? Array.from({ length: 15 }).map((_, index) => (
              <div
                key={index}
                className="w-48 h-64 rounded-lg bg-slate-50 p-2 shadow-lg border"
              >
                <Skeleton height={176} />
              </div>
            ))
          : products.map((item) => (
              <div
                key={item.productVariantId}
                className="flex w-[138px] sm:w-48 h-56 sm:h-64 rounded-lg relative  flex-col p-2 shadow-lg border"
              >
                <div
                  onClick={() => handleClick(item)}
                  className="w-full cursor-pointer h-44 overflow-hidden"
                >
                  <img
                    className="w-30 sm:w-44 h-36 mx-auto sm:h-44 object-contain rounded-sm"
                    src={`${item?.image}`}
                    alt=""
                  />
                </div>
                <div className="absolute bottom-2">
                  <p className="text-sm sm:text-base font-semibold text-gray-500 w-[100px] sm:w-[140px] overflow-hidden whitespace-nowrap overflow-ellipsis max-w-full">
                    {item.description}
                  </p>
                  <p className="text-xs text-[#2DA5F3]">₹ {item?.salePrice}</p>
                </div>
                {wishlistStatus[item.productVariantId] ? (
                  <IoMdHeart
                    onClick={() =>
                      handleRemoveFromWishlist(item.productVariantId)
                    }
                    className="text-red-500 absolute right-1 sm:right-4 bottom-6 text-xl cursor-pointer"
                  />
                ) : (
                  <IoIosHeartEmpty
                    onClick={() => handleAddToWishlist(item.productVariantId)}
                    className="absolute text-xl right-1 sm:right-4 bottom-6 cursor-pointer"
                  />
                )}
              </div>
            ))}
      </div>
    </div>
  );
}

export default FeaturedProducts;
