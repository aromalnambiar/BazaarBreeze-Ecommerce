import { useState, useEffect } from "react";
import SimpleLineChart from "./SimpleLineChart";
import { BASE_URL } from "../../config";
import axios from "axios";

function Dashboard() {
  const [totalSalesCount, setTotalSalesCount] = useState();
  const [totalOrderAmount, setTotalOrderAmount] = useState();
  useEffect(() => {
    axios
      .get(`${BASE_URL}/admin/overallSalesCountAndAmount`)
      .then((res) => {
        console.log("response : ", res.data);
        setTotalOrderAmount(res.data.totalOrderAmount);
        setTotalSalesCount(res.data.totalSalesCount);
      })
      .catch((err) => {
        console.log("Error : ", err);
      });
  }, []);

  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-3 shadow-md min-h-40 border flex flex-col justify-center items-center gap-4 rounded-md bg-white">
          <p className="font-bold text-gray-600">Total salesCount</p>
          <h2 className="text-2xl text-gray-500">{totalSalesCount}</h2>
        </div>
        <div className="col-span-3 shadow-md min-h-40 border flex flex-col justify-center items-center gap-4 rounded-md bg-white">
          <p className="font-bold text-gray-600">Total Order Amount</p>
          <h2 className="text-2xl text-gray-500">₹ {totalOrderAmount}</h2>
        </div>
        <div className="col-span-3 shadow-md min-h-40 border flex flex-col justify-center items-center gap-4 rounded-md bg-white">
          <p className="font-bold text-gray-600">Monthly revenue</p>
          <h2 className="text-2xl text-gray-500">₹ 1412</h2>
        </div>
        <div className="col-span-3 shadow-md min-h-40 border flex flex-col justify-center items-center gap-4 rounded-md bg-white">
          <p className="font-bold text-gray-600">Yearly revenue</p>
          <h2 className="text-2xl text-gray-500">₹ 1412</h2>
        </div>
      </div>
      <div className="grid grid-cols-12 mt-20 ">
        <div className="col-span-8">
          <SimpleLineChart />
        </div>
      </div>
    </>
  );
}

export default Dashboard;
