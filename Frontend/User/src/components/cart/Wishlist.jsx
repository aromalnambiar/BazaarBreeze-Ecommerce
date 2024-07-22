import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCartPlus } from "react-icons/fa";
import { confirmAction } from "../../utils/sweetAlert";
import axiosInstance from "../../utils/axiosConfig";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function Wishlist() {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboardCartPath = location.pathname === "/dashboard/wishlists";

  const [wishList, setWishList] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axiosInstance.get(`/user/wishlist`);
        console.log("wishlist : ", result.data.wishlistItems);
        setWishList(result.data.wishlistItems);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isUpdated]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleRemoveFromWishlist = async (productVariant) => {
    try {
      const confirmed = await confirmAction(
        "warning",
        "Are you sure?",
        "Do you want to remove from wishlist!",
        "yes,sure"
      );
      if (confirmed) {
        await axiosInstance.put(`/user/wishlist`, { productVariant });
        setIsUpdated((prev) => !prev);
      }
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
    }
  };

  const handleClickImage = (id) => {
    navigate(`/product/${id}`);
  };

  const handleAddToCart = async (id) => {
    try {
      const response = await axiosInstance.post(`/user/cart`, {
        productVariantId: id,
        quantity: 1,
      });
      setIsUpdated((prev) => !prev);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  return (
    <div className="p-2 sm:p-0 grid grid-cols-12 gap-4 my-14 min-h-[80vh]">
      <div className="col-span-12">
        <section className="flex flex-col justify-center antialiased text-gray-600 rounded-md">
          <div className="h-full">
            <div className="w-full max-w-6xl mx-auto bg-white shadow-lg rounded-sm border border-gray-200">
              <div className="flex justify-between border-b p-6 pb-8">
                <h1 className="font-semibold text-2xl">Wishlist</h1>
                <h2 className="font-semibold text-2xl">
                  {wishList?.length} items
                </h2>
              </div>
              <div className="p-3 pb-8">
                <div className="overflow-x-auto">
                  <table className="table-auto w-full">
                    <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                      <tr>
                        <th className="p-2 whitespace-nowrap">
                          <div className="font-semibold text-left">
                            PRODUCT DETAILS
                          </div>
                        </th>
                        <th className="p-2 whitespace-nowrap">
                          <div className="font-semibold text-center">
                            PRICE
                          </div>
                        </th>
                        <th className="p-2 whitespace-nowrap">
                          <div className="font-semibold text-center">
                            STOCK STATUS
                          </div>
                        </th>
                        <th className="p-2 whitespace-nowrap">
                          <div className="font-semibold text-center">
                            ACTION
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100">
                      {loading ? (
                        <>
                          <SkeletonProduct />
                          <SkeletonProduct />
                          <SkeletonProduct />
                        </>
                      ) : wishList.length === 0 ? (
                        <tr>
                          <td className="text-center text-xl py-24" colSpan={4}>
                            No items in wishlist
                          </td>
                        </tr>
                      ) : (
                        wishList.map((item) => (
                          <tr
                            key={item?.productVariant?._id}
                            className="hover:bg-slate-100"
                          >
                            <td className="p-2 whitespace-nowrap">
                              <div className="flex gap-4 my-4">
                                <div className="w-14">
                                  <img
                                    onClick={() =>
                                      handleClickImage(
                                        item?.productVariant?.productId
                                      )
                                    }
                                    className="h-24 object-contain cursor-pointer"
                                    src={`${item?.productVariant?.publicIds[0]}`}
                                    alt=""
                                  />
                                </div>
                                <div className="flex flex-col justify-around ml-4 flex-grow">
                                  <span className="font-bold text-sm">
                                    {item?.productVariant?.variantName}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="p-2 whitespace-nowrap">
                              <div className="text-center font-semibold">
                                ${item.productVariant?.salePrice}
                              </div>
                            </td>
                            <td className="p-2 whitespace-nowrap">
                              <div className={`text-xs text-center ${
                                item?.productVariant?.stock == 0
                                  ? "text-red-500"
                                  : "text-green-500"
                              }`}>
                                {item?.productVariant?.stock == 0
                                  ? "Out of stock"
                                  : "In stock"}
                              </div>
                            </td>
                            <td className="p-2 whitespace-nowrap">
                              <div className="text-center">
                                {item.isInCart !== true && (
                                  <button
                                    onClick={() => handleAddToCart(item?.productVariant?._id)}
                                    className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 flex items-center justify-center mx-auto mb-2"
                                  >
                                    <FaCartPlus className="mr-2" />
                                    Add to Cart
                                  </button>
                                )}
                                <button
                                  onClick={() => handleRemoveFromWishlist(item?.productVariant?._id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  Remove
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

const SkeletonProduct = () => (
  <tr className="animate-pulse">
    <td className="p-2 whitespace-nowrap">
      <div className="flex gap-4 my-4">
        <div className="w-14 h-24 bg-gray-200"></div>
        <div className="flex flex-col justify-around ml-4 flex-grow">
          <div className="bg-gray-200 h-4 w-32 mb-2"></div>
        </div>
      </div>
    </td>
    <td className="p-2 whitespace-nowrap">
      <div className="text-center bg-gray-200 h-6 w-20 mx-auto"></div>
    </td>
    <td className="p-2 whitespace-nowrap">
      <div className="text-center bg-gray-200 h-6 w-20 mx-auto"></div>
    </td>
    <td className="p-2 whitespace-nowrap">
      <div className="text-center">
        <div className="bg-gray-200 h-8 w-24 mx-auto mb-2"></div>
        <div className="bg-gray-200 h-6 w-16 mx-auto"></div>
      </div>
    </td>
  </tr>
);

export default Wishlist;