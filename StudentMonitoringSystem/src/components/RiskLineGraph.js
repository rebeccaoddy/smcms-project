import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import { Box } from '@mui/material';

// Register necessary components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const RiskLineGraph = ({ data }) => {
  // Extract labels (years)
  const labels = Object.keys(data);

  // Prepare datasets
  const datasets = [
    {
      label: 'High Risk',
      data: labels.map(year => data[year]['High Risk']?.Count || 0),
      borderColor: 'red',
      borderWidth: 2,
      fill: false,
    },
    {
      label: 'Medium Risk',
      data: labels.map(year => data[year]['Medium Risk']?.Count || 0),
      borderColor: 'orange',
      borderWidth: 2,
      fill: false,
    },
    {
      label: 'Low Risk',
      data: labels.map(year => data[year]['Low Risk']?.Count || 0),
      borderColor: 'green',
      borderWidth: 2,
      fill: false,
    },
  ];

  // Define chart data structure
  const chartData = {
    labels: labels,
    datasets: datasets,
  };

  // Define chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Disable maintaining aspect ratio
    scales: {
      x: {
        title: {
          display: true,
          text: 'Year',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Students',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <Box
      sx={{
        height: '110%',
        width: '100%',
      }}
    >
      <Line data={chartData} options={options} />
    </Box>
  );
};

export default RiskLineGraph;
