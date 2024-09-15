import React, { useEffect, useState } from 'react';
import { getFacultyData } from '../../../Data/FacultyDataFolder/FacultyData'; 
import { Box, Button, Typography, Grid } from "@mui/material";
import { tokens } from '../../../theme';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../../components/Header';
import { useTheme } from '@mui/material/styles';
import LineGraph from '../../../components/LineGraph';
import BoxAndWhisker from '../../../components/BoxAndWhisker';
import BarChart from '../../../components/BarChart';
import GraphToggleButton from '../../../components/GraphToggleButton';
import FacultyRiskKPI from './FacultyRiskKPI';
import RiskLineGraph from '../../../components/RiskLineGraph';
import ProgramStats from './ProgramStats';
import ProgramOverviewHeader from '../../../components/ProgramOverviewHeader';
import ShowChartIcon from '@mui/icons-material/ShowChart';

{/* Function to calculate stats for the box plot chart */}
const calculateBoxPlotStats = (data, type = 'marks') => {
  if (!Array.isArray(data)) {
      console.warn('Expected an array but got:', data);
      return { min: null, q1: null, median: null, q3: null, max: null };
  }

  const validData = data
      .map(item => {
          let value;
          if (type === 'marks') {
              value = item.GradeCode;
          } else if (type === 'gpa') {
              value = item.GPA;
          }
          if (value !== undefined && value !== null) {
              return parseFloat(value.toString().replace(',', '.'));
          }
          return NaN;
      })
      .filter(value => !isNaN(value));

  if (validData.length === 0) {
      return { min: null, q1: null, median: null, q3: null, max: null };
  }

  const sortedData = [...validData].sort((a, b) => a - b);

  const min = sortedData[0];
  const max = sortedData[sortedData.length - 1] || null;
  const q1 = sortedData[Math.floor(sortedData.length * 0.25)] || null;
  const median = sortedData[Math.floor(sortedData.length * 0.5)] || null;
  const q3 = sortedData[Math.floor(sortedData.length * 0.75)] || null;

  return { min, q1, median, q3, max };
};

{/* Function to calculate the pass/fail stats */}
const calculatePassesAndFails = (marks, passMark = 50) => {
  let passCount = 0;
  let failCount = 0;
  let DPRCount = 0;
  let UP = 0;
  let PA = 0;
  let LOA = 0;
  let AB = 0;
  let other = 0;

  marks.forEach(item => {
      const mark = item.GradeCode;
      if (mark === "DPR") {
          DPRCount++;
      } else if (mark === "UP") {
          UP++;
      } else if (mark === "PA") {
          PA++;
      } else if (mark === "LOA") {
          LOA++;
      } else if (mark === "AB") {
          AB++;
      } else if (!mark || isNaN(parseFloat(mark))) {
        // If the mark is empty or cannot be parsed into a number
        other++; 
      } else {
          const numericMark = parseFloat(mark);
          if (!isNaN(numericMark)) {
              if (numericMark >= passMark) {
                  passCount++;
              } else {
                  failCount++;
              }
          }
      }
  });

  return { passCount, failCount, DPRCount, UP, PA, LOA, AB, other };
};

