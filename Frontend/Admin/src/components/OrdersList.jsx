import React, { useEffect, useState } from "react";
import photo from "../assets/images/Customer.png";
import { FaCircleUser } from "react-icons/fa6";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config";
import Swal from "sweetalert2";

function OrdersList() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isToggle, setIsToggle] = useState(false);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState({});
  const [openDropdownOrderId, setOpenDropdownOrderId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/admin/orders`, {
          headers: {
            Authorization: `${localStorage.getItem("adminToken")}`,
          },
        });
        // console.log("res : ", res.data.orders);
        const ordersWithStatus = res.data.orders.reduce((acc, order) => {
          acc[order.orderId] = order.orderStatus;
          return acc;
        }, {});
        // console.log("orders with status : ", ordersWithStatus);
        setSelectedOrderStatus(ordersWithStatus);
        setOrders(res.data.orders);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleOrderStatusChange = async (orderId, newOrderStatus) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/admin/orders/status`,
        { orderStatus: newOrderStatus, orderId },
        {
          headers: {
            Authorization: `${localStorage.getItem("adminToken")}`,
          },
        }
      );
      Swal.fire({
        title: "Success!",
        text: `${response.data.message}`,
        icon: "success",
      });
    } catch (error) {
      // console.error("Error updating order status:", error);
      Swal.fire({
        title: "Not Success!",
        text: "Order is not updated successfully",
        icon: "error",
      });
    }
  };

  const handleChange = async (orderId, value) => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, proceed !",
    });
    if (confirmed.isConfirmed) {
      setSelectedOrderStatus((prevStatus) => {
        const updatedStatus = {
          ...prevStatus,
          [orderId]: value,
        };
        handleOrderStatusChange(orderId, updatedStatus[orderId]); // Pass the updated value to the function
        return updatedStatus; // Return the updated status
      });
    }
  };

  const toggleDropdown = (orderId) => {
    setOpenDropdownOrderId((prevId) => (prevId === orderId ? null : orderId));
  };

  return (
    <div className=" border border-gray-300 overflow-hidden shadow-md rounded-2xl mb-20">
      <div className="bg-white p-6 flex justify-between py-8">
        <input type="text" className="px-4 py-2 rounded-md border-2" placeholder="search user..." />
      </div>
      <table className="min-w-full bg-white ">
        <thead>
          <tr className="text-[#566a7f] border-t text-sm bg-[#e3e3e3]">
            <th className="py-2 text-start pl-4 font-medium border-b">USER NAME</th>
            <th className="py-2 text-start pl-4 font-medium border-b">ORDER DATE</th>
            <th className="py-2 text-start pl-4 font-medium border-b">PAYMENT METHOD</th>
            <th className="py-2 text-start pl-4 font-medium border-b">TOTAL AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((item) => (
            <React.Fragment key={item?.orderId}>
              <tr className="text-[#697a8d] text-sm border bg-[#f8f8f8]" onClick={() => toggleDropdown(item?.orderId)} style={{ cursor: "pointer" }}>
                {/* {console.log("item : ", item)} */}
                <td className="py-2 px-4 border-b">{item?.username}</td>
                <td className="py-2 px-4 border-b">{item?.orderDate ? new Date(item?.orderDate).toLocaleDateString() : ""}</td>
                <td className="py-2 px-4 border-b">{item.paymentMethod}</td>
                {/* <td className="py-2 px-4 border-b">
                <select value={selectedOrderStatus[item?.orderId] || item.orderStatus} onChange={(e) => handleChange(item?.orderId, e.target.value)} className="p-2">
                <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td> */}
                <td className="py-2 px-4 border-b">{item?.totalAmount || "0"}</td>
              </tr>
              {openDropdownOrderId === item?.orderId && (
                <tr key={`${item?._id}-items`}>
                  <td colSpan="6" className="text-xs">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quantity
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Order status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Payment status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="border-none ">
                        {item?.orderedItems.map((item2, itemIdx) => (
                          <tr key={`${item2?._id}-item-${itemIdx}`}>
                            {console.log("item : ", item)}

                            <td className="px-6 py-4 whitespace-nowrap">{itemIdx + 1}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{item2.quantity}</td>
                            <td className="py-2 px-4 border-b">
                              <select value={selectedOrderStatus[item2?._id] || item2.orderStatus} onChange={(e) => handleChange(item?.orderId, e.target.value)} className="p-2">
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{item2?.paymentStatus}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrdersList;
