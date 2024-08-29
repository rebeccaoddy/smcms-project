import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUsersData } from '../../../Data/DataFile';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { tokens } from '../../../theme';
import RadarChart from '../../../components/RadarChart';
import StudentKPI from './StudentKPI';
import PersonIcon from '@mui/icons-material/Person';
import LineGraph from '../../../components/LineGraph';
import BarChart from '../../../components/BarChart';


const Studentpage = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const radarData = [
    { subject: 'MAM', value: 75 },
    { subject: 'INF', value: 85 },
    { subject: 'STA', value: 63 },
    { subject: 'CS', value: 70 },
    
  ];

  const gpaData = [
    {
      "id": "GPA",
      "data": [
        { "x": "S1, Y1", "y": 3.2 },
        { "x": "S2, Y1", "y": 3.2 },
        { "x": "S1, Y2", "y": 3.2 },
        { "x": "S2, Y2", "y": 3.2 },
        { "x": "S1, Y3", "y": 3.3 },
        { "x": "S2, Y3", "y": 3.1 },
        { "x": "S1, Y4", "y": 2.8 },
        { "x": "S2, Y4", "y": 2.8 },
      ],
    },
  ];
 
  const courseMarks = [
    { label: 'CSC2001', value: 85 },
    { label: 'STA2020', value: 78 },
    { label: 'MAM1014', value: 92 },
    { label: 'CSC2002', value: 74 },
    { label: 'STA2023', value: 88 },
    { label: 'MAM1008', value: 81 },
];


  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const { users } = await getUsersData();
        const selectedStudent = users.find(user => user.id === parseInt(id));
        setStudent(selectedStudent);
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    fetchStudentData();
  }, [id]);

  if (!student) {
    return <div>Loading...</div>;
  }

  
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

      {/* New Button to Navigate to App 2 */}
      <Button
        variant="contained"
        onClick={() => {
          // Navigate to App 2 (secondary route) with student ID as a query parameter
          navigate("/cases");
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
        View in Second Application
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
        <Typography variant="h4" sx={{ mb: 0 }}>
            {student.first_name} {student.last_name}
          </Typography>
          <Typography variant="body1">Date of Birth: {student.date_of_birth}</Typography>
          <Typography variant="body1">Age: {student.entry_age}</Typography>
          <Typography variant="body1">Ethnicity: {student.ethnicity}</Typography>
          <Typography variant="body1">State: {student.hs_state}</Typography>
          <Typography variant="body1">Student ID: {student.id}</Typography>
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
        {60}
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
        <Typography variant="h1" fontSize="25px" color={colors.grey[100]} mb={1}>
        Busines Science
        </Typography>
        <Typography variant="h1" fontSize="20px" color={colors.grey[100]}>
        Computer Science
        </Typography>
        <Typography variant="h1" fontSize="15px" color={colors.grey[100]}>
        CB004CSC05
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
          Low Risk : No action required
        </Typography>

        <Box display="flex" alignItems="center" mt={2}>
        {/* Low Risk */}
        <Box
          sx={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: "green",
            marginRight: '8px',
          }}
        />
        
      </Box>

        </Box>

        <Box
        gridColumn="span 3"
        gridRow="span 2"
        backgroundColor={colors.primary[400]}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={2}
        borderRadius="10px"
        
        >
         <Box width="100%" height="150%">
        <RadarChart data={radarData} />
          </Box>
        </Box>

       <Box
        gridColumn="span 9"
        gridRow="span 1"
        backgroundColor={colors.primary[400]}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={2}
        borderRadius="10px"
        
        > <Typography variant="h6" color="textPrimary" gutterBottom>
        Student GPA Over Time
        </Typography>
        <Box width="100%" height="100%">
            <LineGraph
                data={gpaData}
                xAxisLabel="Time"
                yAxisLabel="GPA"
                yTickValues={[2.8, 2.9, 3, 3.1, 3.2, 3.3]}
            />
        </Box>
        </Box>

        <Box
        gridColumn="span 9"
        gridRow="span 1"
        backgroundColor={colors.primary[400]}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={2}
        borderRadius="10px"
        
        > 
        <BarChart
              data={courseMarks}
              yAxisLabel="Marks"
              showAverageLine={true}
              averageValue={65}
            />
        </Box>

        

       

      </Box>
    </Box>
  );
};

export default Studentpage;
