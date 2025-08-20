// Pie chart component for category breakdown

import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import { Box, Typography } from "@mui/material";
import type { CategoryExpense } from "../../types";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: CategoryExpense[];
  title?: string;
  height?: number;
}

const PieChart: React.FC<PieChartProps> = ({
  data,
  title = "Expense Breakdown",
  height = 300,
}) => {
  if (!data || data.length === 0) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height={height}
        color="textSecondary"
      >
        <Typography variant="body2">No data available</Typography>
      </Box>
    );
  }

  const chartData = {
    labels: data.map((item) => item.categoryName),
    datasets: [
      {
        data: data.map((item) => item.amount),
        backgroundColor: data.map((item) => item.color || "#9E9E9E"),
        borderColor: data.map((item) => item.color || "#9E9E9E"),
        borderWidth: 2,
        hoverBorderWidth: 3,
        hoverBorderColor: "#ffffff",
      },
    ],
  };

  const options: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
          generateLabels: (chart) => {
            const datasets = chart.data.datasets;
            if (datasets.length) {
              return data.map((item, i) => ({
                text: `${item.categoryName} (${item.percentage.toFixed(1)}%)`,
                fillStyle: item.color || "#9E9E9E",
                strokeStyle: item.color || "#9E9E9E",
                lineWidth: 2,
                pointStyle: "circle",
                hidden: false,
                index: i,
              }));
            }
            return [];
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const item = data[context.dataIndex];
            return `${item.categoryName}: $${item.amount.toFixed(
              2
            )} (${item.percentage.toFixed(1)}%)`;
          },
        },
      },
    },
  };

  return (
    <Box>
      {title && (
        <Typography variant="h6" gutterBottom align="center">
          {title}
        </Typography>
      )}
      <Box height={height}>
        <Pie data={chartData} options={options} />
      </Box>
    </Box>
  );
};

export default PieChart;
