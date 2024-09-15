import React from 'react';
import { Typography, Box } from '@mui/material';
import { BiotechOutlined } from '@mui/icons-material'; // Import the atom icon

const ProgramOverviewHeader = () => {
  return (
    <Box mb={1} display="flex" alignItems="center">
      <BiotechOutlined 
        sx={{ fontSize: '4rem', marginRight: '10px', mb: 2 }} // Set icon size and margin
      />
      <Box>
        <Typography 
          variant="h1" 
          component="h2" 
          fontWeight="bold" 
          fontSize="3rem"   // Set the desired font size for the title
          gutterBottom
        >
          Science Faculty
        </Typography>
        
      </Box>
    </Box>
  );
};

export default ProgramOverviewHeader;
