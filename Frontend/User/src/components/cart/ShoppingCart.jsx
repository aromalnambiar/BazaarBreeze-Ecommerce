import { useEffect, useState } from "react";
import Modal from "../common/Modal";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiosConfig";

function ShoppingCart() {
  const [cartItems, setCartItems] = useState([]);
  const [quantity, setQuantity] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);
  const [grandTotal, setGrandTotal] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [couponStatus, setCouponStatus] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(false);
  const [couponId, setCouponId] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboardCartPath = location.pathname === "/dashboard/carts";

  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    console.log("OPEN MODEL ");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  //cart items fetching
  useEffect(() => {
    axiosInstance
      .get(`/user/cart`)
      .then((res) => {
        setCartItems(res.data.cart.product);
        setQuantity(() => res.data.cart.product.map((item) => item.quantity));
        setGrandTotal(() =>
          res.data.cart.product.reduce(
            (acc, curr) =>
              acc + curr.productVariantId.salePrice * curr.quantity,
            0
          )
        );
        setLoading(false);
      })
      .catch((res) => {
        console.log(res);
        setLoading(false);
      });
  }, [isUpdated]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCheckout = () => {
    navigate("/shop/choose-address", {
      state: { grandTotal, cartItems, couponId },
    });
  };

  const increaseQuantity = (id, index) => {
    if (quantity[index] < 5) {
      axiosInstance
        .post(`/user/cart`, {
          quantity: 1,
          productVariantId: id,
        })
        .then((res) => {
          setIsUpdated(!isUpdated);
        })
        .catch((res) => {
          console.log("response : ", res);
        });
    }
  };

  const decreaseQuantity = (id, index) => {
    if (quantity[index] > 1) {
      axiosInstance
        .post(`/user/cart`, {
          quantity: -1,
          productVariantId: id,
        })
        .then((res) => {
          setIsUpdated(!isUpdated);
        })
        .catch((res) => {
          console.log("response : ", res);
        });
    }
  };

  const deleteFromCart = (id) => {
    if (confirm("Are you sure ?")) {
      axiosInstance
        .delete(`/user/cart?productVariantId=${id}`)
        .then((res) => {
          setIsUpdated(!isUpdated);
        })
        .catch((err) => {
          console.log("catch response: ", err);
        });
    }
  };

  const handleCoupon = async () => {
    try {
      const result = await axiosInstance.post(`/user/coupon`, {
        couponCode,
      });
      const { discountType, discountValue } = result.data;
      setCouponId(result.data.couponId);
      if (!appliedCoupon) {
        if (discountType === "Percentage") {
          setGrandTotal((grandTotal / 100) * discountValue);
        } else {
          setGrandTotal(grandTotal - discountValue);
        }
        setAppliedCoupon(true);
        setCouponStatus("Coupon applied");
      } else {
        setCouponStatus("Coupon already applied");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleApplyAnother = async () => {
    setGrandTotal(() =>
      cartItems.reduce(
        (acc, curr) => acc + curr.productVariantId.salePrice * curr.quantity,
        0
      )
    );
    setAppliedCoupon(false);
    setCouponCode("");
    setCouponStatus("");
  };

  const handleClickImage = (id) => {
    navigate(`/product/${id}`);
  };

  const SkeletonProduct = () => (
    <tr className="animate-pulse">
      <td className="p-2 whitespace-nowrap">
        <div className="flex gap-4 my-4">
          <div className="w-14 h-24 bg-gray-200"></div>
          <div className="flex flex-col justify-around ml-4 flex-grow">
            <div className="bg-gray-200 h-4 w-32 mb-2"></div>
            <div className="bg-gray-200 h-4 w-16"></div>
          </div>
        </div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className="flex justify-center bg-gray-200 h-6 w-12"></div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className="text-center bg-gray-200 h-6 w-12"></div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className="text-center bg-gray-200 h-6 w-12"></div>
      </td>
    </tr>
  );

  return (
    <>
      <div
        className={`p-2 sm:p-0 grid grid-cols-12 gap-4 ${
          isDashboardCartPath ? "my-0" : "my-14"
        } min-h-[80vh]`}
      >
        <div className="col-span-12 md:col-span-8">
          <section className="flex  flex-col justify-center antialiased text-gray-600 rounded-md">
            <div className="h-full">
              <div className="w-full max-w-6xl mx-auto bg-white shadow-lg rounded-sm border border-gray-200">
                <div className="flex justify-between border-b p-6 pb-8">
                  <h1 className="font-semibold text-2xl">Shopping Cart</h1>
                  <h2 className="font-semibold text-2xl">
                    {cartItems?.length} items
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
                              QUANTITY
                            </div>
                          </th>
                          <th className="p-2 whitespace-nowrap">
                            <div className="font-semibold text-center">
                              PRICE
                            </div>
                          </th>
                          <th className="p-2 whitespace-nowrap">
                            <div className="font-semibold text-center">
                              TOTAL
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
                        ) : (
                          cartItems.map((item, index) => (
                            <tr
                              key={item?.productVariantId?._id}
                              className="hover:bg-slate-100"
                            >
                              <td className="p-2 whitespace-nowrap">
                                <div className="flex gap-4 my-4">
                                  <div className="w-14">
                                    <img
                                      onClick={() =>
                                        handleClickImage(
                                          item?.productVariantId?.productId
                                        )
                                      }
                                      className="h-24 object-contain cursor-pointer"
                                      src={`${item?.productVariantId?.publicIds[0]}`}
                                      alt=""
                                    />
                                  </div>
                                  <div className="flex flex-col justify-around ml-4 flex-grow">
                                    <span className="font-bold text-sm">
                                      {item?.productVariantId?.variantName}
                                    </span>
                                    <a
                                      onClick={() =>
                                        deleteFromCart(
                                          item?.productVariantId?._id
                                        )
                                      }
                                      className="font-semibold mb-2 cursor-pointer hover:text-red-500 text-gray-500 text-xs"
                                    >
                                      Remove
                         -semib     </a>
                                  </div>
                                </div>
                              </td>
                              <td className="p-2 whitespace-nowrap">
                                <div className="flex justify-center">
                                  <svg
                                    onClick={() =>
                                      decreaseQuantity(
                                        item?.productVariantId?._id,
                                        index
                                      )
                                    }
                                    className="fill-current text-gray-600 w-3 cursor-pointer"
                                    viewBox="0 0 448 512"
                                  >
                                    <path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32C448 222.3 433.7 208 416 208z" />
                                  </svg>
                                  <input
                                    className="mx-2 border text-center w-8"
                                    type="text"
                                    readOnly
                                    value={quantity[index]}
                                  />
                                  <svg
                                    onClick={() =>
                                      increaseQuantity(
                                        item?.productVariantId?._id,
                                        index
                                      )
                                    }
                                    className="fill-current text-gray-600 w-3 cursor-pointer"
                                    viewBox="0 0 448 512"
                                  >
                                    <path d="M432 256c0-17.67-14.33-32-32-32H256V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v160H48c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h112v160c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V320h144c17.67 0 32-14.33 32-32V256z" />
                                  </svg>
                                </div>
                              </td>
                              <td className="p-2 whitespace-nowrap">
                                <div className="text-center font-semibold">
                                  ${item.productVariantId.salePrice}
                                </div>
                              </td>
                              <td className="p-2 whitespace-nowrap">
                                <div className="text-center font-semibold">
                                  $
                                  {item.productVariantId.salePrice *
                                    item.quantity}
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

        <div className="col-span-12 md:col-span-4 mb-14">
          <div className="p-8 bg-gray-100 rounded-md">
            <h1 className="font-semibold text-2xl border-b pb-8">
              Order Summary
            </h1>
            <div className="mt-8 mb-6 flex justify-between">
              <span className="font-semibold text-sm uppercase">
                {cartItems?.length} items
              </span>
              <span className="font-semibold text-sm">{grandTotal}</span>
            </div>
            <div className="mb-6">
              <label className="font-medium inline-block mb-3 text-sm uppercase">
                Shipping
              </label>
              <select className="block p-2 text-gray-600 w-full text-sm">
                <option>Standard shipping - $10.00</option>
              </select>
            </div>
            <div className="border-t mt-8">
              <div className="flex font-semibold justify-between py-6 text-sm uppercase">
                <span>Total cost</span>
                <span>${grandTotal}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="bg-indigo-500 font-semibold hover:bg-indigo-600 py-3 text-sm text-white uppercase w-full"
              >
                Checkout
              </button>
            </div>
            <div className="border-t mt-8">
              <div className="font-semibold text-gray-400 justify-center py-6 text-sm uppercase text-center">
                <span>Do you have a coupon?</span>
              </div>
              <input
                className="px-5 py-2 border border-solid border-gray-300 w-full text-sm uppercase text-gray-800"
                placeholder="Coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <div className="flex justify-center">
                <button
                  onClick={handleCoupon}
                  className="mt-5 text-center flex bg-indigo-500 font-semibold hover:bg-indigo-600 py-2 px-4 text-sm text-white uppercase"
                >
                  Apply
                </button>
                {appliedCoupon && (
                  <button
                    onClick={handleApplyAnother}
                    className="mt-5 text-center ml-5 flex bg-red-500 font-semibold hover:bg-red-600 py-2 px-4 text-sm text-white uppercase"
                  >
                    Apply another
                  </button>
                )}
              </div>
              {couponStatus && (
                <div className="flex justify-center mt-2 text-gray-600">
                  <p className="text-sm text-gray-600 italic text-center">
                    {couponStatus}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} closeModal={closeModal} />
    </>
  );
}

export default ShoppingCart;
