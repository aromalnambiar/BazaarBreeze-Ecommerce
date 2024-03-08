import React, { useState } from "react";
import photo from "../../assets/images/Laptop.png";
// import Steps from "../order/Steps";
import Steps from "../order/Stepper";
import Timeline from "../order/Timeline";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../../../config";
import axios from "axios";
import Swal from "sweetalert2";
import PdfDownload from "../dashboard/PdfDownload";

function OrderDetails() {
  const [items, setItems] = useState([]);
  const [order, setOrder] = useState({});
  const [dataRetrieved, setDataRetrieved] = useState(false);
  const [joinedArray, setJoinedArray] = useState([]);
  const [isToggle, setIsToggle] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");

  const { orderId } = useParams();
  // console.log("Params : ", orderId);
  //order fetching
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(`${BASE_URL}/user/orders/${orderId}`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      console.log("result1 : ", result?.data?.order);
      setOrder(result?.data?.order);
      setPaymentStatus(result?.data?.order?.orderedItems[0].paymentStatus);
    };
    fetchData();
  }, [isToggle]);

  //product fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!order?.orderedItems) {
          return;
        }

        const variantIds = order.orderedItems.map((item) => item.product);

        const result = await axios.get(`${BASE_URL}/user/products/variants`, {
          params: {
            variantIds: variantIds.join(","),
          },
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });

        // console.log("result2 : ", result.data.variants);
        setItems(result.data.variants);
        setDataRetrieved(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [order]);

  useEffect(() => {
    if (dataRetrieved) {
      setJoinedArray(() => {
        return order.orderedItems.map((obj1) => {
          const matchingObj2 = items.find((obj2) => obj1.product === obj2._id);

          if (matchingObj2) {
            return {
              ...obj1,
              productDetails: { ...matchingObj2 },
            };
          } else {
            return obj1;
          }
        });
      });
    }
  }, [dataRetrieved]);

  console.log("joinedArray : ", joinedArray);

  const handleStatus = async (orderedItemId, orderStatus) => {
    try {
      console.log("handleStatus");
      const confirmed = await Swal.fire({
        title: "Are you sure?",
        text: "You can't revert the changes!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Submit!",
      });
      if (confirmed.isConfirmed) {
        const result = await axios.patch(
          `${BASE_URL}/user/order/status`,
          {
            orderId: order?._id,
            orderedItemId,
            orderStatus,
          },
          {
            method: "PATCH", // Explicitly specify the HTTP method
            headers: {
              "Content-Type": "application/json",
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );

        setIsToggle((prev) => !prev);

        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "success",
          title: "Status changed successfully",
        });
        console.log("status result : ", result);
      }
    } catch (error) {
      console.log("Error : ", error);
    }
  };

  const downloadInvoice = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user/generateinvoice?id=${order._id}`, {
        responseType: "blob",
      });

      // Create a Blob from the PDF data
      const blob = new Blob([response.data], { type: "application/pdf" });

      // Create a link element and trigger a download
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "invoice.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading invoice:", error);
      // Handle error
    }
  };

  // const handleDownloadInvoice = async () => {
  //   const confirmed = await Swal.fire({
  //     title: "Are you sure?",
  //     text: "Do you want to download invoice!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Yes!",
  //   });
  //   if (confirmed.isConfirmed) {
  //     downloadInvoice();
  //   }
  // };

  const changePaymentStatus = async () => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/user/order/paymentstatus`,
        {
          orderId: order?._id,
          paymentStatus: "Completed",
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Payment Status : Success");
      setIsToggle((prev) => !prev);
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

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
          changePaymentStatus();
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
      const { data } = await axios.post(orderUrl, { amount: order?.totalAmount });
      console.log(" razorPay : ", data);
      initPayment(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePayAgain = async () => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "You want to continue payment !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Pay Now!",
    });
    if (confirmed.isConfirmed) {
      handlePayment();
    }
  };
  console.log(
    "joined edit : ",
    joinedArray.map((obj, index) => [index + 1, { NAME: obj.productDetails.variantName, PRICE: obj.price, QUANTITY: obj.quantity, TOTAL: obj.quantity * obj.price }])
  );
  return (
    <>
      <h3 className="text-center my-10 font-bold text-gray-600">Products</h3>

      <div className="p-3">
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <tbody className="text-sm divide-y divide-gray-100">
              {dataRetrieved &&
                joinedArray.map((item, idx) => (
                  <React.Fragment key={item._id}>
                    <tr className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-left">Products</div>
                      </th>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-left">Price</div>
                      </th>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-left">Quantity</div>
                      </th>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-center">Sub Total</div>
                      </th>
                    </tr>
                    <tr>
                      <td className="p-2 whitespace-nowrap">
                        <div className="flex gap-4 items-center">
                          <div className="font-medium text-gray-800">
                            <img src={`${BASE_URL}/uploads/${item.productDetails.images[0]}`} className="w-10 h-10 object-contain" />
                          </div>
                          <p>{item.productDetails.variantName}</p>
                        </div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-left">{item.price}</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-left font-medium text-green-500">{item.quantity}</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-xs text-center">₹{item.price * item.quantity}</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-sm text-center">{item?.offerType}</div>
                      </td>
                    </tr>
                    {/* {console.log("item : ", item)} */}
                    <tr className="border-none">
                      <td>
                        <Steps status={item?.orderStatus} />
                        {item.orderStatus !== "Cancelled" && item.orderStatus !== "Returned" && (
                          <>
                            {item.orderStatus === "Delivered" ? (
                              <button onClick={() => handleStatus(item._id, "Returned")} className="text-sm bg-[#3498db] mb-4 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 hover:bg-[#2980b9] focus:outline-none focus:ring focus:border-blue-300">
                                RETURN PRODUCT
                              </button>
                            ) : (
                              <>
                                {paymentStatus !== "Failed" && (
                                  <button onClick={() => handleStatus(item._id, "Cancelled")} className="text-sm bg-[#3498db] mb-4 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 hover:bg-[#2980b9] focus:outline-none focus:ring focus:border-blue-300">
                                    CANCEL PRODUCT
                                  </button>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
            </tbody>
          </table>
          {/* {paymentStatus !== "Failed" && (
            <button onClick={handleDownloadInvoice} className="ml-4 p-2 rounded-md">
              Download Invoice
            </button>
          )} */}

          {paymentStatus !== "Failed" && (
            <div className="ml-4 p-2 rounded-md">
              Download invoice : <PdfDownload jsonData={joinedArray} fileName={"invoice"} />
            </div>
          )}

          {paymentStatus === "Failed" && (
            <>
              <h3 className="text-red-500 text-center mb-4">Payment Failed</h3>
              <button onClick={handlePayAgain} className="mx-auto block mb-10 p-2 rounded-md bg-[#3498db] text-white font-bold transition-all duration-300 hover:bg-[#2980b9] focus:outline-none focus:ring focus:border-blue-300">
                Pay again
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default OrderDetails;
