import React, { useEffect, useState } from 'react';
import { tokens } from "../../../theme";
import { useParams, useNavigate, Link} from 'react-router-dom';
import Header from '../../../components/Header';
import { getCourses } from '../../../Data/CourseData/CSCourseData'; 
import LineGraph from '../../../components/LineGraph';
import BarChart from '../../../components/BarChart';
import { Box, Button, IconButton, Typography, useTheme, List,Grid,ListItem, ListItemText } from "@mui/material";
import GraphToggleButton from '../../../components/GraphToggleButton';
import BoxAndWhisker from '../../../components/BoxAndWhisker';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CourseRiskKPI from './CourseRiskKPI';
import RiskLineGraph from '../../../components/RiskLineGraph';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ShowChartIcon from '@mui/icons-material/ShowChart';


// Adjust the import as needed
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


const getTopStudentsByYear = (marksData) => {
    const topStudentsByYear = {};

    Object.entries(marksData).forEach(([year, students]) => {
        // Create an array to store students with their marks
        let studentsWithMarks = students.map(student => {
            const grade = parseFloat(student.GradeCode);
            return {
                CampusID: student.CampusID,
                Grade: grade,
            };
        }).filter(student => !isNaN(student.Grade)); // Filter out students with invalid grades

        // Sort students by their grade in descending order
        studentsWithMarks.sort((a, b) => b.Grade - a.Grade);

        // Get the top 5 students for this year
        topStudentsByYear[year] = studentsWithMarks.slice(0, 3);
    });

    return topStudentsByYear;
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

const CourseDetail = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const { CourseCode } = useParams();
    const [course, setCourse] = useState(null);

    const medalColors = ['gold', 'silver', '#cd7f32']; // Colors for gold, silver, bronze


    const [selectedGrid, setSelectedGrid] = useState('2020');
    const [selectedPopGrid, setSelectedPopGrid] = useState('2020');
    const [selectedStuGraph, setSelectedStuGraph] = useState('2020');
    const [selectedPF, setSelectedPF] = useState('2020');
    const [selectedRiskView, setSelectedRiskView] = useState('2020');

    const [view, setView] = useState('kpi');

    const [selectedYear, setSelectedYear] = useState('2020');
    const yearOptions = ['2020', '2021', '2022'];
    

    const handleToggle = () => {
        setView((prevView) => (prevView === 'kpi' ? 'line' : 'kpi'));
    };

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const data = await getCourses();
                const selectedCourse = data.find(course => course.CourseCode === CourseCode);
                setCourse(selectedCourse);
            } catch (error) {
                console.error('Error fetching course details:', error);
            }
        };

        fetchCourse();
    }, [CourseCode]);

    if (!course) return <div>Loading...</div>;

    const numberOfStudents = course.NumberOfStudents || {};

    const lineGraphDataArray = [];
    Object.entries(numberOfStudents).forEach(([year, count]) => {
        lineGraphDataArray.push({
            x: year,
            y: count
        });
    });
    const lineGraphData = [{ id: "Number of Students", data: lineGraphDataArray }];

    const genderData2020 = course.Genders?.["2020"] || {};
    const genderData2021 = course.Genders?.["2021"] || {};
    const genderData2022 = course.Genders?.["2022"] || {};
    const year1GenderData = Object.entries(genderData2020).map(([gender, count]) => ({ label:gender, value:count }));
    const year2GenderData = Object.entries(genderData2021).map(([gender, count]) => ({ label:gender, value:count }));
    const year3GenderData = Object.entries(genderData2022).map(([gender, count]) => ({ label:gender, value:count }));

    const gridOptions = ['2020', '2021', '2022'];

    const populationData2020 = course.PopulationGroups?.["2020"] || {};
    const populationData2021 = course.PopulationGroups?.["2021"] || {};
    const populationData2022 = course.PopulationGroups?.["2022"] || {};

    const year1PopulationData = Object.entries(populationData2020).map(([group, count]) => ({
        label: group,
        value: count
    }));
    const year2PopulationData = Object.entries(populationData2021).map(([group, count]) => ({
        label: group,
        value: count
    }));
    const year3PopulationData = Object.entries(populationData2022).map(([group, count]) => ({
        label: group,
        value: count
    }));
    const gridPopOptions = ['2020', '2021', '2022'];

    // Course marks data
    const marksData = {
        2020: Array.isArray(course.Marks?.["2020"]) ? course.Marks["2020"] : [],
        2021: Array.isArray(course.Marks?.["2021"]) ? course.Marks["2021"] : [],
        2022: Array.isArray(course.Marks?.["2022"]) ? course.Marks["2022"] : [],
    };

    // Construct marksStats with the new structure
    const marksStats = [
        {
            Year: 2020,
            ...calculateBoxPlotStats(course.Marks["2020"], 'marks'),
        },
        {
            Year: 2021,
            ...calculateBoxPlotStats(course.Marks["2021"], 'marks'),
        },
        {
            Year: 2022,
            ...calculateBoxPlotStats(course.Marks["2022"], 'marks'),
        },
    ];
    
    const gpaData = {
        2020: Array.isArray(course.GPA?.["2020"]) ? course.GPA["2020"] : [],
        2021: Array.isArray(course.GPA?.["2021"]) ? course.GPA["2021"] : [],
        2022: Array.isArray(course.GPA?.["2022"]) ? course.GPA["2022"] : [],
    };

    // Construct gpaStats with the new structure
    const gpaStats = [
        {
            Year: 2020,
            ...calculateBoxPlotStats(course.GPA["2020"], 'gpa'),
        },
        {
            Year: 2021,
            ...calculateBoxPlotStats(course.GPA["2021"], 'gpa'),
        },
        {
            Year: 2022,
            ...calculateBoxPlotStats(course.GPA["2022"], 'gpa'),
        },
    ];
    

    const passFailStats = [
        {
            Year: 2020,
            ...calculatePassesAndFails(marksData["2020"]),
        },
        {
            Year: 2021,
            ...calculatePassesAndFails(marksData["2021"]),
        },
        {
            Year: 2022,
            ...calculatePassesAndFails(marksData["2022"]),
        },
    ];

    const StudentGraphOptions = ['2020', '2021', '2022'];
    const PFOptions = ['2020', '2021', '2022'];
    const RiskViewOptions = ['2020', '2021', '2022'];

    const topStudentsByYear = getTopStudentsByYear(course.Marks);

    const riskStats = {
        2020: course.RiskStats?.['2020'] || {},
        2021: course.RiskStats?.['2021'] || {},
        2022: course.RiskStats?.['2022'] || {},
    };
    
    
    //console.log(riskStats2020)

    
    
    return (
        <Box p={2}>
            {/*Back Button */}
            <Box p={0} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Back Button */}
        <Button
            variant="contained"
            onClick={() => navigate(-1)}
            sx={{
            backgroundColor: colors.primary[400], // Set the background color
            color: colors.grey[100], // Set the text color
            '&:hover': {
                backgroundColor: colors.primary[700], // Set the background color on hover
            },
            mb: 1, // Add margin-bottom to create space below the button
            }}
        >
            Back
        </Button>

        {/* Graph Toggle Button */}
        <GraphToggleButton 
            options={yearOptions}
            selectedOption={selectedYear}
            setSelectedOption={setSelectedYear}
            sx={{
            ml: 'auto', // This will push the button to the right if there are elements on its left
            }}
        />
        </Box>


        {/*Master Box*/}
        <Box
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            gridAutoRows="190px"
            gap="10px"
            p={1}
            mt={0}
        >
        
        
        <Box
        gridColumn="span 3"
        gridRow="span 1"
        //backgroundColor={colors.primary[400]}
        display="flex"
        flexDirection="column"
        alignItems="center" // Align items to the center horizontally
        justifyContent="center" // Align items to the center vertically
        p={2}
        borderRadius="10px"
        height="100%" // Set a fixed height for the Box
        width="100%" // Set width to 100% of the column
        ><Header title={CourseCode} subtitle={"Welcome to your course overview"} /></Box>

        <Box
            gridColumn="span 8"
            gridRow="span 1"
            backgroundColor={colors.primary[400]}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="flex-start"
            p={1}
            borderRadius="10px"
            height="100%"
            width="100%"
            overflow="hidden"
        >
            <Box
                width="100%"
                display="flex"
                justifyContent="center"
                alignItems="center"
                mb={1}
            >
                
            </Box>

            {view === 'kpi' ? (
                <Box
                    sx={{
                        flexGrow: 1,
                        width: '100%',
                        minHeight: '130px',
                        overflow: 'auto'
                    }}
                >
                    {selectedYear === '2020' && (
                        <CourseRiskKPI riskStats={riskStats[2020]} />
                    )}

                    {selectedYear === '2021' && (
                        <CourseRiskKPI riskStats={riskStats[2021]} />
                    )}

                    {selectedYear === '2022' && (
                        <CourseRiskKPI riskStats={riskStats[2022]} />
                    )}
                </Box>
            ) : (
                <Box
                    sx={{
                        flexGrow: 1,
                        height: '100%',
                        width: '100%',
                    }}
                >
                    <RiskLineGraph data={riskStats} />
                </Box>
            )}
        </Box>

        <Box
        gridColumn="span 1"
        gridRow="span 1"
        backgroundColor={colors.primary[400]}
        display="flex"
        flexDirection="column"
        alignItems="center" // Align items to the center horizontally
        justifyContent="center" // Align items to the center vertically
        p={2}
        borderRadius="10px"
        height="30%" // Set a fixed height for the Box
        width="100%" // Set width to 100% of the column
        >
            
        <Box display="flex" justifyContent="flex-end" mt={0}>
        
                <Button variant="contained" onClick={handleToggle}>
                    {view === 'kpi' ? <ShowChartIcon /> : 'KPI'}
                    
                </Button>
                </Box>
        </Box>



        {/*GPA LineGraph*/}
        <Box
        gridColumn="span 4"
        gridRow="span 1"
        backgroundColor={colors.primary[400]}
        display="flex"
        flexDirection="column"
        alignItems="center" // Align items to the center horizontally
        justifyContent="center" // Align items to the center vertically
        p={2}
        borderRadius="10px"
        height="100%" // Set a fixed height for the Box
        width="100%" // Set width to 100% of the column
        >
            
        <div style={{ width: '100%', height: '160px' }}> {/* Use a div for more control */}
        <Typography variant="h5" fontWeight="bold" mb={0}>
                    Enrollment Statistics
                </Typography>
            <LineGraph data={lineGraphData} yAxisLabel="# of Students" />
        </div>
        </Box>

        {/*Gender*/}
        <Box
        gridColumn="span 4"
        gridRow="span 1"
        backgroundColor={colors.primary[400]}
        display="flex"
        flexDirection="column"
        alignItems="stretch" // Align items to the center horizontally
        justifyContent="flex-start" // Align items to the center vertically
        p={2}
        borderRadius="10px"
        height="100%" // Set a fixed height for the Box
        width="100%" // Set width to 100% of the column
        >
        <Box display="flex"  alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h5" fontWeight="bold" mb={0}>
                    Gender Statistics
                </Typography>
                <Typography variant="h4" fontWeight="bold" mb={0}>
                {`${selectedYear}`}
                </Typography>
        
        </Box>

            {/* Bar Charts for Gender Data */}
            <Box sx={{ flexGrow: 1, width: '100%', height: "100%", minHeight: '130px' }}>
                {selectedYear === '2020' && year1GenderData.length > 0 ? (
                    <BarChart data={year1GenderData} yAxisLabel="# of Students" />
                ) : selectedYear === '2020' && (
                    <Typography>No data available for 2020</Typography>
                )}

                {selectedYear === '2021' && year2GenderData.length > 0 ? (
                    <BarChart data={year2GenderData} yAxisLabel="# of Students" />
                ) : selectedYear === '2021' && (
                    <Typography>No data available for 2021</Typography>
                )}

                {selectedYear === '2022' && year3GenderData.length > 0 ? (
                    <BarChart data={year3GenderData} yAxisLabel="# of Students" />
                ) : selectedYear === '2022' && (
                    <Typography>No data available for 2022</Typography>
                )}
            </Box>
        </Box>

        {/*Race*/}
        <Box
        gridColumn="span 4"
        gridRow="span 1"
        backgroundColor={colors.primary[400]}
        display="flex"
        flexDirection="column"
        alignItems="stretch" // Align items to the center horizontally
        justifyContent="flex-start" // Align items to the center vertically
        p={2}
        borderRadius="10px"
        height="100%" // Set a fixed height for the Box
        width="100%" // Set width to 100% of the column
        >
            <Box display="flex"  alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h5" fontWeight="bold" mb={0}>
                    Race Statistics
                </Typography>
                <Typography variant="h4" fontWeight="bold" mb={0}>
                {`${selectedYear}`}
                </Typography>
        
        
        </Box>
        {/* Bar Charts for Race Data */}
        <Box sx={{ flexGrow: 1, width: '100%', height: "100%", minHeight: '130px' }}>
            {selectedYear === '2020' && year1PopulationData.length > 0 ? (
                <BarChart data={year1PopulationData} yAxisLabel="# of Students" />
            ) : selectedYear === '2020' && (
                <Typography>No data available for 2020</Typography>
            )}

            {selectedYear === '2021' && year2PopulationData.length > 0 ? (
                <BarChart data={year2PopulationData} yAxisLabel="# of Students" />
            ) : selectedYear === '2021' && (
                <Typography>No data available for 2021</Typography>
            )}

            {selectedYear === '2022' && year3PopulationData.length > 0 ? (
                <BarChart data={year3PopulationData} yAxisLabel="# of Students" />
            ) : selectedYear === '2022' && (
                <Typography>No data available for 2022</Typography>
            )}
        </Box>

        </Box>

        {/*Marks Distribution*/}
        <Box
        gridColumn="span 4"
        gridRow="span 2"
        backgroundColor={colors.primary[400]}
        display="flex"
        flexDirection="column"
        alignItems="left" // Align items to the center horizontally
        justifyContent="center" // Align items to the center vertically
        p={2}
        borderRadius="10px"
        height="100%" // Set a fixed height for the Box
        width="100%" // Set width to 100% of the column
        >
        <Header title="Mark Distribution" />
        <div style={{ width: '100%', height: '100%'}}> {/* Use a div for more control */}
        <BoxAndWhisker boxPlotData={marksStats} />
        </div>
        </Box>

        {/*GPA Distribution*/}
        <Box
        gridColumn="span 4"
        gridRow="span 2"
        backgroundColor={colors.primary[400]}
        display="flex"
        flexDirection="column"
        alignItems="left" // Align items to the center horizontally
        justifyContent="center" // Align items to the center vertically
        p={2}
        borderRadius="10px"
        height="100%" // Set a fixed height for the Box
        width="100%" // Set width to 100% of the column
        >
        <Header title="GPA Distribution" />
        <div style={{ width: '100%', height: '100%'}}> {/* Use a div for more control */}
        <BoxAndWhisker boxPlotData={gpaStats} />
        </div>
        </Box>
        
        {/*Pass/Fail Data*/}
        <Box
        gridColumn="span 4"
        gridRow="span 1"
        backgroundColor={colors.primary[400]}
        display="flex"
        flexDirection="column"
        alignItems="center" // Align items to the center horizontally
        justifyContent="center" // Align items to the center vertically
        p={2}
        borderRadius="10px"
        height="100%" // Set a fixed height for the Box
        width="100%" // Set width to 100% of the column
        >
        <div style={{ width: '100%', height: '500px' }}> {/* Use a div for more control */}
        <Box display="flex"  alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h5" fontWeight="bold" mb={0}>
                    Pass / Fail Statistics
                </Typography>
                <Typography variant="h4" fontWeight="bold" mb={0}>
                {`${selectedYear}`}
                </Typography>
        </Box>

            <Box sx={{ height: '100%', width: '100%' }} id="numStudents">
            {yearOptions.map((year) => (
                selectedYear === year && (
                <Box key={year} mb={0} p={2} borderRadius={4} boxShadow={3} bgcolor="background.paper">
                    {passFailStats.map((stats) => (
                    stats.Year.toString() === year && (
                        <Box key={stats.Year} mb={2}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={8} container spacing={2}> {/* Grid container for Passes and Fails */}
                            <Grid item>
                                <Typography variant="h6" fontWeight="bold">
                                {`Passes: ${stats.passCount}`}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="h6" fontWeight="bold">
                                {`Fails: ${stats.failCount}`}
                                </Typography>
                            </Grid>
                            </Grid>
                            <Grid item xs={4} container justifyContent="flex-end"> {/* Grid container for Year aligned to the right */}
                            <Grid item>
                                
                            </Grid>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2} mt={1}>
                            {Object.entries(stats).map(([statusCode, count]) => (
                            !['Year', 'passCount', 'failCount', 'DPRCount'].includes(statusCode) && (
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
                )
            ))}
            </Box>
        </div>
        </Box>


        <Box
        gridColumn="span 4"
        gridRow="span 1"
        backgroundColor={colors.primary[400]}
        display="flex"
        flexDirection="column"
        alignItems="center" // Align items to the center horizontally
        justifyContent="center" // Align items to the center vertically
        p={0}
        borderRadius="10px"
        height="100%" // Set a fixed height for the Box
        width="100%" // Set width to 100% of the column
        >
           {yearOptions.map((year) => (
        selectedYear === year && (
            <Box 
                key={year} 
                p={2} 
                
                width="100%" // Ensure this inner Box fills the parent Box
                height="100%" // Ensure this inner Box fills the parent Box
                display="flex" 
                flexDirection="column"
                justifyContent="space-between"
            >
                
                <Box display="flex"  alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h5" fontWeight="bold" mb={0}>
                    Top Students
                </Typography>
                <Typography variant="h4" fontWeight="bold" mb={0}>
                {`${selectedYear}`}
                </Typography>
        </Box>

       
                    

                {/* Top 5 Students Section */}
                <Box 
                    mt={0} 
                    p={2} 
                    borderRadius={4} 
                    boxShadow={3} 
                    bgcolor="background.default"
                    flexGrow={1} // Ensure this section grows to fill the space
                    width="100%" // Ensure this section fills the width of the container
                    
                >
                    
                    
                    <Box display="flex" flexDirection="column" flexWrap="wrap" gap={1}>
                        {topStudentsByYear[year]?.slice(0, 3).map((student, index) => (
                            <Box key={student.CampusID} display="flex" alignItems="center" mx={0}>
                                <EmojiEventsIcon sx={{ color: medalColors[index], mr: 1 }} />
                                <Link 
                                    to={`/students/${student.CampusID}`} 
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                    {`${student.CampusID}: ${student.Grade} %`}
                                </Link>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>
        )
    ))}
        </Box>

      </Box>

      </Box>
    );
};

export default CourseDetail;
