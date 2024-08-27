import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useTheme } from '@mui/material';
import { tokens } from '../theme';

const BarChart = ({ 
  data = [], 
  xAxisLabel, 
  yAxisLabel, 
  showAverageLine, 
  averageValue,
  title // Add title prop
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Map categorical values to numerical values for the chart
  const mappedData = data.map(item => {
    let value;
    switch(item.value) {
      case 'PA':
        value = 50;
        break;
      case 'UP':
      case 'DPR':
      case 'ABS':
        value = 10;
        break;
      default:
        value = parseFloat(item.value) || 0;
    }
    return { ...item, value };
  });

  // Sort the data from highest to lowest
  const sortedData = [...mappedData].sort((a, b) => b.value - a.value);

  const nivoTheme = {
    axis: {
      ticks: {
        text: {
          fill: colors.grey[100], // Adjust the fill color
          fontSize: 12,
        },
      },
      legend: {
        text: {
          fill: colors.grey[100], // Adjust the fill color
          fontSize: 14,
        },
      },
    },
    labels: {
      text: {
        fill: colors.grey[100], // Adjust the fill color
        fontSize: 14,
      },
    },
    legends: {
      text: {
        fill: colors.grey[100], // Adjust the fill color
        fontSize: 14,
      },
    },
    tooltip: {
      container: {
        background: colors.primary[400], // Adjust the background color of the tooltip
        color: colors.grey[100], // Adjust the text color of the tooltip
        fontSize: 12,
      },
    },
  };

  // Define different shades of blue
  const shadesOfBlue = ['#b3d9ff', '#6699cc', '#336699'];

  // Handle no data case
  if (!Array.isArray(sortedData) || !sortedData.length) {
    return <div>No data available</div>;
  }

  // Find the minimum and maximum values in the data
  const minValue = Math.min(...sortedData.map(d => d.value));
  const maxValue = Math.max(...sortedData.map(d => d.value));

  // Function to normalize data and assign colors dynamically
  const getColor = (bar) => {
    if (maxValue === minValue) {
      // If all values are the same, return a single color
      return shadesOfBlue[0];
    }
    const normalizedValue = (bar.data.value - minValue) / (maxValue - minValue); // Normalize between 0 and 1
    const index = Math.floor(normalizedValue * (shadesOfBlue.length - 1));
    return shadesOfBlue[index];
  };

  // Custom Tooltip component for bars
  const CustomTooltip = ({ id, value, color }) => (
    <div
      style={{
        padding: '5px',
        background: color,
        color: 'white',
        borderRadius: '3px',
      }}
    >
      <strong>{id}</strong>: {value} {/* Display value directly */}
    </div>
  );

  return (
    <ThemeProvider theme={createTheme(theme)}>
      <div style={{ height: '100%', width: '100%' }}> {/* Ensure chart fills the container */}
        {title && (
          <h4 style={{ 
            textAlign: 'left', 
            fontSize: '1.2rem', // Smaller font size
            margin: '0 0 0px 0', // Reduced margin
            
          }}>
            {title}
          </h4>
        )}
        <ResponsiveBar
          data={sortedData}
          keys={['value']}
          indexBy="label"
          margin={{ top: 10, right: 20, bottom: 40, left: 30 }} // Adjust margins for space
          padding={0.3}
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          colors={getColor} // Ensure this function is used correctly
          borderRadius={2}
          borderWidth={1}
          borderColor={{
            from: 'color',
            modifiers: [
              ['darker', '1.3']
            ]
          }}
          theme={nivoTheme} // Apply the nivoTheme here
          axisTop={null}
          axisRight={null}
          axisLeft={{
            tickSize: 5,
            tickPadding: 10,
            tickRotation: 0,
            legend: yAxisLabel, // Ensure this is set to display the Y-axis label
            legendPosition: 'middle',
            legendOffset: -20,
            tickValues: [], // Hide tick values on Y-axis
          }}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -20, // Rotate x-axis labels to avoid overlap
            legend: xAxisLabel, // Set x-axis label
            legendPosition: 'middle',
            legendOffset: 30,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          tooltip={({ id, value, color }) => (
            <CustomTooltip id={id} value={value} color={color} />
          )}
          role="application"
          ariaLabel="Nivo bar chart demo"
          barAriaLabel={(e) => `${e.id}: ${e.formattedValue} in ${e.indexValue}`} // Show formatted value in aria-label
          layers={[
            'grid',
            'axes',
            'bars',
            'markers',
            'legends',
            'annotations',
            ({ bars, yScale }) => showAverageLine && (
              <line
                key="average-line"
                x1={0}
                x2="100%"
                y1={yScale(averageValue)}
                y2={yScale(averageValue)}
                stroke="red"
                strokeWidth={2}
                strokeDasharray="4 4"
              />
            ),
          ]}
        />
      </div>
    </ThemeProvider>
  );
};

export default BarChart;
