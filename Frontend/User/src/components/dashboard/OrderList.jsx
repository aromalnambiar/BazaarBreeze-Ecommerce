import React, { useEffect, useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../config";

function OrderList() {
  const navigate = useNavigate("");
  const [tableItems, setTableItems] = useState([]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/user/orders`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log("result of orders : ", res.data.orders);
        setTableItems(res.data.orders);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8">
      <div className="shadow-sm border rounded-lg custom-scroll overflow-x-auto">
        <table className="w-full table-auto text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b">
            <tr className="uppercase">
              <th className="py-3 px-6">No</th>
              <th className="py-3 px-6">payment method</th>
              <th className="py-3 px-6">date</th>
              <th className="py-3 px-6">total</th>
              <th className="py-3 px-6">action</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 divide-y text-xs">
            {tableItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-16 font-bold text-lg">
                  No orders made
                </td>
              </tr>
            ) : (
              tableItems.map((order, idx) => (
                <React.Fragment key={order._id}>
                  <tr className="bg-[#f9fafb]">
                    <td className="px-6 py-4 whitespace-nowrap">{idx + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.paymentMethod}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : ""}</td>
                    <td className="px-6 py-4 whitespace-nowrap">₹{order.totalAmount}</td>
                    <td onClick={() => navigate(`/dashboard/order-details/${order._id}`)} className="px-6 py-4 whitespace-nowrap cursor-pointer">
                      <a href="" className="flex gap-3 items-center text-[#2DA5F3] font-semibold">
                        View details
                        <FaArrowRightLong />
                      </a>
                    </td>
                  </tr>
                  <tr key={`${order._id}-items`}>
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
                            {/* Add more columns if needed */}
                          </tr>
                        </thead>
                        <tbody className="border-none ">
                          {order.orderedItems.map((item, itemIdx) => (
                            <tr key={`${order._id}-item-${itemIdx}`}>
                              {console.log("item : ", item)}
                              <td className="px-6 py-4 whitespace-nowrap">
                                <img src={`${BASE_URL}/uploads/${item.product.images[0]}`} className="w-12 h-12 object-contain" alt="" srcSet="" />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{item.orderStatus}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{item.paymentStatus}</td>
                              {/* Add more cells for additional item details */}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderList;
