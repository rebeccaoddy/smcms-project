import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNewStudents } from '../../../Data/StudentDataFolder/StudentData';
import { Box, Button,Divider, Typography, Grid } from '@mui/material';
import { tokens } from '../../../theme';
import { useTheme } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import LineGraph from '../../../components/LineGraph';
import BarChart from '../../../components/BarChart';
import GraphToggleButton from '../../../components/GraphToggleButton';
import Header from '../../../components/Header';
import RadarChart from '../../../components/RadarChart';
import { Link } from "react-router-dom";

{/*Oridnal suffix function for students year*/}
const getOrdinalSuffix = (num) => {
    if (!num) return 'N/A';
    const remainder10 = num % 10;
    const remainder100 = num % 100;
  
    if (remainder10 === 1 && remainder100 !== 11) {
      return `${num}st`;
    }
    if (remainder10 === 2 && remainder100 !== 12) {
      return `${num}nd`;
    }
    if (remainder10 === 3 && remainder100 !== 13) {
      return `${num}rd`;
    }
    return `${num}th`;
  };

{/*Function which sets colour for students risk level*/}
const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'High Risk':
        return 'red';  // Red for High Risk
      case 'Medium Risk':
        return 'orange';  // Orange for Medium Risk
      case 'Low Risk':
        return 'green';  // Green for Low Risk
      default:
        return 'grey';  // Default color if riskLevel is unknown
    }
  };

  const StudentDetails = () => {
    const { id } = useParams();
    const [student, setStudent] = useState(null);
    const [gpaData, setGpaData] = useState([]);
    const [year1Marks, setYear1Marks] = useState([]);
    const [year2Marks, setYear2Marks] = useState([]);
    const [year3Marks, setYear3Marks] = useState([]);
    const [departmentAverages, setDepartmentAverages] = useState([]);
    const [NBTMarks, setNBTMarks] = useState([]);
    const [hsResults, setHsResults] = useState([]);

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();

    const [selectedGrid2, setSelectedGrid2] = useState('NBT');
    const gridOptions2 = ['NBT', 'SCHOOL', 'FA'];

    const [selectedYear, setSelectedYear] = useState('2020');
    const yearOptions = ['2020', '2021', '2022']; 


    useEffect(() => {
        const fetchStudents = async () => {
            const data = await getNewStudents();
            const foundStudent = data.find(student => student.CampusID === id);
            setStudent(foundStudent);
        
            if (foundStudent) {

                // NBT Marks Extraction
                const nbtDataArray = [];
                const { NBTMathScore, NBTALScore, NBTQLScore } = foundStudent;
                if (NBTMathScore !== undefined) nbtDataArray.push({ label: 'NBT Math', value: parseFloat(NBTMathScore) });
                if (NBTALScore !== undefined) nbtDataArray.push({ label: 'NBT AL', value: parseFloat(NBTALScore) });
                if (NBTQLScore !== undefined) nbtDataArray.push({ label: 'NBT QL', value: parseFloat(NBTQLScore) });
                setNBTMarks(nbtDataArray);

                // HS Results Data Mappings
                const labelMapping = {
                    'EngGrd12FinRslt': 'English',
                    'MathGrd12FinRslt': 'Math',
                    'PhySciGrd12FinRslt': 'Science',
                    
                };
                
                // HS Results Data Extraction
                const hsResultsData = foundStudent.HSResults || {};
                const hsResultsArray = Object.entries(hsResultsData)
                    .filter(([key]) => key !== 'FAScholarshipScore')
                    .map(([key, value]) => ({
                        label: labelMapping[key] || key, // Use the mapped label, or fall back to the original key
                        value: parseInt(value, 10),
                    }));
                    setHsResults(hsResultsArray);
        
                // GPA Data Extraction
                const gpaDataArray = [];
                Object.entries(foundStudent.Years).forEach(([year, yearData]) => {
                    const formattedKey = `Year ${year}`;
                    gpaDataArray.push({
                        x: formattedKey,
                        y: yearData.CombinedGPA
                    });
                });
                setGpaData([{ id: "GPA", data: gpaDataArray }]);
        
                const year1MarksArray = [];
                const year2MarksArray = [];
                const year3MarksArray = [];
                const departmentMarks = {};

                Object.entries(foundStudent.Years).forEach(([year, yearData]) => {
                    const courses = yearData.Courses || [];
                    courses.forEach(course => {
                        const departmentCode = course.CourseCode.slice(0, 3);

                        // Map categorical grade values to numerical values
                        let markValue;
                        switch (course.GradeCode) {
                            case 'PA':
                                markValue = 50;
                                break;
                            case 'UP':
                            case 'DPR':
                            case 'ABS':
                                markValue = 10;
                                break;
                            default:
                                markValue = parseFloat(course.GradeCode) || 0; // Convert to number if possible, otherwise default to 0
                        }

                            // Check if the markValue is numeric and greater than 0
                            const isNumeric = !isNaN(markValue) && markValue > 0;

                            // Only aggregate valid marks for department statistics
                            if (isNumeric) {
                                if (!departmentMarks[departmentCode]) {
                                    departmentMarks[departmentCode] = { totalMarks: 0, count: 0 };
                                }

                                departmentMarks[departmentCode].totalMarks += markValue;
                                departmentMarks[departmentCode].count += 1;
                            }

                            // Add to the respective year's array
                            const markData = { label: course.CourseCode, value: course.GradeCode };
                            if (year === '2020') {
                                year1MarksArray.push(markData);
                            } else if (year === '2021') {
                                year2MarksArray.push(markData);
                            } else if (year === '2022') {
                                year3MarksArray.push(markData);
                            }

                            
                    });
                });

                // Calculate Department Averages
                const departmentAveragesArray = Object.entries(departmentMarks).map(([dept, data]) => ({
                    label: dept,
                    value: parseFloat((data.totalMarks / data.count).toFixed(2))
                }));
                setDepartmentAverages(departmentAveragesArray);
        
                if (year1MarksArray.length > 0) setYear1Marks(year1MarksArray);
                if (year2MarksArray.length > 0) setYear2Marks(year2MarksArray);
                if (year3MarksArray.length > 0) setYear3Marks(year3MarksArray);
            }
        };
        

        fetchStudents();
        }, [id]);

        if (!student) return <div>Loading...</div>;
        
        
    return (

        <Box p={2}>

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
        
        {/*Master box*/}
        <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="190px"
        gap="10px"
        p={1}
        mt={0}
        >
        
        {/*Student information card*/}
        <Box
        gridColumn="span 4"
        gridRow="span 1"
        backgroundColor={colors.primary[400]}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={2}
        borderRadius="10px"
      
        >
            <Box
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            p={0}
            gap="10px"
            >

                {/*Stores students icon*/}
                <Box
                gridColumn="span 2"
                gridRow="span 4"
                backgroundColor={"white"}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                p={2}
                borderRadius="10px"
                >
                <PersonIcon sx ={{fontSize:"80px"}}/>
                </Box>

                {/*Stores student information & student cases button link*/}
                <Box
                gridColumn="span 10"
                gridRow="span 4"
                backgroundColor={"white"}
                display="flex"
                flexDirection="column"
                p={2}
                borderRadius="10px"
                alignItems="flex-start" // Adjust the alignment here
                justifyContent="flex-start"
                >
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography variant="h2" sx={{ fontWeight: 'Bold', mb: 1 }}>
                        {student.CampusID}
                    </Typography>

                    {/*Button link to student cases page*/}
                    <Button
                        variant="contained"
                        onClick={() => {
                        navigate(`/cases?studentId=${student.CampusID}`); // Ensure correct string interpolation
                        console.log("Navigating with student campusID:", student.CampusID);
                        }}
                        sx={{mb: 2,ml:5,
                        backgroundColor: colors.primary[400],
                        color: colors.grey[100],
                        '&:hover': {
                            backgroundColor: colors.primary[700],
                        },
                        }}
                    >
                        Cases
                    </Button>


                    </Box>
                
                <Typography variant="h5">Birth Date: {student.BirthDate.slice(0, 10)}</Typography>
                <Typography variant="h5">Ethnicity: {student.PopulationGrp}</Typography>
                <Typography variant="h5">Gender: {student.Gender}</Typography>
                
                
            </Box>
        </Box>
        </Box>

        {/*Box acting as blank space*/}
        <Box
        gridColumn="span 1"
        gridRow="span 1"
        
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={2}
        borderRadius="10px"
      
        ></Box>
        
        {/*Student GPA*/}
        <Box
        gridColumn="span 2"
        gridRow="span 1"
        backgroundColor={colors.primary[400]}
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        justifyContent="flex-start"
        p={2}
        borderRadius="10px"
      
        > 
         <Typography variant="h3" fontSize="30px" fontWeight="bold" color={colors.grey[100]} mb={1}>
            GPA {selectedYear}:
        </Typography>
        <Box sx={{ flexGrow: 1, width: '100%', height: "100%", minHeight: '130px' }}>
            {selectedYear === '2020' && (
                <Typography variant="h1" fontSize="80px" color={colors.grey[100]}>
                {student.Years["2020"]?.CombinedGPA ||'N/A'}
                </Typography>
            )}

            {selectedYear === '2021' && (
                <Typography variant="h1" fontSize="80px" color={colors.grey[100]}>
                {student.Years["2021"]?.CombinedGPA ||'N/A'}
                </Typography>
            )}

            {selectedYear === '2022'  && (
                <Typography variant="h1" fontSize="80px" color={colors.grey[100]}>
                {student.Years["2022"]?.CombinedGPA ||'N/A'}
                </Typography>
            )}
        </Box>
        
       
        </Box>
        
        {/*Student program information card*/}
        <Box
        gridColumn="span 2"
        gridRow="span 1"
        backgroundColor={colors.primary[400]}
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        justifyContent="flex-start"
        p={2}
        borderRadius="10px"
        >
        <Box>

            {/* Major */}
            <Box mb={0}>
                <Typography variant="h3" fontSize="25px" fontWeight="bold" color={colors.grey[100]} mb={0}>
                Major: {student.AcademicPlanCode.slice(5, 8)}
                </Typography>
                <Typography variant="h6" fontSize="18px" color={colors.grey[100]} mb={0}>
                {student.AcademicPlanCode}
                </Typography>
            </Box>

            {/* Divider */}
            <Divider sx={{ backgroundColor: colors.grey[100], mb: 1 }} />

            {/* Admit Year */}
            <Box mb={0}>
                <Typography variant="h3" fontSize="25px" fontWeight="bold" color={colors.grey[100]} mb={1}>
                Admit Year: {student.AdmitTerm}
                </Typography>
            </Box>

            {/* Divider */}
            <Divider sx={{ backgroundColor: colors.grey[100], mb: 1}} />

            {/* Faculty Scores */}
            <Box mb={0}>
                <Typography variant="h3" fontSize="25px" fontWeight="bold" color={colors.grey[100]} mb={1}>
                Faculty Scores:
                </Typography>
                <Typography variant="h1" fontSize="15px" color={colors.grey[100]}>
                {student.FacultyScores}
                </Typography>
            </Box>

        </Box>
        </Box>
        
        {/*Risk rating*/}
        <Box
        gridColumn="span 2"
        gridRow="span 1"
        backgroundColor={colors.primary[400]}
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        justifyContent="flex-start"
        p={2}
        borderRadius="10px"
        >

            <Typography variant="h3" fontSize="30px" fontWeight="bold" color={colors.grey[100]}>
                Risk Rating:
                </Typography>

            <Typography variant="body1" color={colors.grey[100]} mt={2}>
            {student.RiskLevel}: {student.RiskPoints}
            </Typography>

            <Box display="flex" alignItems="center" mt={2}>

            {/* Risk rating circle */}
            <Box
            sx={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: getRiskColor(student.RiskLevel),
                marginRight: '8px',
            }}
            /> 
            </Box>
        </Box>

        {/*School / NBT results*/}
        <Box
        gridColumn="span 4"
        gridRow="span 1"
        backgroundColor={colors.primary[400]}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={2}
        borderRadius="10px"
        >

        <Box width="100%" height="150%">

            <Box 
                sx={{ width: '100%', textAlign: 'left', mb: -5 }} 
                display="flex" 
                justifyContent="space-between" 
                alignItems="flex-start"
            >

                <Header title="School Results" />

                <GraphToggleButton 
                options={gridOptions2}
                selectedOption={selectedGrid2}
                setSelectedOption={setSelectedGrid2}
                />

            </Box>
        </Box>
        
        {/*NBT graph displays*/}
        <Box sx={{ flexGrow: 1, width: '100%', height: "100%", minHeight: '130px' }}>
            {selectedGrid2 === 'NBT' && year1Marks ? (
                <BarChart data={NBTMarks} yAxisLabel="NBT" yScaleMin={0} // Set the Y-axis minimum to 0
                yScaleMax={100} showYTicks = {true} isMarksData = {true}/>
            ) : selectedGrid2 === 'NBT' && (
                <Typography>No NBT data available</Typography>
            )}
            {/*School results graph displays*/}
            {selectedGrid2 === 'SCHOOL' && year2Marks ? (
                <BarChart data={hsResults} yAxisLabel="Marks" yScaleMin={0} // Set the Y-axis minimum to 0
                yScaleMax={100} showYTicks = {true} isMarksData = {true}/>
            ) : selectedGrid2 === 'SCHOOL' && (
                <Typography>No data available for 2021</Typography>
            )}

            {selectedGrid2 === 'FA' && year2Marks ? (
                
                <BarChart data={[{ label: 'FA Score', value: student.HSResults?.FAScholarshipScore }]} yAxisLabel="Marks"/>
            ) : selectedGrid2 === 'FA' && (
                <Typography>No data available for 2021</Typography>
            )}
        
          </Box>
        </Box>

        {/*GPA over time graph*/}
       <Box
        gridColumn="span 5"
        gridRow="span 1"
        backgroundColor={colors.primary[400]}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={2}
        borderRadius="10px"
        > 
            <Box width="100%" height="100%">

                <Typography variant="h5" fontWeight="bold" mb={-1}>
                    GPA Over Time
                </Typography>

                <LineGraph
                    data={gpaData}
                    yAxisLabel="GPA"
                />
                
            </Box>
        </Box>
        
        {/*Academic standing information*/}
        <Box
        gridColumn="span 3"
        gridRow="span 1"
        backgroundColor={colors.primary[400]}
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        justifyContent="flex-start"
        p={2}
        borderRadius="10px"
        sx={{ height: 'auto', overflow: 'hidden' }}
        >
        
        <Box>
        {student && student.Years[selectedYear] ? (
            <Box key={selectedYear} mt={2}>

            <Box display="flex" justifyContent="space-between">
                {/* Display enroll year */}
                <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.grey[100]}
                sx={{ marginRight: 1 }}
                >
                Enroll Year: {student.Years[selectedYear].EnrolTerm || "N/A"}
                </Typography>

                <Divider
                orientation="vertical"
                flexItem
                sx={{
                    backgroundColor: colors.grey[100],
                    margin: '0 10px',
                    width: '0px',
                }}
                />

                {/* Display what year student is in */}
                <Typography variant="h4" fontWeight="bold" color={colors.grey[100]}>
                {student.Years[selectedYear].EnrolTerm && student.AdmitTerm
                    ? `${getOrdinalSuffix((student.Years[selectedYear].EnrolTerm - student.AdmitTerm) + 1)} Year`
                    : 'N/A'}
                </Typography>
            </Box>

            {/* Divider between sections */}
            <Divider style={{ backgroundColor: colors.grey[100], margin: '10px 0' }} />

            {/* Display academic standing */}
            <Typography variant="h3" fontWeight="bold" color={colors.grey[100]}>
                Academic Standing: {student.Years[selectedYear].AcademicStandingAction || 'N/A'}
            </Typography>

            {/* Divider between sections */}
            <Divider style={{ backgroundColor: colors.grey[100], margin: '10px 0' }} />

            {/* Display total courses and passed courses */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" color={colors.grey[100]} mt={0}>
                Total Courses: {student.Years[selectedYear].TotalCourses || 'N/A'}
                </Typography>
                <Typography variant="h4" color={colors.grey[100]} mt={0}>
                Passed: {student.Years[selectedYear].CoursesPassed || 'N/A'}
                </Typography>
            </Box>
            </Box>
        ) : (
            <Typography color={colors.grey[100]}>
            No data available for {selectedYear}
            </Typography>
        )}
        </Box>

        </Box>
        
        {/*Program strengths radar chart*/}
        <Box
        gridColumn="span 3"
        gridRow="span 2"
        backgroundColor={colors.primary[400]}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="space-between"
        p={2}
        borderRadius="10px"
        >

            <Header title="Program Strengths" />

                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexGrow={1}
                    mt={-9}
                    width="100%" // Ensure the chart takes up full width if possible
                >
                    <RadarChart data={departmentAverages} />
                </Box>

        </Box>

        {/*Course marks bar chart*/}
        <Box
        gridColumn="span 9"
        gridRow="span 2"
        backgroundColor={colors.primary[400]}
        display="flex"
        flexDirection="column"
        alignItems="flex-start" // Changed to 'flex-start' to align content to the left
        justifyContent="flex-start" // Changed to 'flex-start' for better alignment
        p={2}
        borderRadius="10px"
        sx={{ height: 'auto', overflow: 'hidden' }} // Allow the height to adjust automatically
        >

        <Box 
            sx={{ width: '100%', textAlign: 'left', mb: -5 }} 
            display="flex" 
            justifyContent="space-between" 
            alignItems="flex-start"
        >
            <Header title="Course Marks" />

            <Typography variant="h3" fontWeight="bold" mr={2}>
                {`${selectedYear}`}
                </Typography>
            
        </Box>
        
        {/*Displaying bar charts*/}
        <Box sx={{ flexGrow: 1, width: '100%', height: "100%", minHeight: '130px' }}>
            {selectedYear === '2020' && year1Marks.length > 0 ? (
                <BarChart data={year1Marks} yAxisLabel="Marks"  yScaleMin={0} // Set the Y-axis minimum to 0
                yScaleMax={100} showYTicks = {true} isMarksData = {true}/>
            ): selectedYear === '2020' && (
                <Typography mt={2}>No Data available for {selectedYear}</Typography>
            )}

            {selectedYear === '2021' && year2Marks.length > 0 ? (
                <BarChart data={year2Marks} yAxisLabel="Marks"  yScaleMin={0} // Set the Y-axis minimum to 0
                yScaleMax={100} showYTicks = {true} isMarksData = {true}/>
            ): selectedYear === '2021' && (
                <Typography mt={2}>No Data available for {selectedYear}</Typography>
            )}

            {selectedYear === '2022' && year3Marks.length > 0 ? (
                <BarChart data={year3Marks} yAxisLabel="Marks"  yScaleMin={0}
                yScaleMax={100} showYTicks = {true} isMarksData = {true}/>
            ): selectedYear === '2022' && (
                    <Typography mt={2}>No Data available for {selectedYear}</Typography>
                )}

        </Box>


        </Box>
        
      </Box>    
    </Box>
    );
};

export default StudentDetails;
