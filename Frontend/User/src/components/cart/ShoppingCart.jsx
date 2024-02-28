import { useEffect, useState } from "react";
import photo from "../../assets/images/Image2.png";
// import Checkout from "../shop/Checkout";
import Modal from "../common/Modal";
import ChooseAddress from "./ChooseAddress";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../config";

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
    axios
      .get(`${BASE_URL}/user/cart`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log("hello cart : ", res?.data?.cart?.product);
        setCartItems(res.data.cart.product);
        setQuantity(() => res.data.cart.product.map((item) => item.quantity));
        // console.log("data : ", res.data.cart.product);
        setGrandTotal(() => res.data.cart.product.reduce((acc, curr) => acc + curr.productVariantId.salePrice * curr.quantity, 0));
      })
      .catch((res) => {
        console.log(res);
      });
    window.scrollTo(0, 0);
  }, [isUpdated]);

  // console.log("cartItems : ", cartItems);
  // console.log("grandTotal : ", grandTotal);

  const handleCheckout = () => {
    // setIsProceed(true);
    navigate("/shop/choose-address", { state: { grandTotal, cartItems, couponId } });
  };

  const increaseQuantity = (id, index) => {
    if (quantity[index] < 5) {
      axios
        .post(
          `${BASE_URL}/user/cart`,
          {
            quantity: 1,
            productVariantId: id,
          },
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        )
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
      axios
        .post(
          `${BASE_URL}/user/cart`,
          {
            quantity: -1,
            productVariantId: id,
          },
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        )
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
      axios
        .delete(`${BASE_URL}/user/cart?productVariantId=${id}`, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        })
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
      const result = await axios.post(`${BASE_URL}/user/coupon`, {
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
    setGrandTotal(() => cartItems.reduce((acc, curr) => acc + curr.productVariantId.salePrice * curr.quantity, 0));
    setAppliedCoupon(false);
    setCouponCode("");
    setCouponStatus("");
  };
  // console.log("couponCode : ", couponCode);
  console.log("couponeId : ", couponId);
  return (
    <>
      <div className={`grid grid-cols-12 gap-4  ${isDashboardCartPath ? "my-0" : "my-14"}  min-h-[80vh]`}>
        <div className="col-span-8  ">
          <div className="container mx-auto  border">
            <div className="flex shadow-md ">
              <div className="w-full bg-white px-10 py-10">
                <div className="flex justify-between border-b pb-8">
                  <h1 className="font-semibold text-2xl">Shopping Cart</h1>
                  <h2 className="font-semibold text-2xl">{cartItems?.length} items</h2>
                </div>
                <div className="flex mt-10 mb-5">
                  <h3 className="font-semibold text-gray-600 text-xs uppercase w-2/5">Product Details</h3>
                  <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5 ">Quantity</h3>
                  <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5 ">Price</h3>
                  <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5 ">Total</h3>
                </div>
                {cartItems.map((item, index) => {
                  return (
                    <div key={item._id} className="flex items-center hover:bg-gray-100 -mx-8 px-6 py-5">
                      <div className="flex w-2/5">
                        <div className="w-20">
                          <img className="h-24" src={`${BASE_URL}/uploads/${item.productVariantId?.images[0]}`} alt="" />
                        </div>
                        <div className="flex flex-col justify-around ml-4 flex-grow">
                          <span className="font-bold text-sm">Iphone 6S</span>
                          {/* <span className="text-red-500 text-xs">Apple</span> */}
                          {/* {console.log("map : ",item.productVariantId)} */}
                          <a onClick={() => deleteFromCart(item.productVariantId._id)} className="font-semibold mb-2 cursor-pointer hover:text-red-500 text-gray-500 text-xs">
                            Remove
                          </a>
                        </div>
                      </div>
                      <div className="flex justify-center w-1/5">
                        <svg onClick={() => decreaseQuantity(item?.productVariantId._id, index)} className="fill-current text-gray-600 w-3 cursor-pointer" viewBox="0 0 448 512">
                          <path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                        </svg>
                        <input className="mx-2 border text-center w-8" type="text" value={quantity[index]} readOnly />
                        <svg onClick={() => increaseQuantity(item?.productVariantId._id, index)} className="fill-current text-gray-600 w-3 cursor-pointer" viewBox="0 0 448 512">
                          <path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                        </svg>
                      </div>
                      {/* {console.log("item : ", item)} */}
                      <span className="text-center w-1/5 font-semibold text-sm">₹{item?.productVariantId?.salePrice}</span>
                      <span className="text-center w-1/5 font-semibold text-sm">₹{item?.productVariantId?.salePrice * item?.quantity}</span>
                    </div>
                  );
                })}

                <div className="flex justify-between items-center mt-4">
                  <a onClick={() => navigate("/")} href="#" className="flex items-center font-semibold text-indigo-600 text-sm ">
                    <svg className="fill-current mr-2 text-indigo-600 w-4" viewBox="0 0 448 512">
                      <path d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z" />
                    </svg>
                    Continue Shopping
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border  col-span-4 ">
          <div className="w-full h-full px-8 py-10 bg-[#f6f6f6]">
            <h1 className="font-semibold text-2xl border-b pb-8">Order Summary</h1>
            <div className="flex justify-between mt-10 mb-5">
              <span className="font-semibold text-sm uppercase">Items {cartItems?.length}</span>
              <span className="font-semibold text-sm">{grandTotal}₹</span>
            </div>
            <div>
              <label className="font-medium inline-block mb-3 text-sm uppercase">Shipping</label>
              <select className="block p-2 text-gray-600 w-full text-sm">
                <option>Standard shipping - ₹0.00</option>
              </select>
            </div>
            <div className="py-10 relative">
              <label htmlFor="promo" className="font-semibold inline-block mb-3 text-sm uppercase">
                Coupon Code
              </label>
              <input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} type="text" id="promo" placeholder="Enter your code" className="p-2 text-sm w-full" />
              <p className="text-red-400 left-2 absolute bottom-4 text-xs  ">{couponStatus}</p>
            </div>
            <div className={`flex items-center justify-center gap-4 `}>
              <button onClick={handleCoupon} className={`bg-red-500  h-10 hover:bg-red-600 px-5 py-2 text-sm ${isDashboardCartPath ? "text-xs" : "text-sm"} text-white uppercase`} disabled={cartItems.length === 0}>
                Apply
              </button>
              <button onClick={handleApplyAnother} className={`bg-indigo-500 h-10  hover:bg-indigo-700 px-5 py-2 ${isDashboardCartPath ? "text-xs" : "text-sm"} text-white uppercase`} disabled={cartItems.length === 0}>
                Apply another
              </button>
            </div>
            <button onClick={openModal} className="bg-lime-500  hover:bg-red-600  py-2 text-sm w-full max-w-[200px] mx-auto mt-4 block text-white uppercase" disabled={cartItems.length === 0}>
              Show coupons
            </button>
            <div className="border-t mt-8">
              <div className="flex font-semibold justify-between py-6 text-sm uppercase">
                <span>Total cost</span>
                <span>₹{grandTotal}</span>
              </div>
              <button onClick={handleCheckout} className="bg-indigo-500 font-semibold hover:bg-indigo-600 py-3 text-sm text-white uppercase w-full" disabled={cartItems.length === 0}>
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
