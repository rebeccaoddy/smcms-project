import React from "react";
import { AgCharts } from "ag-charts-react";
import "ag-charts-enterprise";

const BoxAndWhisker = ({ boxPlotData }) => {
  

  const options = {
    
    data: boxPlotData,
    series: [
      {
        type: "box-plot",
        yName: "Mark Distribution",
        xKey: "Year",
        minKey: "min",
        q1Key: "q1",
        medianKey: "median",
        q3Key: "q3",
        maxKey: "max",
      },
    ],
    background: {
      fill: 'transparent', // Set background to transparent
    },
  };

  return <AgCharts options={options} />;
};

export default BoxAndWhisker;
