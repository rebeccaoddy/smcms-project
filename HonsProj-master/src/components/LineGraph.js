import { ResponsiveLine } from '@nivo/line';
import React from 'react';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import { tokens } from '../theme';
import { Box } from "@mui/material";

const LineGraph = ({ data, xAxisLabel, yAxisLabel }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const nivoTheme = {
    axis: {
      ticks: {
        text: {
          fill: colors.grey[100],
          fontSize: 12,
        },
      },
      legend: {
        text: {
          fill: colors.grey[100],
          fontSize: 14,
        },
      },
    },
    labels: {
      text: {
        fill: colors.grey[100],
        fontSize: 14,
      },
    },
    legends: {
      text: {
        fill: colors.grey[100],
        fontSize: 14,
      },
    },
    tooltip: {
      container: {
        background: colors.primary[400],
        color: colors.grey[100],
        fontSize: 12,
      },
    },
  };

  // Extract unique y-axis values from the data
  const getUniqueYValues = (data) => {
    const yValues = data.flatMap(serie => serie.data.map(point => point.y));
    return Array.from(new Set(yValues)).sort((a, b) => a - b);
  };

  const yTickValues = getUniqueYValues(data);

  // Define a minimum distance between tick values
  const threshold = (Math.max(...yTickValues) - Math.min(...yTickValues)) * 0.1; // Example: 10% of the range

  // Function to filter tick values based on the threshold
  const filterTickValues = (ticks) => {
    let filteredTicks = [];
    ticks.forEach(tick => {
      if (
        filteredTicks.length === 0 || 
        Math.abs(tick - filteredTicks[filteredTicks.length - 1]) > threshold
      ) {
        filteredTicks.push(tick);
      }
    });
    return filteredTicks;
  };

  const filteredTickValues = filterTickValues(yTickValues);

  return (
    <ThemeProvider theme={createTheme(theme)}>
      <ResponsiveLine
        data={data}
        colors={{ scheme: 'nivo' }}
        theme={nivoTheme}
        margin={{ top: 30, right: 35, bottom: 40, left: 60 }} // Adjust margins if needed
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
        yFormat=" >-.2f"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: xAxisLabel || false, // Set to false if no label is provided
          legendOffset: 36,
          legendPosition: 'middle',
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: yAxisLabel,
          legendOffset: -50,
          legendPosition: 'middle',
          tickValues: filteredTickValues, // Use the filtered tick values
        }}
        pointSize={5}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabel="yFormatted"
        pointLabelYOffset={-12}
        enableCrosshair={true}
        useMesh={true}
      />
    </ThemeProvider>
  );
};

export default LineGraph;
