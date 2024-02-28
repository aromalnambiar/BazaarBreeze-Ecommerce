// MonthlySalesChart.js
import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { BASE_URL } from "../../config";
import axios from "axios";

const SalesChart = () => {
  const chartRef = useRef();

  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    // Fetch data from your API and update the state
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin/orders/monthlysalesarray`); // Replace with your API call
        setMonthlyData(response.data);
        console.log("response : ", response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!monthlyData || monthlyData.length === 0) {
      return;
    }

    const ctx = chartRef.current.getContext("2d");

    const chartData = {
      labels: monthlyData.map((entry) => entry.month),
      datasets: [
        // monthlyData.map((entry) => entry.salesCount)
        {
          label: "Sales Count",
          data: 11,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
        // monthlyData.map((entry) => entry.deliveredCount)
        {
          label: "Delivered Count",
          data: 8,
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
        // monthlyData.map((entry) => entry.cancelledCount)
        {
          label: "Cancelled Count",
          data: 3,
          backgroundColor: "rgba(255, 205, 86, 0.2)",
          borderColor: "rgba(255, 205, 86, 1)",
          borderWidth: 1,
        },
      ],
    };

    new Chart(ctx, {
      type: "bar",
      data: chartData,
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }, [monthlyData]);
  console.log("monthlyData : ", monthlyData);
  return (
    <div>
      <canvas ref={chartRef} width="300" height="100"></canvas>
    </div>
  );
};

export default SalesChart;
