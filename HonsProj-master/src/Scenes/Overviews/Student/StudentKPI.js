// components/GridView1.js
import React from 'react';
import { Grid, useTheme } from '@mui/material';
import KpiCard from '../../../components/KpiCard';
import ComputerIcon from '@mui/icons-material/Computer';
import PersonIcon from '@mui/icons-material/Person';
import PercentIcon from '@mui/icons-material/Percent';
import { tokens } from '../../../theme';
import { Box, Button, IconButton, Typography } from "@mui/material";

const StudentKPI = (student) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

const user = {
    firstName: 'Darwin',
    lastName: 'Nunez',
    profilePhoto: "https://b.fssta.com/uploads/application/soccer/headshots/62090.png", // Replace with actual URL
    role: 'CS Student Advisor',
    email: 'darwizzy@lfc.com',
    phone: '082 471 8891'
  };

  return (

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
        sx={{ 
            backgroundImage: `url(${user.profilePhoto})`, // Ensure the URL is wrapped in `url(...)`
            backgroundSize: 'cover', // Ensure the image covers the entire box
            backgroundPosition: 'center', // Center the image
            backgroundRepeat: 'no-repeat' // Prevent the image from repeating
        }}
        >
        </Box>


        <Box
        gridColumn="span 6"
        gridRow="span 4"
        backgroundColor={"white"}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={2}
        borderRadius="10px"
      >
        <Typography variant="h4">
        {student.first_name} {student.last_name}
        </Typography>
        <Typography variant="body1">Email: {student.email}</Typography>
        <Typography variant="body1">Phone: {student.phone}</Typography>
      </Box>
    </Box>
  );
};

export default StudentKPI;
