import { useEffect, useState } from "react";
import Modal from "../common/Modal";
import { useNavigate, useLocation } from "react-router-dom";
import { BASE_URL } from "../../../config";
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
        // console.log("hello cart : ", res?.data?.cart);
        setCartItems(res.data.cart.product);
        setQuantity(() => res.data.cart.product.map((item) => item.quantity));

        // console.log("data : ", res.data.cart.product);
        setGrandTotal(() =>
          res.data.cart.product.reduce(
            (acc, curr) =>
              acc + curr.productVariantId.salePrice * curr.quantity,
            0
          )
        );
      })
      .catch((res) => {
        console.log(res);
      });
  }, [isUpdated]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // console.log("grandTotal : ", grandTotal);

  const handleCheckout = () => {
    // setIsProceed(true);
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
          // console.log("response : ", res);
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
          // console.log("response: ", res);
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
      console.log("result of handleCoupon : ", result.data);
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
  // const calculateDeductedAmount = (salePriceAmt, offer) => {
  //   // console.log("calculate : ", offer);
  //   // console.log("salePriceAmnt : ", salePriceAmt);
  //   if (offer) {
  //     const deductedAmount = offer.discountType === "Percentage" ? (salePriceAmt * offer.discountValue) / 100 : offer.discountValue;
  //     // console.log("dedcuted amnt : ", deductedAmount);
  //     return parseInt(deductedAmount);
  //   } else {
  //     return 0;
  //   }
  // };

  // console.log("couponCode : ", couponCode);
  console.log("couponeId : ", couponId);

  const handleClickImage = (id) => {
    console.log("id  : ", id);
    navigate(`/product/${id}`);
  };

  return (
    <>
      <div
        className={`grid grid-cols-12 gap-4  ${
          isDashboardCartPath ? "my-0" : "my-14"
        }  min-h-[80vh]`}
      >
        <div className="col-span-12 md:col-span-8  ">
          <section className="flex flex-col justify-center antialiased  text-gray-600   rounded-md">
            <div className="h-full">
              <div className="w-full  max-w-6xl mx-auto bg-white shadow-lg rounded-sm border  border-gray-200">
                <div className="flex justify-between border-b p-6 pb-8 ">
                  <h1 className="font-semibold text-2xl">Shopping Cart</h1>
                  <h2 className="font-semibold text-2xl">
                    {cartItems?.length} items
                  </h2>
                </div>
                <div className="p-3 pb-8 ">
                  <div className="overflow-x-auto ">
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
                          {/* <th className="p-2 whitespace-nowrap">
                            <div className="font-semibold text-center">DISCOUNT</div>
                          </th> */}
                          <th className="p-2 whitespace-nowrap">
                            <div className="font-semibold text-center">
                              TOTAL
                            </div>
                          </th>
                        </tr>
                      </thead>

                      <tbody className="text-sm divide-y divide-gray-100">
                        {cartItems.map((item, index) => (
                          <tr
                            key={item?.productVariantId?._id}
                            className="hover:bg-slate-100 "
                          >
                            {console.log("cia : ", item.productVariantId.offer)}
                            <td className="p-2 whitespace-nowrap ">
                              <div className="flex gap-4 my-4">
                                <div className="w-14">
                                  <img
                                    onClick={() =>
                                      handleClickImage(
                                        item?.productVariantId?.productId
                                      )
                                    }
                                    className="h-24 object-contain cursor-pointer"
                                    src={`${BASE_URL}/uploads/${item.productVariantId?.images[0]}`}
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
                                  </a>
                                </div>
                              </div>
                            </td>
                            <td className="p-2 whitespace-nowrap">
                              <div className="flex justify-center ">
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
                                  <path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                                </svg>
                                <input
                                  className="mx-2 border text-center w-8"
                                  type="text"
                                  value={quantity[index]}
                                  readOnly
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
                                  <path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                                </svg>
                              </div>
                            </td>
                            <td className="p-2 whitespace-nowrap">
                              <div className="text-center font-medium ">
                                ₹{item?.productVariantId?.salePrice}
                              </div>
                            </td>
                            {/* <td className="p-2 whitespace-nowrap">
                              <div className="text-center font-medium text-green-500">
                                {item?.productVariantId?.offer && (
                                  <>
                                    <p className=" font-bold text-[#26ae4a] text-xs my-6">
                                      - <span className="text-green-500">{calculateDeductedAmount(item?.productVariantId?.salePrice, item?.productVariantId?.offer)}₹</span>
                                    </p>
                                  </>
                                )}
                              </div>
                            </td> */}
                            <td className="p-2 whitespace-nowrap">
                              <div className="text-center font-medium text-green-500">
                                ₹
                                {item?.productVariantId?.salePrice *
                                  item?.quantity}
                              </div>
                            </td>
                            {/* <td className="p-2 whitespace-nowrap">
                              <button className="bg-[#d4f7fe] py-2 px-6 mr-4 text-blue-800 rounded-md">Edit</button>
                              <button className="bg-[#fedad4] py-2 px-6 text-red-600 rounded-md ">Delete</button>
                            </td> */}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="flex justify-between items-center mt-4">
                      <a
                        onClick={() => navigate("/")}
                        href="#"
                        className="flex items-center font-semibold text-indigo-600 text-sm "
                      >
                        <svg
                          className="fill-current mr-2 text-indigo-600 w-4"
                          viewBox="0 0 448 512"
                        >
                          <path d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z" />
                        </svg>
                        Continue Shopping
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="border col-span-12  md:col-span-4 ">
          <div className="w-full h-full px-8 py-10 bg-[#f6f6f6]">
            <h1 className="font-semibold text-2xl border-b pb-8">
              Order Summary
            </h1>
            <div className="flex justify-between mt-10 mb-5">
              <span className="font-semibold text-sm uppercase">
                Items {cartItems?.length}
              </span>
              <span className="font-semibold text-sm">{grandTotal}₹</span>
            </div>
            <div>
              <label className="font-medium inline-block mb-3 text-sm uppercase">
                Shipping
              </label>
              <select className="block p-2 text-gray-600 w-full text-sm">
                <option>Standard shipping - ₹0.00</option>
              </select>
            </div>
            <div className="py-10 relative">
              <label
                htmlFor="promo"
                className="font-semibold inline-block mb-3 text-sm uppercase"
              >
                Coupon Code
              </label>
              <input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                type="text"
                id="promo"
                placeholder="Enter your code"
                className="p-2 text-sm w-full"
              />
              <p className="text-red-400 left-2 absolute bottom-4 text-xs  ">
                {couponStatus}
              </p>
            </div>
            <div className={`flex items-center justify-center gap-4 `}>
              <button
                onClick={handleCoupon}
                className={`bg-red-500  h-10 hover:bg-red-600 px-5 py-2 text-sm ${
                  isDashboardCartPath ? "text-xs" : "text-sm"
                } text-white uppercase`}
                disabled={cartItems.length === 0}
              >
                Apply
              </button>
              <button
                onClick={handleApplyAnother}
                className={`bg-indigo-500 h-10  hover:bg-indigo-700 px-5 py-2 ${
                  isDashboardCartPath ? "text-xs" : "text-sm"
                } text-white uppercase`}
                disabled={cartItems.length === 0}
              >
                Apply another
              </button>
            </div>
            <button
              onClick={openModal}
              className="bg-lime-500  hover:bg-red-600  py-2 text-sm w-full max-w-[200px] mx-auto mt-4 block text-white uppercase"
              disabled={cartItems.length === 0}
            >
              Show coupons
            </button>
            <div className="border-t mt-8">
              <div className="flex font-semibold justify-between py-6 text-sm uppercase">
                <span>Total cost</span>
                <span>₹{grandTotal}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="bg-indigo-500 font-semibold hover:bg-indigo-600 py-3 text-sm text-white uppercase w-full"
                disabled={cartItems.length === 0}
              >
                proceed to Checkout
              </button>

              <Modal isOpen={isModalOpen} onClose={closeModal} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ShoppingCart;