const Faculty = () => {
  const { FacultyID } = useParams();
  const [faculty, setFaculty] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const [enrollmentData, setEnrollmentData] = useState([]);
  const [boxPlotData, setBoxPlotData] = useState([]);
  const [gpaBoxPlotData, setGpaBoxPlotData] = useState([]);
  const [GenderData, setGenderData] = useState([]);
  const [PopulationData, setPopulationData] = useState({});
  const [PassFailStats, setPassFailStats] = useState([]);
  const [riskData, setRiskData] = useState({});

  const [chartType, setChartType] = useState('Gender'); // 'Gender' or 'Population'
  const chartToggleOptions = ['Gender', 'Population'];
  const [view, setView] = useState('kpi'); // State to manage the current view

  const handleToggle = () => {
      setView(view === 'kpi' ? 'line' : 'kpi');
  };

  const [selectedYear, setSelectedYear] = useState('2020');
    const yearOptions = ['2020', '2021', '2022'];

  useEffect(() => {
      const fetchFacultyDetails = async () => {
          try {
              const data = await getFacultyData(); // Fetch all faculty data first
              const selectedFaculty = data.find(fac => fac.FacultyID === FacultyID);
              setFaculty(selectedFaculty);

              if (selectedFaculty) {
                // Enrollment Data
                const preparedData = (selectedFaculty.NumberOfStudents && Object.entries(selectedFaculty.NumberOfStudents).map(([year, count]) => ({
                    x: year,
                    y: count,
                }))) || [];
                setEnrollmentData([{ id: 'Enrollment', data: preparedData }]);

                  // Marks Data
                  if (selectedFaculty.Marks) {
                      const marksData = {
                          2020: Array.isArray(selectedFaculty.Marks["2020"]) ? selectedFaculty.Marks["2020"] : [],
                          2021: Array.isArray(selectedFaculty.Marks["2021"]) ? selectedFaculty.Marks["2021"] : [],
                          2022: Array.isArray(selectedFaculty.Marks["2022"]) ? selectedFaculty.Marks["2022"] : [],
                      };
                      const marksStats = [
                          { Year: 2020, ...calculateBoxPlotStats(marksData[2020], 'marks') },
                          { Year: 2021, ...calculateBoxPlotStats(marksData[2021], 'marks') },
                          { Year: 2022, ...calculateBoxPlotStats(marksData[2022], 'marks') },
                      ];
                      setBoxPlotData(marksStats);

                      // Pass/Fail Stats
                      const passFailStats2020 = calculatePassesAndFails(marksData[2020]);
                      const passFailStats2021 = calculatePassesAndFails(marksData[2021]);
                      const passFailStats2022 = calculatePassesAndFails(marksData[2022]);
                      setPassFailStats({
                          2020: passFailStats2020,
                          2021: passFailStats2021,
                          2022: passFailStats2022,
                      });
                  }

                  // GPA Data
                  if (selectedFaculty.GPA) {
                      const gpaData = {
                          2020: Array.isArray(selectedFaculty.GPA["2020"]) ? selectedFaculty.GPA["2020"] : [],
                          2021: Array.isArray(selectedFaculty.GPA["2021"]) ? selectedFaculty.GPA["2021"] : [],
                          2022: Array.isArray(selectedFaculty.GPA["2022"]) ? selectedFaculty.GPA["2022"] : [],
                      };
                      const gpaStats = [
                          { Year: 2020, ...calculateBoxPlotStats(gpaData[2020], 'gpa') },
                          { Year: 2021, ...calculateBoxPlotStats(gpaData[2021], 'gpa') },
                          { Year: 2022, ...calculateBoxPlotStats(gpaData[2022], 'gpa') },
                      ];
                      setGpaBoxPlotData(gpaStats);
                  }

                  // Gender Data
                  if (selectedFaculty.Genders) {
                      const genderData2020 = Object.entries(selectedFaculty.Genders["2020"] || {}).map(([gender, count]) => ({ label: gender, value: count }));
                      const genderData2021 = Object.entries(selectedFaculty.Genders["2021"] || {}).map(([gender, count]) => ({ label: gender, value: count }));
                      const genderData2022 = Object.entries(selectedFaculty.Genders["2022"] || {}).map(([gender, count]) => ({ label: gender, value: count }));
                      setGenderData({
                          2020: genderData2020,
                          2021: genderData2021,
                          2022: genderData2022,
                      });
                  }

                  // Population Groups Data
                  if (selectedFaculty.PopulationGroups) {
                      const populationData2020 = Object.entries(selectedFaculty.PopulationGroups["2020"] || {}).map(([group, count]) => ({ label: group, value: count }));
                      const populationData2021 = Object.entries(selectedFaculty.PopulationGroups["2021"] || {}).map(([group, count]) => ({ label: group, value: count }));
                      const populationData2022 = Object.entries(selectedFaculty.PopulationGroups["2022"] || {}).map(([group, count]) => ({ label: group, value: count }));
                      setPopulationData({
                          2020: populationData2020,
                          2021: populationData2021,
                          2022: populationData2022,
                      });
                  }

                  // Risk Data
                  if (selectedFaculty.RiskStats) {
                      const riskData = {
                          2020: selectedFaculty.RiskStats["2020"] || {},
                          2021: selectedFaculty.RiskStats["2021"] || {},
                          2022: selectedFaculty.RiskStats["2022"] || {},
                      };
                      //console.log(riskData);
                      setRiskData(riskData);
                  }
              }
          } catch (error) {
              console.error("Failed to fetch faculty details:", error);
          }
      };

    fetchFacultyDetails();
    
}, [FacultyID]);

  return (
  <Box p={2}
  >
    {/*Program header & year toggle button*/}
    <Box p={0} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

        <ProgramOverviewHeader />
        
        <GraphToggleButton 
                options={yearOptions}
                selectedOption={selectedYear}
                setSelectedOption={setSelectedYear}
                sx={{
                
                ml: 'auto', // This will push the button to the right if there are elements on its left
                }}
            />  
        </Box>
    
    {/* Master Box */}
    <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="190px"
        gap="10px"
        p={1}
        mt={-3}
    >
    
    {/* Risk Box */}
    <Box
    gridColumn="span 11"
    gridRow="span 1"
    backgroundColor={colors.primary[400]}
    display="flex"
    
    flexDirection="column"
    justifyContent="space-between"
    borderRadius="10px"
    p={2}
    sx={{ height: '100%', width: '100%' }} // Ensures the box fills its container
    >
        {view === 'kpi' ? (
            <Box
            sx={{
                flexGrow: 1,
                width: '100%',
                minHeight: '130px',
                overflow: 'auto',
            }}
            >
            {selectedYear === '2020' && <FacultyRiskKPI riskStats={riskData[2020]} />}
            {selectedYear === '2021' && <FacultyRiskKPI riskStats={riskData[2021]} />}
            {selectedYear === '2022' && <FacultyRiskKPI riskStats={riskData[2022]} />}
            </Box>
        ) : (
            <Box
            sx={{
                flexGrow: 1,
                height: '100%',
                width: '100%',
            }}
            >
            <RiskLineGraph data={riskData} />
            </Box>
        )}
    </Box>

    {/* Risk Toggle button */}
    <Box
        gridColumn="span 1"
        gridRow="span 1"
        backgroundColor={colors.primary[400]}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        borderRadius="10px"
        p={2}
        height={"30%"}
        
    >  
        <Box
        width="100%"
        display="flex"
        justifyContent="center"
        flexDirection="column"
        alignItems="center"
        mb={0} 
        >   
            <Box display="flex" justifyContent="flex-end" mt={0}>
                <Button variant="contained" onClick={handleToggle}>
                {view === 'kpi' ? <ShowChartIcon /> : 'KPI'}
                </Button>
            </Box>
        </Box>
    </Box>
  
    {/*Number of students*/}
    <Box
       gridColumn="span 4"
       gridRow="span 1"
       backgroundColor={colors.primary[400]}
       display="flex"
       flexDirection="column"
       alignItems="space-between"
       justifyContent="center"
       p={3}
       borderRadius="10px"
    >
        <Typography variant="h5" fontWeight="bold" mb={0}>
            Enrollment Statistics
        </Typography>
        <LineGraph
        data={enrollmentData}  
        yAxisLabel="Students" />
    </Box>
    
     {/*Pass/Fail stats*/}
    <Box
       gridColumn="span 4"
       gridRow="span 1"
       backgroundColor={colors.primary[400]}
       display="flex"
       flexDirection="column"
       alignItems="stretch"
       justifyContent="flex-start"
       p={2}
       borderRadius="10px"
    >
       
        <Box display="flex"  alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h5" fontWeight="bold" mb={0}>
                    Pass / Fail Statistics
                </Typography>
                <Typography variant="h4" fontWeight="bold" mb={0}>
                {`${selectedYear}`}
                </Typography>
        
        </Box>
        
        {yearOptions.map((year) => (
            selectedYear === year && (
                <Box key={year} mb={0} p={2} borderRadius={4} boxShadow={3} bgcolor="background.paper" width="100%">
                   

                   <Box flexDirection="column" justifyContent="space-between" alignItems="center" mb={0}>
                                <Typography variant="h6" fontWeight={"bold"}>
                                    {`Passes: ${PassFailStats[year]?.passCount || 0}`}
                                </Typography>
                                <Typography variant="h6" fontWeight={"bold"}>
                                    {`Fails: ${PassFailStats[year]?.failCount || 0}`}
                                </Typography>
                            </Box>

                    <Grid container spacing={2} mt={0}>
                        {Object.entries(PassFailStats[year] || {}).map(([statusCode, count]) => (
                            !['passCount', 'failCount'].includes(statusCode) && (
                                <Grid item key={statusCode}>
                                    <Typography variant="body2">
                                        {`${statusCode}: ${count}`}
                                    </Typography>
                                </Grid>
                            )
                        ))}
                    </Grid>
                </Box>
            )
        ))}
    </Box>
    
    {/*Gender / Race charts*/}
    <Box
      gridColumn="span 4"
      gridRow="span 1"
      backgroundColor={colors.primary[400]}
      display="flex"
      flexDirection="column"
      alignItems="stretch"
      justifyContent="flex-start"
      p={2}
      borderRadius="10px"
    >
      {/* Chart Type Toggle */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={0}>
        
        <GraphToggleButton
          options={chartToggleOptions}
          selectedOption={chartType}
          setSelectedOption={setChartType}
        />
                        <Typography variant="h4" fontWeight="bold" mb={0}>
                {`${selectedYear}`}
                </Typography>
         
      </Box>

      {/* Year Toggle */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={0}>
       
       
      </Box>

      {/* Display the selected chart based on chartType and year */}
      <Box sx={{ flexGrow: 1, width: '100%', height: "100%", minHeight: '130px' }}>
        {chartType === 'Gender' && (
          <BarChart
            data={GenderData[selectedYear] || []}
            yAxisLabel="# Students"
            
          />
        )}
        {chartType === 'Population' && (
          <BarChart
            data={PopulationData[selectedYear] || []}
            showValues = {false}
            yAxisLabel="# Students"
          />
        )}
      </Box>
    </Box>

     {/*Mark Distribution*/}
     <Box
       gridColumn="span 4"
       gridRow="span 2"
       backgroundColor={colors.primary[400]}
       display="flex"
       flexDirection="column"
       justifyContent="space-between"
       p={2}
       borderRadius="10px"
       height="auto"
    >
        <Box sx={{ mb: -4}}> {/* Wrapper box for spacing */}
            <Header title="Mark Distribution" />
        </Box>
        <Box>
            <BoxAndWhisker boxPlotData={boxPlotData} />
        </Box>
        </Box>

    {/*GPA Distribution*/}
    <Box
       gridColumn="span 4"
       gridRow="span 2"
       backgroundColor={colors.primary[400]}
       display="flex"
       flexDirection="column"
       justifyContent="space-between"
       p={2}
       borderRadius="10px"
       height="auto"
    >
        <Box sx={{ mb: -4}}> {/* Wrapper box for spacing */}
        <Header title="GPA Distribution" />
        </Box>
       <BoxAndWhisker boxPlotData={gpaBoxPlotData} />
    </Box>
        
    {/*Program statistics*/}
    <Box
        gridColumn="span 4"
        gridRow="span 2"
        backgroundColor={colors.primary[400]}
        display="flex"
        flexDirection="column"
        alignItems="stretch" // Align items to the center horizontally
        justifyContent="flex-start"
        borderRadius="10px"
        p={2}
        
    >
        <ProgramStats />   
    </Box>

</Box>
</Box>
);
};
export default Faculty;
