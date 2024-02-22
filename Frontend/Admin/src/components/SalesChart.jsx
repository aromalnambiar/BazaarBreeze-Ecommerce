// MonthlySalesChart.js
import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const SalesChart = () => {
  const data = {
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    sales: [100, 150, 200, 120, 180, 250, 300, 280, 200, 150, 120, 180],
  };
  const chartRef = useRef();

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.months,
        datasets: [
          {
            label: "Monthly Sales",
            data: data.sales,
            backgroundColor: "rgba(75, 192, 192, 0.2)", // Adjust color as needed
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
          {
            label: "Monthly Sales",
            data: data.sales, 
            backgroundColor: "rgba(75, 192, 192, 0.2)", // Adjust color as needed
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
          {
            label: "Monthly Sales",
            data: data.sales, 
            backgroundColor: "rgba(75, 192, 192, 0.2)", // Adjust color as needed
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
          {
            label: "Monthly Sales",
            data: data.sales, 
            backgroundColor: "rgba(75, 192, 192, 0.2)", // Adjust color as needed
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }, [data]);

  return (
    <div>
      <canvas ref={chartRef} width="500" height="200"></canvas>
    </div>
  );
};

export default SalesChart;
