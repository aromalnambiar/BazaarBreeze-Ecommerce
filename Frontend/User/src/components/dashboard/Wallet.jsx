import { useEffect, useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../config";

function Wallet() {
  const navigate = useNavigate("");
  const [tableItems, setTableItems] = useState([]);
  const [balance, setBalance] = useState(null);
  useEffect(() => {
    axios
      .get(`${BASE_URL}/user/wallet`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log("result of orders : ", res.data);
        setBalance(res.data.balance);
        setTableItems(res.data.history);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8">
      <div className="flex justify-between my-6 px-4 font-bold text-green-500">
        <h1>Current Balance</h1>
        <h1>{balance}</h1>
      </div>
      <div className=" shadow-sm border rounded-lg custom-scroll overflow-x-auto">
        <table className="w-full table-auto text-sm text-left ">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b">
            <tr className="uppercase">
              <th className="py-3 px-6">NO</th>
              <th className="py-3 px-6">TRANSACTIONS</th>
              <th className="py-3 px-6">AMOUNT</th>
              <th className="py-3 px-6">DATE</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 divide-y">
            {tableItems.length == 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-16 font-bold text-lg">
                  No orders made
                </td>
              </tr>
            ) : (
              tableItems.map((item, idx) => (
                <tr key={idx}>
                  <td className="flex items-center gap-x-3 py-3 px-6 whitespace-nowrap">{idx + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.date ? new Date(item.date).toLocaleDateString() : ""}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Wallet;
