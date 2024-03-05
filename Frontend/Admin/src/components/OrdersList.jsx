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
    <section className="flex flex-col justify-center antialiased bg-gray-100 text-gray-600  p-4">
      <div className="h-full">
        <div className="w-full max-w-6xl mx-auto bg-white shadow-lg rounded-sm border border-gray-200">
          <div className="bg-white p-6 flex items-center justify-between py-8">
            <input type="text" className="px-4 py-2 rounded-md border-2" placeholder="search products..." />
            <h2 className="font-semibold text-gray-800 text-center mt-4">Products</h2>
            <div></div>
          </div>

          <div className="p-3">
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                  <tr>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">USER NAME</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">ORDER DATE</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">PAYMENT METHOD</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-center">TOTAL AMOUNT</div>
                    </th>
                  </tr>
                </thead>

                <tbody className="text-sm divide-y divide-gray-100">
                  {orders.map((item, idx) => (
                    <React.Fragment key={item?.orderId}>
                      <tr className="text-[#697a8d] text-sm border hover:bg-slate-50 " onClick={() => toggleDropdown(item?.orderId)} style={{ cursor: "pointer" }}>
                        {/* {console.log("item : ", item)} */}
                        <td className="py-2 px-4 border-b">{item?.username}</td>
                        <td className="py-2 px-4 border-b">{item?.orderDate ? new Date(item?.orderDate).toLocaleDateString() : ""}</td>
                        <td className="py-2 px-4 border-b text-green-500">{item.paymentMethod}</td>
                        <td className="py-2 px-4 border-b">{item?.totalAmount || "0"}</td>
                      </tr>
                      {openDropdownOrderId === item?.orderId && (
                        <tr key={`${item?._id}-items`}>
                          <td colSpan="6" className="text-xs">
                            <table className="table-auto w-full">
                              <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                                <tr>
                                  <th className="p-2 whitespace-nowrap">
                                    <div className="font-semibold text-left">Product</div>
                                  </th>
                                  <th className="p-2 whitespace-nowrap">
                                    <div className="font-semibold text-left">Quantity</div>
                                  </th>
                                  <th className="p-2 whitespace-nowrap">
                                    <div className="font-semibold text-left">Order Status</div>
                                  </th>
                                  <th className="p-2 whitespace-nowrap">
                                    <div className="font-semibold text-center">Payment status</div>
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
          </div>
        </div>
      </div>
    </section>
  );
}

export default OrdersList;
