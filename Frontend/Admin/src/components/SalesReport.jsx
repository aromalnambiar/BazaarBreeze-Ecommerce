import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import axios from "axios";
import { BASE_URL } from "../../config";
import moment from "moment";
import PdfDownload from "./PdfDownload";

function SalesReport() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [isToggle, setIsToggle] = useState(false);
  const [startDate, setStartDate] = useState(moment("2024-01-01T00:00:00"));
  const [endDate, setEndDate] = useState(moment());

  useEffect(() => {
    console.log("adminToken", `${localStorage.getItem("adminToken")}`);
    const result = axios
      .get(`${BASE_URL}/admin/salesReport`, {
        params: {
          startDate: startDate.format("YYYY-MM-DD"),
          endDate: endDate.format("YYYY-MM-DD"),
        },
        headers: {
          Authorization: `${localStorage.getItem("adminToken")}`,
        },
      })
      .then((res) => {
        console.log("res : ", res.data);
        setReports(res.data);
      })
      .catch((res) => {
        console.log(res);
      });
  }, [startDate, endDate]);

  const downloadExcel = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/admin/salesExcel`,
        {
          reports,
        },
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: response.headers["content-type"] });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "salesReport.xlsx";

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading Excel file:", error);
    }
  };

  const downloadCSV = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/admin/salesCSV`,
        {
          reports,
        },
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: response.headers["content-type"] });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "salesReport.csv";

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading CSV file:", error);
    }
  };

  // console.log("startDate : ", startDate.format("YYYY-MM-DD"));
  // console.log("endDate : ", endDate.format("YYYY-MM-DD"));

  console.log("Reports : ", reports);

  return (
    <div className=" border border-gray-300 overflow-hidden shadow-md rounded-2xl mb-20">
      <div className="bg-white p-6 flex justify-start gap-4 py-8">
        <div className="border p-2 rounded-md">
          <DatePicker selected={startDate.toDate()} onChange={(date) => setStartDate(moment(date))} />
        </div>
        <div className="border p-2 rounded-md">
          <DatePicker selected={endDate.toDate()} onChange={(date) => setEndDate(moment(date))} />
        </div>
        {/* <button className="border bg-green-400 hover:bg-green-500 text-white px-4 rounded-md">PDF</button> */}
        <div className="flex gap-4 items-center ml-auto">
          <p>Download as : </p>
          <PdfDownload jsonData={reports} fileName={"salesReport"} />
          <button onClick={downloadExcel} className="text-sm hover:text-blue-500">
            Excel
          </button>
          <button onClick={downloadCSV} className="text-sm hover:text-blue-500">
            CSV
          </button>
        </div>
      </div>
      <table className="min-w-full bg-white ">
        <thead>
          <tr className="text-[#566a7f] border-t text-sm">
            <th className="py-2 text-start pl-4 font-medium border-b">NO</th>
            <th className="py-2 text-start pl-4 font-medium border-b">DATE</th>
            <th className="py-2 text-start pl-4 font-medium border-b">ORDERS</th>
            <th className="py-2 text-start pl-4 font-medium border-b">REVENUE</th>
            <th className="py-2 text-start pl-4 font-medium border-b">CANCELLED_ORDERS</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((item, index) => (
            <tr key={item?._id} className="text-[#697a8d] text-sm">
              <td className="py-2 px-4 border-b ml-2">{index + 1}</td>
              <td className="py-2 px-4 border-b">{item._id}</td>
              <td className="py-2 px-4 border-b">{item?.numberOfOrders}</td>
              <td className="py-2 px-4 border-b">₹ {item?.revenue}</td>
              <td className="py-2 px-4 border-b">{item.cancelledOrders}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SalesReport;
