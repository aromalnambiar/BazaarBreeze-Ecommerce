import React, { useEffect, useState } from "react";
import photo from "../assets/images/Customer.png";
import { FaCircleUser } from "react-icons/fa6";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config";

function OrdersList() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isToggle, setIsToggle] = useState(false);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState({});

  useEffect(() => {
    const result = axios
      .get(`${BASE_URL}/admin/orders`)
      .then((res) => {
        console.log("res : ", res.data.orders);
        const ordersWithStatus = res.data.orders.reduce((acc, order) => {
          acc[order._id] = order.orderStatus;
          return acc;
        }, {});
        setSelectedOrderStatus(ordersWithStatus);
        setOrders(res.data.orders);
        // setUsers(()=>);
      })
      .catch((res) => {
        console.log(res);
      });
  }, []);

  const handleOrderStatusChange = async (orderId, newOrderStatus) => {
    try {
      console.log("orderId: ", orderId, "orderStatus: ", newOrderStatus);
      const response = await axios.patch(
        `${BASE_URL}/admin/orders/status`,
        { orderStatus: newOrderStatus, orderId },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      alert("updated successfully");
      console.log("Order status updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleChange = (orderId, value) => {
    setSelectedOrderStatus((prevStatus) => {
      const updatedStatus = {
        ...prevStatus,
        [orderId]: value,
      };
      handleOrderStatusChange(orderId, updatedStatus[orderId]); // Pass the updated value to the function
      return updatedStatus; // Return the updated status
    });
  };

  // const handleBlur = (orderId) => {
  //   handleOrderStatusChange(orderId);
  // };
  return (
    <div className=" border border-gray-300 overflow-hidden shadow-md rounded-2xl mb-20">
      <div className="bg-white p-6 flex justify-between py-8">
        <input type="text" className="px-4 py-2 rounded-md border-2" placeholder="search user..." />
        {/* <div>
          <button className="bg-[#696cff] text-white px-8 py-2 rounded-md shadow-lg">Add Customer</button>
        </div> */}
      </div>
      <table className="min-w-full bg-white ">
        <thead>
          <tr className="text-[#566a7f] border-t text-sm">
            {/* <th className="py-2 text-start pl-8 font-medium border-b">ORDER ID</th> */}
            <th className="py-2 text-start pl-8 font-medium border-b">USER ID</th>
            <th className="py-2 text-start pl-4 font-medium border-b">ORDER DATE</th>
            <th className="py-2 text-start pl-4 font-medium border-b">PAYMENT STATUS</th>
            <th className="py-2 text-start pl-4 font-medium border-b">PAYMENT METHOD</th>
            <th className="py-2 text-start pl-4 font-medium border-b">ORDER STATUS</th>
            <th className="py-2 text-start pl-4 font-medium border-b">TOTAL AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((item) => (
            <tr key={item?._id} className="text-[#697a8d] text-sm">
              <td className="py-2 px-4 border-b">{item?.userId}</td>
              <td className="py-2 px-4 border-b">{item.orderDate ? new Date(item.orderDate).toLocaleDateString() : ""}</td>
              <td className="py-2 px-4 border-b">{item?.paymentStatus}</td>
              <td className="py-2 px-4 border-b">{item.paymentMethod}</td>
              <td className="py-2 px-4 border-b">
                <select value={selectedOrderStatus[item._id] || item.orderStatus} onChange={(e) => handleChange(item._id, e.target.value)} className="p-2">
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
              <td className="py-2 px-4 border-b">{item?.totalAmount || "0"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrdersList;
