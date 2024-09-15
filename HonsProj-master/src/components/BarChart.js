import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useTheme } from '@mui/material';
import { tokens } from '../theme';

const BarChart = ({ 
  data = [], 
  xAxisLabel, 
  yAxisLabel,
  yScaleMin = 'auto', 
  yScaleMax = 'auto', 
  showAverageLine, 
  averageValue,
  title,
  isMarksData = false, 
  showYTicks = false, 
  showValues = true, // New prop to control whether values are shown on bars
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Map categorical values to numerical values for the chart, but preserve the original label
  const mappedData = data.map(item => {
    let value;
    switch (item.value) {
      case 'PA':
      case 'UP':
        value = 50;
        break;
      case 'LOA':
      case 'DPR':
      case 'ABS':
      case 'AB':
        value = 10;
        break;
      default:
        value = parseFloat(item.value) || 10;
    }
    return { ...item, value, originalLabel: item.value }; // Preserve original label
  });

  // Sort the data from highest to lowest
  const sortedData = [...mappedData].sort((a, b) => b.value - a.value);

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

  const shadesOfBlue = ['#b3d9ff', '#6699cc', '#336699'];

  if (!Array.isArray(sortedData) || !sortedData.length) {
    return <div>No data available</div>;
  }

  const minValue = Math.min(...sortedData.map(d => d.value));
  const maxValue = Math.max(...sortedData.map(d => d.value));

  const getColor = (bar) => {
    if (isMarksData && bar.data.value < 50) {
      return 'red'; 
    }
    if (maxValue === minValue) {
      return shadesOfBlue[0];
    }
    const normalizedValue = (bar.data.value - minValue) / (maxValue - minValue);
    const index = Math.floor(normalizedValue * (shadesOfBlue.length - 1));
    return shadesOfBlue[index];
  };

  const minBarHeight = 5;

  // Custom Tooltip component for bars
  const CustomTooltip = ({ id, value, color, data }) => (
    <div
      style={{
        padding: '5px',
        background: color,
        color: 'white',
        borderRadius: '3px',
      }}
    >
      <strong>{data.label}</strong>: ({value}) {/* Display original label and value */}
    </div>
  );

  return (
    <ThemeProvider theme={createTheme(theme)}>
      <div style={{ height: '100%', width: '100%' }}>
        {title && (
          <h4 style={{
            textAlign: 'left',
            fontSize: '1.2rem',
            margin: '0 0 0px 0',
          }}>
            {title}
          </h4>
        )}
        <ResponsiveBar
          data={sortedData}
          keys={['value']}
          indexBy="label"
          margin={{ top: 30, right: 20, bottom: 40, left: 50 }}
          padding={0.3}
          valueScale={{ type: 'linear', min: yScaleMin, max: yScaleMax }} 
          indexScale={{ type: 'band', round: true }}
          colors={getColor} 
          borderRadius={2}
          borderWidth={1}
          borderColor={{
            from: 'color',
            modifiers: [['darker', '1.3']]
          }}
          theme={nivoTheme}
          axisTop={null}
          axisRight={null}
          axisLeft={{
            tickSize: 5,
            tickPadding: 10,
            tickRotation: 0,
            legend: yAxisLabel,
            legendPosition: 'middle',
            legendOffset: -30,
            tickValues: showYTicks ? 'auto' : [],
          }}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -20,
            legend: xAxisLabel,
            legendPosition: 'middle',
            legendOffset: 30,
          }}
          // Conditionally render labels based on showValues prop
          label={showValues ? d => d.data.originalLabel : null}
          labelSkipWidth={showValues ? 12 : Infinity} // Skip labels if values should not be shown
          labelSkipHeight={showValues ? 12 : Infinity} // Skip labels if values should not be shown
          tooltip={({ id, value, color, data }) => (
            <CustomTooltip id={id} value={value} color={color} data={data} />
          )}
          role="application"
          ariaLabel="Nivo bar chart demo"
          barAriaLabel={(e) => `${e.id}: ${e.formattedValue} in ${e.indexValue}`}
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
