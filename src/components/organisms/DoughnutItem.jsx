import { ArcElement, Chart, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
Chart.register(ArcElement, Tooltip);

const userLevelData = (percentage, backgroundColor, borderColor) => ({
  datasets: [
    {
      data: [percentage, 100 - percentage],
      // backgroundColor: ["#38B2AC", "#E2E8F0"],
      backgroundColor: backgroundColor,
      // borderColor: ["#4FD1C5", "#CBD5E0"],
      borderColor: borderColor,
      hoverOffset: 0,
      cutout: "80%",
    },
  ],
});

const questProgressData = (percentage) => ({
  datasets: [
    {
      data: [percentage, 100 - percentage],
      backgroundColor: ["#4FD1C5", "#E2E8F0"],
      borderColor: ["#B2F5EA", "#CBD5E0"],
      hoverOffset: 0,
      cutout: "78%",
    },
  ],
});

const DoughnutItem = ({ percentage, type, backgroundColor, borderColor }) => {
  const data =
    type === "USER_LEVEL"
      ? userLevelData(percentage, backgroundColor, borderColor)
      : questProgressData(percentage);

  return <Doughnut data={data} height="80px" width="80px" />;
};

export default DoughnutItem;
