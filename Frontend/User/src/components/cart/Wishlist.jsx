import React from "react";
import { BASE_URL } from "../../../config";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Wishlist() {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboardCartPath = location.pathname === "/dashboard/wishlists";

  const [wishList, setWishList] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(`${BASE_URL}/user/wishlist`, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });
        setWishList(result.data.wishlistItems);
      } catch (error) {
        console.log(error);
      }
    };
    window.scrollTo(0, 0);
    fetchData();
  }, [isUpdated]);

  const handleRemoveFromWishlist = async (productVariant) => {
    try {
      const confirmed = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to remove from wishlist!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Remove!",
      });

      if (confirmed.isConfirmed) {
        await axios.put(
          `${BASE_URL}/user/wishlist`,
          { productVariant },
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        setIsUpdated((prev) => !prev);
      }
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
    }
  };

  const handleClickImage = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className={`${isDashboardCartPath ? "my-0" : "my-10"}`}>
      <section className="flex flex-col justify-center antialiased text-gray-600 p-4">
        <div className="h-full">
          <div className="w-full max-w-6xl mx-auto bg-white shadow-lg rounded-sm border border-gray-200">
            <header className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Wishlist</h2>
            </header>
            <div className="p-3">
              <div className="overflow-x-auto">
                <table className="table-auto w-full">
                  <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                    <tr>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-left">Products</div>
                      </th>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-left">Price</div>
                      </th>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-left">Stock status</div>
                      </th>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-center">Actions</div>
                      </th>
                    </tr>
                  </thead>

                  <tbody className="text-sm divide-y divide-gray-100">
                    {wishList.length === 0 ? (
                      <tr>
                        <td className="text-center text-xl py-24" colSpan={4}>
                          No items in wishlist
                        </td>
                      </tr>
                    ) : (
                      wishList.map((item, idx) => (
                        <tr key={item?.productVariant?._id}>
                          <td className="flex items-center py-3 px-6 whitespace-nowrap">
                            <img onClick={() => handleClickImage(item.productVariant.productId)} src={`${BASE_URL}/uploads/${item?.productVariant?.images[0]}`} className="w-10 h-10 cursor-pointer object-contain mr-3" alt="" />
                            <div>
                              <span className="block text-gray-700 text-sm font-medium">{item?.productVariant?.variantName}</span>
                            </div>
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            <div className="text-left font-medium ">{item?.productVariant?.salePrice}</div>
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            <div className={`text-xs ${item?.productVariant?.stock == 0 ? "text-red-500" : "text-green-500"} `}>{item?.productVariant?.stock == 0 ? "Out of stock" : "In stock"}</div>
                          </td>
                          <td onClick={() => handleRemoveFromWishlist(item?.productVariant?._id)} className="p-2 whitespace-nowrap text-red-500 cursor-pointer text-sm text-center">
                            Remove
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
  );
}

export default Wishlist;
