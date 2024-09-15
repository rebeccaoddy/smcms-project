import React from 'react';
import { ResponsiveRadar } from '@nivo/radar';
import { Box, useTheme } from "@mui/material";
import { tokens } from '../theme';

const RadarChart = ({ data }) => {
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

  return (
    <Box sx={{ height: '400px', width: '100%' }}>
      <ResponsiveRadar
        data={data}
        keys={['value']}
        indexBy="label"
        maxValue="auto"
        margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
        theme={nivoTheme}
        curve="linearClosed"
        borderWidth={2}
        borderColor={{ from: 'color' }}
        gridLevels={5}
        gridShape="circular"
        gridLabelOffset={36}
        enableDots={true}
        dotSize={10}
        dotColor={{ theme: 'background' }}
        dotBorderWidth={2}
        dotBorderColor={{ from: 'color' }}
        enableDotLabel={true}
        dotLabel="value"
        dotLabelYOffset={-12}
        colors={{ scheme: 'nivo' }}
        fillOpacity={0.25}
        blendMode="multiply"
        animate={true}
        motionConfig="wobbly"
        isInteractive={true}
        
      />
    </Box>
  );
};

export default RadarChart;