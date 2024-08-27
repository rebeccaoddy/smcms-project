import React, { useEffect, useState } from 'react';
import { getPrograms } from '../../../Data/ProgramData/ProgramData'; // Adjust the import based on your data fetching method
import { Box, Button, IconButton, Typography, Link, List,Grid,ListItem, ListItemText } from "@mui/material";
import { tokens } from '../../../theme';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../../components/Header';
import { useTheme } from '@mui/material/styles';
import ScrollList from '../../../components/ScrollList';
import LineGraph from '../../../components/LineGraph';
import BoxAndWhisker from '../../../components/BoxAndWhisker';
import BarChart from '../../../components/BarChart';
import GraphToggleButton from '../../../components/GraphToggleButton';
import ProgramRiskKPI from './ProgramRiskKPI';
import RiskLineGraph from '../../../components/RiskLineGraph';

const calculateBoxPlotStats = (data, type = 'marks') => {
    // Ensure data is an array
    if (!Array.isArray(data)) {
        console.warn('Expected an array but got:', data);
        return { min: null, q1: null, median: null, q3: null, max: null };
    }

    const validData = data
        .map(item => {
            // Extract the relevant value based on type
            let value;
            if (type === 'marks') {
                value = item.GradeCode; // For marks, use GradeCode
            } else if (type === 'gpa') {
                value = item.GPA; // For GPA, use GPA
            }

            if (value !== undefined && value !== null) {
                return parseFloat(value.toString().replace(',', '.'));
            }
            return NaN; // Return NaN if the value is undefined or null
        })
        .filter(value => !isNaN(value)); // Filter out NaN values

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

const calculatePassesAndFails = (marks, passMark = 50) => {
    let passCount = 0;
    let failCount = 0;
    let DPRCount = 0;
    let UP = 0;
    let PA = 0;
    let LOA = 0;
    let AB = 0;

    marks.forEach(item => {
        const mark = item.GradeCode; // Access GradeCode directly
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
    
    return { passCount, failCount, DPRCount, UP, PA, LOA, AB };
};

const ProgramDetail = () => {
    const { ProgramCode } = useParams();
    const [program, setProgram] = useState(null);
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
    


    //Toggle variables
    const [GenderToggle, setGenderToggle] = useState('2020');
    const GenderToggleOptions = ['2020', '2021', '2022']

    const [PopulationToggle, setPopulationToggle] = useState('2020');
    const PopulationToggleOptions = ['2020', '2021', '2022']

    const [PassFailToggle, setPassFailToggle] = useState('2020');
    const PassFailToggleOptions = ['2020', '2021', '2022']

    const [RiskToggle, setRiskToggle] = useState('2020');
    const RiskToggleOptions = ['2020', '2021', '2022'];

    const [view, setView] = useState('kpi'); // State to manage the current view
    const handleToggle = () => {
        setView(view === 'kpi' ? 'line' : 'kpi');
    };

    useEffect(() => {
        const fetchProgramDetails = async () => {
            try {
                const data = await getPrograms(); // Fetch all programs first
                // Find the specific program based on ProgramCode
                const selectedProgram = data.find(prog => prog.ProgramCode === ProgramCode);
                setProgram(selectedProgram); // Set the selected program

                //Enrollment Data
                if (selectedProgram && selectedProgram.NumberOfStudents) {
                    const preparedData = Object.entries(selectedProgram.NumberOfStudents).map(([year, count]) => ({
                        x: year,
                        y: count,
                    }));

                    // Structure the data for the line graph
                    setEnrollmentData([{ id: 'Enrollment', data: preparedData }]);
                }

                // Extract marks data for each year
                if (selectedProgram && selectedProgram.Marks) {
                    const marksData = {
                        2020: Array.isArray(selectedProgram.Marks["2020"]) ? selectedProgram.Marks["2020"] : [],
                        2021: Array.isArray(selectedProgram.Marks["2021"]) ? selectedProgram.Marks["2021"] : [],
                        2022: Array.isArray(selectedProgram.Marks["2022"]) ? selectedProgram.Marks["2022"] : [],
                    };

                    // Construct marksStats with the new structure
                    const marksStats = [
                        {
                            Year: 2020,
                            ...calculateBoxPlotStats(marksData[2020], 'marks'),
                        },
                        {
                            Year: 2021,
                            ...calculateBoxPlotStats(marksData[2021], 'marks'),
                        },
                        {
                            Year: 2022,
                            ...calculateBoxPlotStats(marksData[2022], 'marks'),
                        },
                    ];

                    
                
                // Extract GPA data for each year
                if (selectedProgram && selectedProgram.GPA) {
                    const gpaData = {
                        2020: Array.isArray(selectedProgram.GPA["2020"]) ? selectedProgram.GPA["2020"] : [],
                        2021: Array.isArray(selectedProgram.GPA["2021"]) ? selectedProgram.GPA["2021"] : [],
                        2022: Array.isArray(selectedProgram.GPA["2022"]) ? selectedProgram.GPA["2022"] : [],
                    };

                    // Construct gpaStats
                    const gpaStats = [
                        {
                            Year: 2020,
                            ...calculateBoxPlotStats(gpaData[2020], 'gpa'),
                        },
                        {
                            Year: 2021,
                            ...calculateBoxPlotStats(gpaData[2021], 'gpa'),
                        },
                        {
                            Year: 2022,
                            ...calculateBoxPlotStats(gpaData[2022], 'gpa'),
                        },
                    ];

                    setGpaBoxPlotData(gpaStats);} // Store the results

                // Extract gender data for each year
                if (selectedProgram && selectedProgram.Genders) {
                    const genderData2020 = Object.entries(selectedProgram.Genders?.["2020"] || {}).map(([gender, count]) => ({ label: gender, value: count }));
                    const genderData2021 = Object.entries(selectedProgram.Genders?.["2021"] || {}).map(([gender, count]) => ({ label: gender, value: count }));
                    const genderData2022 = Object.entries(selectedProgram.Genders?.["2022"] || {}).map(([gender, count]) => ({ label: gender, value: count }));
        
                    setGenderData({
                        2020: genderData2020,
                        2021: genderData2021,
                        2022: genderData2022,
                    });
                } // Assuming `setGenderData` is the function to store this data
                
                // Extract population group data for each year
                if (selectedProgram && selectedProgram.PopulationGroups) {
                    const populationData2020 = selectedProgram.PopulationGroups?.["2020"] || {};
                    const populationData2021 = selectedProgram.PopulationGroups?.["2021"] || {};
                    const populationData2022 = selectedProgram.PopulationGroups?.["2022"] || {};

                    const year1PopulationData = Object.entries(populationData2020).map(([group, count]) => ({ label: group, value: count }));
                    const year2PopulationData = Object.entries(populationData2021).map(([group, count]) => ({ label: group, value: count }));
                    const year3PopulationData = Object.entries(populationData2022).map(([group, count]) => ({ label: group, value: count }));

                    // Set the population data in state
                    setPopulationData({
                        "2020": year1PopulationData,
                        "2021": year2PopulationData,
                        "2022": year3PopulationData
                    });
                }

                const passFailStats2020 = calculatePassesAndFails(marksData[2020]);
                const passFailStats2021 = calculatePassesAndFails(marksData[2021]);
                const passFailStats2022 = calculatePassesAndFails(marksData[2022]);

            // Set the pass/fail stats in state
                setPassFailStats({
                    2020: passFailStats2020,
                    2021: passFailStats2021,
                    2022: passFailStats2022,
                });

                setBoxPlotData(marksStats);
            
                // Extract risk data for each year
                if (selectedProgram && selectedProgram.RiskStats) {
                    const riskData = {
                        2020: selectedProgram.RiskStats["2020"] || {},
                        2021: selectedProgram.RiskStats["2021"] || {},
                        2022: selectedProgram.RiskStats["2022"] || {},
                    };
                    setRiskData(riskData);
                }
            }

            } catch (error) {
                console.error('Error fetching program details:', error);
            }
        };

        fetchProgramDetails();
    }, [ProgramCode]);

    if (!program) return <div>Loading...</div>;

    console.log(riskData)

    return (
        <Box p={2}>
            {/* Header and Back Button */}
    <Box display="flex" alignItems="center" mb={0}>
        <Button
            variant="contained"
            onClick={() => navigate(-1)}
            sx={{
                ml: 1,
                backgroundColor: colors.primary[400],
                color: colors.grey[100],
                '&:hover': {
                    backgroundColor: colors.primary[700],
                },
            }}
        >
            Back
        </Button>
        
        
        
        </Box>

            {/* Master Box */}
            <Box
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gridAutoRows="190px"
                gap="10px"
                p={1}
                mt={0}
            >
                {/* Header Box */}
                <Box
                gridColumn="span 3"
                gridRow="span 1"
                
                display="flex"
                flexDirection="column"
                alignItems="center" // Align items to the center horizontally
                justifyContent="center"
                borderRadius="10px"
                p={2}
                
            >
                    <Header title={program.ProgramCode} subtitle={"Welcome to your program overview"} />
                </Box>
            
            {/* Risk Box */}
            <Box
            gridColumn="span 8"
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
                    {RiskToggle === '2020' && <ProgramRiskKPI riskStats={riskData[2020]} />}
                    {RiskToggle === '2021' && <ProgramRiskKPI riskStats={riskData[2021]} />}
                    {RiskToggle === '2022' && <ProgramRiskKPI riskStats={riskData[2022]} />}
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

            
            <Box
                gridColumn="span 1"
                gridRow="span 1"
                backgroundColor={colors.primary[400]}
                display="flex"
                flexDirection="column"
                justifyContent="center"
                borderRadius="10px"
                p={2}
                height={"70%"}
                
            > 
            <Box
            width="100%"
            display="flex"
            justifyContent="center"
            flexDirection="column"
            alignItems="center"
            mb={0} // Add margin at the bottom of the toggle button
            //overflow="hidden" // Hide overflow content for toggle button
                >
                <GraphToggleButton 
                options={RiskToggleOptions} 
                selectedOption={RiskToggle} 
                setSelectedOption={setRiskToggle}
            
            />

            <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button variant="contained" onClick={handleToggle}>
                Toggle to {view === 'kpi' ? 'Line Graph' : 'KPI Cards'}
                </Button>
            </Box>

            </Box>
            </Box>

                {/*Scroll List */}
                <Box
                gridColumn="span 4"
                gridRow="span 1"
                backgroundColor={colors.primary[400]}
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                borderRadius="10px"
                p={2}
                
            >
                <Typography variant="h5" fontWeight="bold" mb={0}>
                    Courses
                </Typography>
                {program.CourseCode && (
                        <ScrollList items={program.CourseCode} />
                    )}
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
                yAxisLabel="# of Students" />
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
                <Typography variant="h5" fontWeight="bold">
                    Pass/Fail Statistics
                </Typography>
                <GraphToggleButton 
                    options={PassFailToggleOptions} 
                    selectedOption={PassFailToggle} 
                    setSelectedOption={setPassFailToggle} 
                />
            </Box>
                
                {PassFailToggleOptions.map((year) => (
                    PassFailToggle === year && (
                        <Box key={year} mb={0} p={2} borderRadius={4} boxShadow={3} bgcolor="background.paper" width="100%">
                           

                            <Box  justifyContent="space-between" alignItems="center" mb={0}>
                                <Typography variant="h6">
                                    {`Passes: ${PassFailStats[year]?.passCount || 0}`}
                                </Typography>
                                <Typography variant="h6">
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
                
            {/*Gender Data*/}
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
                <Box display="flex"  alignItems="center" justifyContent="space-between" mb={0}>
                    <Typography variant="h5" fontWeight="bold">
                        Gender Statistics
                    </Typography>
                    <GraphToggleButton options={GenderToggleOptions} selectedOption={GenderToggle} setSelectedOption={setGenderToggle}/>
                </Box>
            {/* Bar Charts for Gender Data */}
            <Box sx={{ flexGrow: 1, width: '100%', height: "100%", minHeight: '130px' }}>
            {GenderToggle === '2020' && (
                <BarChart data={GenderData["2020"]}  yAxisLabel="# of Students"/>
            )}

            {GenderToggle === '2021' && (
                <BarChart data={GenderData["2021"]}  yAxisLabel="# of Students"/>
            )}

            {GenderToggle === '2022' && (
                <BarChart data={GenderData["2022"]}  yAxisLabel="# of Students"/>
            )}

        </Box>
                
            </Box>
            {/*Race Data*/}
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
                <Box display="flex"  alignItems="center" justifyContent="space-between" mb={0}>
                    <Typography variant="h5" fontWeight="bold">
                        Race Statistics
                    </Typography>
                <GraphToggleButton options={PopulationToggleOptions} selectedOption={PopulationToggle} setSelectedOption={setPopulationToggle}/>
                </Box>

                {/* Bar Charts for Population Group Data */}
                <Box sx={{ flexGrow: 1, width: '100%', height: "100%", minHeight: '130px' }}>
                    {PopulationToggle === '2020' && (
                        <BarChart data={PopulationData["2020"]}  yAxisLabel="# of Students"/>
                    )}

                    {PopulationToggle === '2021' && (
                        <BarChart data={PopulationData["2021"]}  yAxisLabel="# of Students"/>
                    )}

                    {PopulationToggle === '2022' && (
                        <BarChart data={PopulationData["2022"]}  yAxisLabel="# of Students"/>
                    )}
                </Box>

            </Box>

        </Box>
    </Box>
    );
};


export default ProgramDetail;
