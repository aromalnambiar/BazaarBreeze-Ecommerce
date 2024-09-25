import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosHeartEmpty, IoMdHeart } from "react-icons/io";
import Skeleton from "react-loading-skeleton";
import axiosInstance from "../../utils/axiosConfig";
import { useSelector } from "react-redux";

function ProductGrid({ products, loading, title, viewAllText }) {
  const [wishlistStatus, setWishlistStatus] = useState(
    Object.fromEntries(
      products.map((item) => [item.productVariantId, item.isWishlist])
    )
  );
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleClick = (item) => {
    navigate(`/product/${item.productId}`);
  };

  const handleAddToWishlist = async (productVariant) => {
    try {
      if (!isAuthenticated) {
        navigate("/user/signin", { replace: true });
        return;
      }

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

  const ProductSkeleton = () => (
    <div className="flex w-full sm:w-full lg:w-48 col-span-6 sm:col-span-4 md:col-span-3 h-56 sm:h-64 rounded-lg relative flex-col p-2 shadow-lg border">
      <div className="w-full h-44 overflow-hidden">
        <Skeleton height={144} width="100%" />
      </div>
      <div className="absolute bottom-2 w-[calc(100%-1rem)]">
        <Skeleton height={20} width="80%" />
        <Skeleton height={16} width="40%" />
      </div>
      <div className="absolute right-1 sm:right-4 bottom-6">
        <Skeleton circle={true} height={24} width={24} />
      </div>
    </div>
  );

  return (
    <div className="mx-auto text-xs md:text-base break-all mb-10">
      <div className="flex my-4 justify-between mx-2 sm:mx-20 md:mx-0">
        <h4 className="font-bold text-xl">{title}</h4>
        <p className="text-[#2DA5F3] font-medium cursor-pointer">
          {viewAllText}
        </p>
      </div>
      <div className="grid place-items-end justify-items-center max-sm:px-3 grid-cols-12 gap-3 lg:flex lg:flex-wrap lg:justify-center">
        {loading
          ? Array.from({ length: 15 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))
          : products.map((item) => (
              <div
                key={item.productVariantId}
                className="flex w-full sm:w-full lg:w-48 col-span-6 sm:col-span-4 md:col-span-3 h-56 sm:h-64 rounded-lg relative flex-col p-2 shadow-lg border"
              >
                <div
                  onClick={() => handleClick(item)}
                  className="w-full h-44 overflow-hidden cursor-pointer"
                >
                  <img
                    className="w-full sm:w-44 h-36 mx-auto sm:h-44 object-contain rounded-sm"
                    src={`${item.image}` || ""}
                    alt=""
                  />
                </div>
                <div className="absolute bottom-2">
                  <p className="text-sm sm:text-base font-semibold text-gray-500 w-[100px] sm:w-[140px] overflow-hidden whitespace-nowrap overflow-ellipsis max-w-full">
                    {item.description}
                  </p>
                  <p className="text-xs text-[#2DA5F3]">₹ {item.salePrice}</p>
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

export default ProductGrid;
