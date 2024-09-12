import React, { useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import BarChart from '../../../components/BarChart'; 
import { getPrograms } from '../../../Data/ProgramData/ProgramData';
import GraphToggleButton from '../../../components/GraphToggleButton';
import Header from '../../../components/Header';

const ProgramStats = () => {
  const [averageGPAData, setAverageGPAData] = useState([]);
  const [averageMarksData, setAverageMarksData] = useState([]);
  const [averageAtRiskData, setAverageAtRiskData] = useState([]);

  const [Toggle, setToggle] = useState('GPA');
  const ToggleOptions = ['GPA', 'MARKS', 'RISK'];

  useEffect(() => {
    const fetchProgramData = async () => {
      try {
        const data = await getPrograms(); // Fetch program data from your data source

        // Calculate average GPA
        const calculateAverageGPA = (programs) => {
          return programs.map(program => {
            const gpaData = program.GPA;
            const years = Object.keys(gpaData);
            const gpaTotals = years.reduce((acc, year) => {
              const gpas = Array.isArray(gpaData[year]) ? gpaData[year] : [];
              gpas.forEach(gpa => {
                const gpaValue = parseFloat(gpa.GPA); // Ensure GPA is a number
                if (!isNaN(gpaValue)) {
                  acc.totalGPA += gpaValue;
                  acc.count += 1;
                }
              });
              return acc;
            }, { totalGPA: 0, count: 0 });

            const averageGPA = gpaTotals.count > 0 ? (gpaTotals.totalGPA / gpaTotals.count) : 0;

            return {
                label: program.ProgramCode, // Use 'label' for x-axis
                value: parseFloat(averageGPA.toFixed(1)) // Use 'value' for the bar height
            };
          });
        };

        const averageGPA = calculateAverageGPA(data);
        setAverageGPAData(averageGPA);

        const calculateAverageMarks = (programs) => {
          return programs.map(program => {
            const marksData = program.Marks;
            const years = Object.keys(marksData);
            const markTotals = years.reduce((acc, year) => {
              const marks = Array.isArray(marksData[year]) ? marksData[year] : [];
              marks.forEach(mark => {
                const markValue = parseFloat(mark.GradeCode); // Ensure mark is a number
                if (!isNaN(markValue)) {
                  acc.totalMarks += markValue;
                  acc.count += 1;
                }
              });
              return acc;
            }, { totalMarks: 0, count: 0 });
        
            const averageMarks = markTotals.count > 0 ? (markTotals.totalMarks / markTotals.count) : 0;
        
            return {
              label: program.ProgramCode, // Use 'label' for x-axis
              value: parseFloat(averageMarks.toFixed(1)) // Use 'value' for the bar height
            };
          });
        };
        
        // Usage
        const averageMarks = calculateAverageMarks(data);
        setAverageMarksData(averageMarks);

         // Calculate average At-Risk Students
         const calculateAverageAtRiskStudents = (programs) => {
          return programs.map(program => {
            const riskData = program.RiskStats;
            const years = Object.keys(riskData);
            const riskTotals = years.reduce((acc, year) => {
              const riskLevels = riskData[year];
              if (riskLevels) {
                // Calculate the total number of at-risk students for the year
                const totalAtRisk = (riskLevels['Low Risk']?.Count || 0) +
                                    (riskLevels['Medium Risk']?.Count || 0) +
                                    (riskLevels['High Risk']?.Count || 0);
        
                acc.totalAtRisk += totalAtRisk;
                acc.count += 1;
              }
              return acc;
            }, { totalAtRisk: 0, count: 0 });

            const averageAtRisk = riskTotals.count > 0 ? (riskTotals.totalAtRisk / riskTotals.count) : 0;

            return {
              label: program.ProgramCode, // Use 'label' for x-axis
              value: parseFloat(averageAtRisk.toFixed(1)) // Use 'value' for the bar height
            };
          });
        };

        const averageAtRiskData = calculateAverageAtRiskStudents(data);
        setAverageAtRiskData(averageAtRiskData);
        

      } catch (error) {
        console.error('Error fetching program data:', error);
      }
    };

    fetchProgramData();
  }, []);

  return (
    <Box m="0px">
    

    <Grid container spacing={0}>
      {/* Average GPA Bar Chart */}
      <Grid item xs={12}>
        
      <Box sx={{ height: 280, width: '100%' }}>
  <Box 
    sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', // Space between header and toggle button
      mb: 0
    }}
  >
    <Header title="Programs" />
    <Box sx={{ ml: 'auto', mb: 3 }}> {/* 'ml: auto' to push the toggle button to the right */}
      <GraphToggleButton 
        options={ToggleOptions} 
        selectedOption={Toggle} 
        setSelectedOption={setToggle}
      />
    </Box>
  </Box>


      {Toggle === 'GPA' && <BarChart data={averageGPAData} yAxisLabel="Average GPA" title="Average GPA by program" />}
      {Toggle === 'MARKS' && <BarChart data={averageMarksData} yAxisLabel="Average Marks" title="Average Marks by program"/>}
      {Toggle === 'RISK' && <BarChart data={averageAtRiskData} yAxisLabel="Students at Risk" title="Average Risk by program" />}
</Box>


      </Grid>
    </Grid>
  </Box>
);
};

export default ProgramStats;
