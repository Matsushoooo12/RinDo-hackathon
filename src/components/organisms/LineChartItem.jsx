import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChartItem = ({ groupChapterNumbers, oneselfChapterNumbers }) => {
  const generateRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        min: 0,
        max: 20,
        ticks: {
          stepSize: 2,
        },
      },
    },
  };

  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
  ];
  const data = {
    labels,
    datasets: [
      {
        label: "Group",
        data: groupChapterNumbers, // Group data as per your specification
        borderColor: "#81E6D9",
        backgroundColor: "#B2F5EA",
      },
      {
        label: "Oneself",
        data: oneselfChapterNumbers, // Oneself data as per your specification
        borderColor: "#FEB2B2",
        backgroundColor: "#FED7D7",
      },
    ],
  };
  return <Line options={options} data={data} />;
};

export default LineChartItem;
