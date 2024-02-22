import { useState } from "react";
import photo from "../../assets/images/Laptop.png";
// import Steps from "../order/Steps";
import Steps from "../order/Stepper";
import Timeline from "../order/Timeline";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../../../config";
import axios from "axios";

function OrderDetails() {
  const [items, setItems] = useState([]);
  const [order, setOrder] = useState({});
  const [dataRetrieved, setDataRetrieved] = useState(false);
  const [joinedArray, setJoinedArray] = useState([]);
  const [isToggle, setIsToggle] = useState(false);

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
      console.log("result1 : ", result.data.order);
      setOrder(result.data.order);
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

        console.log("result2 : ", result.data.variants);
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
      setJoinedArray(() =>
        order.orderedItems.map((obj1) => {
          const matchingObj2 = items.find((obj2) => obj1.product === obj2._id);

          if (matchingObj2) {
            return {
              ...obj1,
              ...matchingObj2,
            };
          } else {
            return obj1;
          }
        })
      );
    }
  }, [dataRetrieved]);

  console.log("joinedArray : ", joinedArray);

  const handleStatus = async (orderId, orderStatus) => {
    try {
      if (confirm("Are you sure ?")) {
        const result = await axios.patch(
          `${BASE_URL}/user/order/status`,
          {
            orderId,
            orderStatus,
          },
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        setIsToggle((prev) => !prev);
        console.log("status result : ", result);
      }
    } catch (error) {
      console.log(error);
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

  const handleDownloadInvoice = async () => {
    downloadInvoice();
  };

  return (
    <>
      <h3 className="text-center mb-10 font-bold text-gray-600">Order Timeline</h3>
      <Steps status={order?.orderStatus} />
      {/* {console.log("order status : ", order.orderStatus)} */}
      {order.orderStatus !== "Cancelled" &&
        (order.orderStatus === "Delivered" ? (
          <div onClick={() => handleStatus(order._id, "Returned")} className="text-sm text-center text-[#FA8232] font-bold mb-16 cursor-pointer">
            RETURN PRODUCT
          </div>
        ) : (
          <div onClick={() => handleStatus(order._id, "Cancelled")} className="text-sm text-center text-[#FA8232] font-bold mb-16 cursor-pointer">
            CANCEL PRODUCT
          </div>
        ))}
      {/* <Timeline /> */}
      <h3 className="text-center my-10 font-bold text-gray-600">Product</h3>
      <table className="w-full mt-10 table-auto border text-sm text-left shadow-lg">
        <thead className="bg-[#F2F4F5] text-gray-600 font-medium border-b">
          <tr className="uppercase">
            <th className="py-3 px-6">Products</th>
            <th className="py-3 px-6">Price</th>
            <th className="py-3 px-6">Quantity</th>
            <th className="py-3 px-6">Sub total</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 divide-y">
          {dataRetrieved &&
            joinedArray.map((item, idx) => (
              <tr key={item?._id}>
                <td className="flex items-center gap-x-3 py-3 px-6 whitespace-nowrap">
                  {/* <p>{item._id}</p> */}
                  <img src={`${BASE_URL}/uploads/${item.images[0]}`} className="w-10 h-10 " />
                  <div>
                    <span className="block text-gray-700 text-sm font-medium">{item.variantName}</span>
                    <span className="block text-gray-700 text-xs">{item.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">₹{item.price}</td>
                <td className="px-6 py-4 whitespace-nowrap">x {item.quantity}</td>

                <td className="px-6 py-4 whitespace-nowrap">₹{item.price * item.quantity}</td>
              </tr>
            ))}
        </tbody>
      </table>
      {/* address */}
      <div className="flex  flex-wrap justify-between gap-8">
        <div className="border max-w-xs h-max flex text-sm flex-col gap-4 p-10 my-8 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800">Shipping address</h3>
          <p>FullName : {order.shippingAddress?.fullName}</p>
          <p>Address : {order.shippingAddress?.address}</p>
          <p>Phone1 : {order.shippingAddress?.phone1}</p>
          <p>Phone2 : {order.shippingAddress?.phone2}</p>
        </div>
        <div onClick={handleDownloadInvoice} className="mt-10">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Download Invoice</button>
        </div>
      </div>
    </>
  );
}

export default OrderDetails;
