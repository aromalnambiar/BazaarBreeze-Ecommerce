import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { BASE_URL } from "../../config";
import axios from "axios";

const EcommerceDashboard = () => {
  const [salesData, setSalesData] = useState({});

  const [chartData, setChartData] = useState({
    labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    datasets: [
      {
        label: "Monthly Sales",
        data: salesData.sales,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Monthly Cancelled",
        data: salesData.cancelled,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      {
        label: "Monthly Delivered",
        data: salesData.delivered,
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  });

  const options = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const containerStyle = { width: "100%", height: "25%", margin: "auto" };

  const updateChartSize = () => {
    const container = document.getElementById("chart-container");
    if (container) {
      const containerWidth = container.offsetWidth;
      setChartData((prevData) => ({
        ...prevData,
        width: containerWidth,
      }));
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const result = await axios.get(`${BASE_URL}/admin/orders/yearlysales`);
        setSalesData(result.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDetails();
  }, []);

  useEffect(() => {
    updateChartSize();
    window.addEventListener("resize", updateChartSize);
    return () => {
      window.removeEventListener("resize", updateChartSize);
    };
  }, []);

  // Update chartData whenever salesData changes
  useEffect(() => {
    setChartData({
      ...chartData,
      datasets: [
        {
          ...chartData.datasets[0],
          data: salesData.sales,
        },
        {
          ...chartData.datasets[1],
          data: salesData.cancelled,
        },
        {
          ...chartData.datasets[2],
          data: salesData.delivered,
        },
      ],
    });
  }, [salesData]);

  return (
    <div id="chart-container" style={containerStyle}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default EcommerceDashboard;
