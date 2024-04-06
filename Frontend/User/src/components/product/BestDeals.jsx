import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../../config";
import axiosInstance from "../../utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import { IoIosHeartEmpty, IoMdHeart } from "react-icons/io";
import Skeleton from "react-loading-skeleton";

function BestDeals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistStatus, setWishlistStatus] = useState({});
  const [page, setPage] = useState(1); // Track current page
  const [hasMore, setHasMore] = useState(true); // Track if there are more products to load
  const [skeletonCount, setSkeletonCount] = useState(15); // Initial skeleton count
  const [fetchedProductIds, setFetchedProductIds] = useState(new Set()); // Track fetched product IDs
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [page]); // Fetch data whenever page changes

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/user/products?page=${page}`);
      // Store wishlist status locally
      const wishlistStatusMap = {};
      res.data.products.forEach((item) => {
        wishlistStatusMap[item.productVariantId] = item.isWishlist;
      });
      setWishlistStatus(wishlistStatusMap);

      if (res.data.products.length === 0) {
        setHasMore(false); // No more products to load
      }

      const uniqueProducts = res.data.products.filter((product) => !fetchedProductIds.has(product.productId));

      if (page === 1) {
        // If first page, replace existing products
        setProducts(uniqueProducts);
      } else {
        // If not first page, append new unique products to existing ones
        setProducts((prevProducts) => [...prevProducts, ...uniqueProducts]);
      }

      uniqueProducts.forEach((product) => {
        fetchedProductIds.add(product.productId); // Add newly fetched product IDs to the set
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Set loading to false regardless of success or failure
    }
  };

  const handleClick = (item) => {
    navigate(`/product/${item.productId}`);
  };

  const handleAddToWishlist = async (productVariant) => {
    try {
      await axiosInstance.post(`/user/wishlist`, { productVariant });

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
      await axiosInstance.put(`/user/wishlist`, { productVariant });

      // Update wishlist status locally
      setWishlistStatus((prevStatus) => ({
        ...prevStatus,
        [productVariant]: false,
      }));
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
      setSkeletonCount((prevCount) => prevCount * 2); // Double the skeleton count
    }
  };

  return (
    <div className="mx-auto text-xs md:text-base break-all">
      <div className="flex my-4 justify-between mx-2 sm:mx-20 md:mx-0">
        <h4 className="font-bold">Best Deals</h4>
        <p className="text-[#2DA5F3] font-medium cursor-pointer">Browse All product</p>
      </div>
      <div className="flex flex-wrap justify-center gap-3 ">
        {loading && page === 1
          ? Array.from({ length: skeletonCount }).map((_, index) => (
              <div key={index} className="w-40 sm:w-48 h-64 rounded-lg bg-slate-50 p-2 shadow-lg border">
                <Skeleton height={176} />
              </div>
            ))
          : products.map((item) => (
              <div key={item.productVariantId} className="flex w-[138px]  sm:w-48 h-56 sm:h-64 rounded-lg relative  flex-col p-2 shadow-lg border">
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
      <div className="flex justify-center my-4">
        <button onClick={loadMore} className="bg-[#FA8232] text-white py-2 px-4 rounded-md text-sm" disabled={loading || !hasMore}>
          {loading ? "Loading..." : "Load More"}
        </button>
      </div>
    </div>
  );
}

export default BestDeals;
