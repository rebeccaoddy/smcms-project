import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNewStudents } from '../../../Data/StudentDataFolder/StudentData';
import { Box, Button, Typography, Grid } from '@mui/material';
import { tokens } from '../../../theme';
import { useTheme } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import LineGraph from '../../../components/LineGraph';
import BarChart from '../../../components/BarChart';
import GraphToggleButton from '../../../components/GraphToggleButton';
import Header from '../../../components/Header';
import RadarChart from '../../../components/RadarChart';
import { Link } from "react-router-dom";


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

    const [selectedGrid, setSelectedGrid] = useState('2020');
    const gridOptions = ['2020', '2021', '2022'];

    const [selectedGrid2, setSelectedGrid2] = useState('NBT');
    const gridOptions2 = ['NBT', 'SCHOOL', 'FA'];

    const [selectedYear, setSelectedYear] = useState('2020'); // Default to 2020 or any year you prefer

    // Handler for year change
    const handleYearChange = (year) => {
        setSelectedYear(year);
    };

    useEffect(() => {
        const fetchStudents = async () => {
            const data = await getNewStudents();
            const foundStudent = data.find(student => student.CampusID === id);
            setStudent(foundStudent);
        
            if (foundStudent) {

                // HS Results Data
                const labelMapping = {
                    'EngGrd12FinRslt': 'English',
                    'MathGrd12FinRslt': 'Math',
                    'PhySciGrd12FinRslt': 'Science',
                    
                    // Add more mappings as needed
                };
                
                // HS Results Data
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
        
                // Marks Extraction
                const gradeMapping = {
                    'PA': 50,
                    'UP': 40,
                    'DPR': 10,
                    'AB': 10,
                };
        
                const year1MarksArray = [];
                const year2MarksArray = [];
                const year3MarksArray = [];
                const departmentMarks = {};
        
                Object.entries(foundStudent.Years).forEach(([year, yearData]) => {
                    const courses = yearData.Courses || [];
                    courses.forEach(course => {
                        const departmentCode = course.CourseCode.slice(0, 3);
                        const markValue = gradeMapping[course.GradeCode] !== undefined 
                            ? gradeMapping[course.GradeCode] 
                            : parseFloat(course.GradeCode) || 0;
        
                        if (!departmentMarks[departmentCode]) {
                            departmentMarks[departmentCode] = { totalMarks: 0, count: 0 };
                        }
        
                        departmentMarks[departmentCode].totalMarks += markValue;
                        departmentMarks[departmentCode].count += 1;
        
                        const markData = { label: course.CourseCode, value: markValue };
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
        
                // NBT Marks Extraction
                const nbtDataArray = [];
                const { NBTMathScore, NBTALScore, NBTQLScore } = foundStudent;
                if (NBTMathScore !== undefined) nbtDataArray.push({ label: 'NBT Math', value: parseFloat(NBTMathScore) });
                if (NBTALScore !== undefined) nbtDataArray.push({ label: 'NBT AL', value: parseFloat(NBTALScore) });
                if (NBTQLScore !== undefined) nbtDataArray.push({ label: 'NBT QL', value: parseFloat(NBTQLScore) });
                setNBTMarks(nbtDataArray);
            }
        };
        

        fetchStudents();
}, [id]);

    if (!student) return <div>Loading...</div>;

    const availableYears = [
        year1Marks?.length ? '2020' : null,
        year2Marks?.length ? '2021' : null,
        year3Marks?.length ? '2022' : null,
    ].filter(Boolean); // Remove null values
    
    return (
        <Box p={2}>
        <Button
          variant="contained"
          onClick={() => navigate(-1)}
          sx={{
            ml:1,
            backgroundColor: colors.primary[400], // Set the background color
            color: colors.grey[100], // Set the text color
            '&:hover': {
              backgroundColor: colors.primary[700], // Set the background color on hover
            },
            mb: 1 , // Add margin-bottom to create space below the button
          }}
        >
          Back
        </Button>
        <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="190px"
        gap="10px"
        p={1}
        mt={0}
      >
        

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
          height="100%" // Ensure the parent has a defined height
          width="100%"
          p={0}
          gap="10px"
        
        >
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
        <Typography variant="h2" sx={{ fontWeight: "Bold" , mb: 1 }}>
            {student.CampusID} 
          </Typography>
          
          <Typography variant="h5">Birth Date: {student.BirthDate.slice(0, 10)}</Typography>
          <Typography variant="h5">Ethnicity: {student.PopulationGrp}</Typography>
          <Typography variant="h5">Gender: {student.Gender}</Typography>
          <Button
            variant="contained"
            onClick={() => {
                navigate(`/cases?studentId=${student.CampusID}`); // Ensure correct string interpolation
                console.log("Navigating with student campusID:", student.CampusID);
            }}
            sx={{
                ml: 1,
                backgroundColor: colors.primary[400],
                color: colors.grey[100],
                '&:hover': {
                backgroundColor: colors.primary[700],
                },
                mb: 1,
            }}
            >
            View Student Cases
            </Button>
          
      </Box>
    </Box>
        </Box>

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
      
        > <Typography variant="h3" fontSize="30px" fontWeight="bold" color={colors.grey[100]} mb={1}>
        Current GPA:
        </Typography>
        <Typography variant="h1" fontSize="80px" color={colors.grey[100]}>
        {student.Years["2022"]?.CombinedGPA || student.Years["2021"]?.CombinedGPA || student.Years["2020"]?.CombinedGPA ||'N/A'}
        
        </Typography></Box>
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
          <Typography variant="h3" fontSize="30px" fontWeight="bold" color={colors.grey[100]} mb={2}>
        Program:
        </Typography>
        <Typography variant="h1" fontSize="25px" color={colors.grey[100]} mb={2}>
       {student.AcademicPlanCode}
        </Typography>
        <Typography variant="h3" fontSize="20px" fontWeight="Bold" color={colors.grey[100]} mb={1}>
        Faculty Scores: 
        </Typography>
        <Typography variant="h1" fontSize="15px" color={colors.grey[100]}>
        {student.FacultyScores}
        </Typography>
        </Box>

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
        {/* Low Risk */}
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

        <Box sx={{ flexGrow: 1, width: '100%', height: "100%", minHeight: '130px' }}>
            {selectedGrid2 === 'NBT' && year1Marks ? (
                <BarChart data={NBTMarks} yAxisLabel="NBT Scores"/>
            ) : selectedGrid2 === 'NBT' && (
                <Typography>No NBT data available</Typography>
            )}

            {selectedGrid2 === 'SCHOOL' && year2Marks ? (
                <BarChart data={hsResults} yAxisLabel="Marks"/>
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

        <Box
        gridColumn="span 3"
        gridRow="span 1"
        backgroundColor={colors.primary[400]}
        display="flex"
        flexDirection="column"
        alignItems="flex-start" // Changed to 'flex-start' to align content to the left
        justifyContent="flex-start" // Changed to 'flex-start' for better alignment
        p={2}
        borderRadius="10px"
        sx={{ height: 'auto', overflow: 'hidden' }} // Allow the height to adjust automatically
        >
           <div>
                <GraphToggleButton
                    selectedOption={selectedYear}
                    setSelectedOption={handleYearChange}
                    options={Object.keys(student.Years)} // Pass the available years to the button
                />
                {student && student.Years[selectedYear] && (
                    <Box key={selectedYear} mt={2}>
                    <Typography variant="h3" style={{ fontWeight: 'bold' }} color={colors.grey[100]}>
                        Academic Standing: {student.Years[selectedYear].AcademicStandingAction || 'N/A'}
                    </Typography>
                    <Typography variant="h6" color={colors.grey[100]} mt={1}>
                        Total Courses: {student.Years[selectedYear].TotalCourses} 
                    </Typography>
                    <Typography variant="h4" color={colors.grey[100]} mt={2}>
                       Passed: {student.Years[selectedYear].CoursesPassed}
                    </Typography>
                    </Box>
                )}
            </div>
        </Box>
        
        
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
            <GraphToggleButton 
            options={availableYears}
            selectedOption={selectedGrid}
            setSelectedOption={setSelectedGrid}
            />
        </Box>
        
        <Box sx={{ flexGrow: 1, width: '100%', height: "100%", minHeight: '130px' }}>
            {selectedGrid === '2020' && year1Marks && (
                <BarChart data={year1Marks} yAxisLabel="Marks"/>
            )}

            {selectedGrid === '2021' && year2Marks && (
                <BarChart data={year2Marks} yAxisLabel="Marks"/>
            )}

            {selectedGrid === '2022' && year3Marks && (
                <BarChart data={year3Marks} yAxisLabel="Marks"/>
            )}
        </Box>


        </Box>
        
      </Box>    
    </Box>
    );
};

export default StudentDetails;
