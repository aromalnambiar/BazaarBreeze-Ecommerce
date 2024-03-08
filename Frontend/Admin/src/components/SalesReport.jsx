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
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`, // Assuming it's a Bearer token
          },
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
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("adminToken")}`,
          },
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
  console.log("Reports data : ", reports.map((obj, index) => [index + 1, ...Object.values(obj)]));

  return (
    <section className="flex flex-col justify-center antialiased bg-gray-100 text-gray-600  p-4">
      <div className="h-full">
        <div className="w-full max-w-6xl mx-auto bg-white shadow-lg rounded-sm border border-gray-200">
          <header className=" border-b border-gray-100">
            <h2 className="font-semibold text-gray-800 text-center mt-4">Sales report</h2>
            <div className="bg-white p-4 flex justify-start gap-4 py-8">
              <div className="border p-2 rounded-md">
                <DatePicker selected={startDate.toDate()} onChange={(date) => setStartDate(moment(date))} />
              </div>
              <div className="border p-2 rounded-md">
                <DatePicker selected={endDate.toDate()} onChange={(date) => setEndDate(moment(date))} />
              </div>
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
          </header>
          <div className="p-3">
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                  <tr>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">NO</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">DATE</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">ORDERS</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-center">REVENUE</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-center">CANCELLED_ORDERS</div>
                    </th>
                  </tr>
                </thead>

                <tbody className="text-sm divide-y divide-gray-100">
                  {reports.map((item, idx) => (
                    <tr key={item?._id}>
                      <td className="p-2 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="font-medium text-gray-800">{idx + 1}</div>
                        </div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-left">{item?._id}</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-left font-medium text-green-500">{item?.numberOfOrders}</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-xs text-center">₹ {item?.revenue}</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-sm text-center">{item?.cancelledOrders}</div>
                      </td>
                    </tr>
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

export default SalesReport;
