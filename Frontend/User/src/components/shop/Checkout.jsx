import { useState } from "react";
import { SiRazorpay } from "react-icons/si";
import { FaMoneyBill } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { BASE_URL } from "../../../config";
import Swal from "sweetalert2";
import axios from "axios";

function Checkout() {
  const navigate = useNavigate("");
  const location = useLocation();
  const data = location?.state;
  console.log("data : ", data);
  const [selectedPayment, setSelectedPayment] = useState({});
  const [address, setAddress] = useState(data?.selectedAddress);
  const [total, setTotal] = useState(data?.grandTotal);
  const grandTotal = data?.grandTotal;
  const couponId = data?.couponId;
  const cartItems = data?.cartItems;
  // const data = location.state?.data;

  const paymentOptions = [
    { id: 1, name: "Cash On Delivery", icon: <FaMoneyBill /> },
    // { id: 2, name: "PayPal", icon: <FaPaypal /> },
    { id: 3, name: "RazorPay", icon: <SiRazorpay /> },
    // { id: 4, name: "Credit Card", icon: <FaRegCreditCard /> },
  ];

  const handlePaymentChange = (payment) => {
    setSelectedPayment(payment);
  };

  console.log("Selected payment : ", selectedPayment);

  const initPayment = (data) => {
    const options = {
      key: import.meta.env.VITE_KEY_ID,
      amount: data.amount,
      currency: data.currency,
      name: "Teachtreasures",
      description: "Test Transaction",
      order_id: data.id,
      handler: async (response) => {
        try {
          const verifyUrl = `${BASE_URL}/user/orders/razorpay/verify`;
          const { data } = await axios.post(verifyUrl, response);
          console.log("razorPay init : ", data);
          placeOrder("Completed");
        } catch (error) {
          console.log(error);
        }
      },
      theme: {
        color: "#3399cc",
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  const handlePayment = async () => {
    try {
      console.log("HandlePayment");
      const orderUrl = `${BASE_URL}/user/orders/razorpay`;
      const { data } = await axios.post(orderUrl, { amount: total });
      console.log(" razorPay : ", data);
      initPayment(data.data);
    } catch (error) {
      console.log(error);
    }
  };
  // console.log("Cart Items : checkout : ", props.cartItems);
  const clearTheCart = async () => {
    try {
      const result = await axios.delete(`${BASE_URL}/user/cart/clear`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      console.log("Clear the cart : ", result);
    } catch (error) {
      console.log(error);
    }
  };

  const placeOrder = (status) => {
    if (cartItems?.length == 0) {
      return alert("cartItems are empty or something went wrong");
    }
    const orderedItems = cartItems.map((item) => {
      return {
        product: item.productVariantId._id,
        quantity: item.quantity,
        price: item.productVariantId.salePrice,
        orderStatus: "Pending",
      };
    });
    console.log("orderedItems : ", orderedItems);
    console.log("status of payment : ", status);

    axios
      .post(
        `${BASE_URL}/user/order/add`,
        {
          orderedItems,
          paymentStatus: status,
          deliveryDate: new Date(),
          offers: [],
          paymentMethod: selectedPayment.name,
          shippingAddress: address,
          orderDate: new Date(),
          coupons: couponId,
          totalAmount: grandTotal,
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        // console.log("response : ", res);
        // console.log("Order placed successfully:", res.data.message);
        clearTheCart();
        navigate("/shop/checkoutsuccess");
      })
      .catch((err) => {
        console.error("Error placing order:", err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to place the order. Please try again.!",
        });
      });
    // console.log("props : ", props);
  };

  const handlePlaceOrder = async () => {
    // console.log("selecte payment : ", Object.keys(selectedPayment).length === 0);
    if (Object.keys(selectedPayment).length === 0) {
      // alert("Please select a payment method.");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select a payment method!",
      });
      return;
    }

    if (selectedPayment.name === "RazorPay") {
      const confirmed = await Swal.fire({
        title: "Are you sure?",
        text: "Your edit will be submitted!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Submit!",
      });
      if (confirmed.isConfirmed) {
        handlePayment();
      }
    } else if (total > 1000) {
      Swal.fire({
        title: "Not allowed!",
        text: "Order above Rs 1000 should not be allowed for COD",
        icon: "error",
      });
    } else {
      const confirmed = await Swal.fire({
        title: "Are you sure?",
        text: "Your order will be placed!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes!",
      });
      if (confirmed.isConfirmed) {
        placeOrder("pending");
      }
    }
  };

  return (
    <>
      <div className="grid grid-cols-12 py-10 gap-4 my-10">
        <div className="flex border-t flex-col justify-center lg:flex-nowrap gap-4 lg:gap-0 col-span-9 ">
          <form className="w-full  p-4 shadow-md ">
            <h3 className="border-b pb-2 mb-2">Shipping address</h3>
            <div className="flex flex-wrap -mx-3 mb-2">
              <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                  Full Name
                </label>
                <input className="appearance-none block w-full bg-gray-50 text-gray-700 border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder={address?.fullName} disabled />
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-2">
              <div className="w-full  px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                  Address
                </label>
                <input className="appearance-none block w-full bg-gray-50 text-gray-700 border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder={address?.address} disabled />
              </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-2">
              <div className="w-full md:w-1/3 px-3 mb-2 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-city">
                  Street
                </label>
                <input className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-city" type="text" placeholder={address?.street} disabled />
              </div>
              <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-state">
                  State
                </label>
                <div className="relative">
                  <input className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-city" type="text" placeholder={address?.state} disabled />
                </div>
              </div>
              <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-zip">
                  Pin Code
                </label>
                <input className="appearance-none block w-full bg-gray-50 text-gray-700 border  rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-zip" type="text" placeholder={address?.pincode} disabled />
              </div>

              <div className="w-full md:w-2/4 mt-2 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                  Phone1
                </label>
                <input className="appearance-none block w-full bg-gray-50 text-gray-700 border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder={address?.phone1} disabled />
              </div>
              <div className="w-full md:w-2/4 mt-2 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                  Phone2
                </label>
                <input className="appearance-none block w-full bg-gray-50 text-gray-700 border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder={address?.phone2} disabled />
              </div>
            </div>
          </form>
          <div>
            <h3 className="text-lg font-semibold mb-4 mt-8">Payment options</h3>
            <div className="flex justify-between">
              {paymentOptions.map((payment) => {
                return (
                  <label key={payment.id} className={`flex-1 border p-4 cursor-pointer ${selectedPayment.name === payment.name ? "bg-[#fa8232] text-white" : ""}`}>
                    <input type="radio" id={`payment_${payment.id}`} name="payment" value={payment.id} checked={selectedPayment.name === payment.name} onChange={() => handlePaymentChange(payment)} className="sr-only" />
                    <div className="flex items-center">
                      <span className="mr-2">{payment.icon}</span>
                      <h4 className="text-base font-semibold">{payment.name}</h4>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
        <div className=" col-span-3">
          <div className="border p-2 text-sm">
            {cartItems.map((item) => {
              return (
                <div key={item?._id} className="flex items-center gap-4 mb-2">
                  <img className="w-12 h-12 object-contain" src={`${BASE_URL}/uploads/${item.productVariantId.images[0]}`} alt="" />
                  <div>
                    <p>{item.productVariantId.variantName || "variant Name"}</p>
                    <p>x {item.quantity}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="border text-sm p-2 text-gray-500 font-semibold">
            <h3>PRICE DETAILS</h3>
          </div>
          <div className="flex flex-col gap-4 text-sm py-4 border">
            <div className="flex justify-between px-2">
              <p>Total</p>
              <p>${grandTotal}</p>
            </div>
            <div className="flex border-b justify-between py-4 px-2">
              <p>Delivery Charges</p>
              <p>FREE</p>
            </div>
            <div className="flex px-2 justify-between">
              <h3 className=" font-bold">Amount Payable</h3>
              <p>{total}</p>
            </div>
            <button onClick={() => handlePlaceOrder()} className="bg-[#FA8232] hover:bg-[#fa5914] text-white uppercase font-bold mt-4 mx-2 rounded-sm py-4 px-4">
              place order
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Checkout;
