import { useEffect, useState } from "react";
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
      <div className=" shadow-sm border rounded-lg custom-scroll overflow-x-auto">
        <table className="w-full table-auto text-sm text-left ">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b">
            <tr className="uppercase">
              <th className="py-3 px-6">Order Id</th>
              <th className="py-3 px-6">payment status</th>
              <th className="py-3 px-6">order status</th>
              <th className="py-3 px-6">date</th>
              <th className="py-3 px-6">total</th>
              <th className="py-3 px-6">action</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 divide-y">
            {tableItems.length == 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-16 font-bold text-lg">No orders made</td>
              </tr>
            ) : (
              tableItems.map((item, idx) => (
                <tr key={item._id}>
                  <td className="flex items-center gap-x-3 py-3 px-6 whitespace-nowrap">
                    <p>{item._id}</p>
                    {/* <img src={item.avatar} className="w-10 h-10 rounded-full" />
                    <div>
                      <span className="block text-gray-700 text-sm font-medium">{item.name}</span>
                      <span className="block text-gray-700 text-xs">{item.email}</span>
                    </div> */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.paymentStatus}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.orderStatus}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.orderDate ? new Date(item.orderDate).toLocaleDateString() : ""}</td>

                  <td className="px-6 py-4 whitespace-nowrap">₹{item.totalAmount}</td>
                  <td onClick={() => navigate(`/dashboard/order-details/${item._id}`)} className="px-6 py-4 whitespace-nowrap">
                    <a href="" className="flex gap-3 items-center text-[#2DA5F3] font-semibold">
                      View details
                      <FaArrowRightLong />
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderList;
