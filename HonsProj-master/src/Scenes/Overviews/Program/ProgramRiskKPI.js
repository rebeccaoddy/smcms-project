import React, { useState } from 'react';
import { Grid, useTheme, Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import KpiCard from '../../../components/KpiCard';
import PersonIcon from '@mui/icons-material/Person';
import { Link } from 'react-router-dom';
import { tokens } from '../../../theme';
import { People } from '@mui/icons-material';

const ProgramRiskKPI = ({ riskStats }) => {
  // Get the current theme and color tokens
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // State to track the currently selected risk level
  const [selectedRiskLevel, setSelectedRiskLevel] = useState(null);

  // Function to handle card click and toggle the selected risk level
  const handleCardClick = (riskLevel) => {
    setSelectedRiskLevel(selectedRiskLevel === riskLevel ? null : riskLevel);
  };

  // Function to render a list of students based on the selected risk level
  const renderStudentList = (riskLevel) => (
    <Box mt={2} p={2} backgroundColor={colors.primary[400]} borderRadius="10px" maxHeight="150px" overflow="auto">
      <Typography variant="h6">Students at {riskLevel} Level:</Typography>
      <List>
        {riskStats[riskLevel]?.Students.map((student, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={
                <Link 
                  to={`/students/${student[0]}`} 
                  style={{ textDecoration: 'none', color: 'inherit' }} // Remove underline and inherit color
                >
                  {`${student[0]}: ${student[1]}`} {/* Display student details */}
                </Link>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Grid container spacing={2} sx={{ width: '100%' }}>
      {/* Grid item for Low Risk students */}
      <Grid item xs={4}>
        {selectedRiskLevel === 'Low Risk' ? (
          renderStudentList('Low Risk') // Render student list if 'Low Risk' is selected
        ) : (
          <Box 
            sx={{ 
              cursor: 'pointer', // Pointer cursor on hover
              height: '100%', // Full height
              transition: 'transform 0.3s, box-shadow 0.3s', // Smooth transition for hover effects
              '&:hover': {
                boxShadow: `0px 4px 4px ${colors.grey[400]}`, // Add shadow on hover
              }
            }}
            onClick={() => handleCardClick('Low Risk')} // Set 'Low Risk' as selected on click
          >
            <KpiCard
              icon={
                <Box
                  sx={{
                    width: '25px',
                    height: '25px',
                    borderRadius: '50%',
                    backgroundColor: 'green',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                />
              }
              title="No Risk Students"
              subtitle=""
              value={<><People sx={{ verticalAlign: "middle", marginRight: "4px" }} />{riskStats?.['Low Risk']?.Count || 0}</>}
              additionalInfo={<><PersonIcon sx={{ verticalAlign: "middle", marginRight: "4px" }} /> </>}
              percentage="+9.0%"
              iconBackground={colors.primary[400]}
              sx={{ height: '100%' }}
            />
          </Box>
        )}
      </Grid>

      {/* Grid item for Medium Risk students */}
      <Grid item xs={4}>
        {selectedRiskLevel === 'Medium Risk' ? (
          renderStudentList('Medium Risk') // Render student list if 'Medium Risk' is selected
        ) : (
          <Box 
            sx={{ 
              cursor: 'pointer', // Pointer cursor on hover
              height: '100%', // Full height
              transition: 'transform 0.3s, box-shadow 0.3s', // Smooth transition for hover effects
              '&:hover': {
                boxShadow: `0px 4px 4px ${colors.grey[400]}`, // Add shadow on hover
              }
            }}
            onClick={() => handleCardClick('Medium Risk')} // Set 'Medium Risk' as selected on click
          >
            <KpiCard
              icon={
                <Box
                  sx={{
                    width: '25px',
                    height: '25px',
                    borderRadius: '50%',
                    backgroundColor: 'orange',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                />
              }
              title="Potential Risk Students"
              subtitle=""
              value={<><People sx={{ verticalAlign: "middle", marginRight: "4px" }} />{riskStats?.['Medium Risk']?.Count || 0}</>}
              additionalInfo={<><PersonIcon sx={{ verticalAlign: "middle", marginRight: "4px" }} /></>}
              percentage="+1.8%"
              iconBackground={colors.primary[400]}
              sx={{ height: '100%' }}
            />
          </Box>
        )}
      </Grid>

      {/* Grid item for High Risk students */}
      <Grid item xs={4}>
        {selectedRiskLevel === 'High Risk' ? (
          renderStudentList('High Risk') // Render student list if 'High Risk' is selected
        ) : (
          <Box 
            sx={{ 
              cursor: 'pointer', // Pointer cursor on hover
              height: '100%', // Full height
              transition: 'transform 0.3s, box-shadow 0.3s', // Smooth transition for hover effects
              '&:hover': {
                boxShadow: `0px 4px 4px ${colors.grey[400]}`, // Add shadow on hover
              }
            }}
            onClick={() => handleCardClick('High Risk')} // Set 'High Risk' as selected on click
          >
            <KpiCard
              icon={
                <Box
                  sx={{
                    width: '25px',
                    height: '25px',
                    borderRadius: '50%',
                    backgroundColor: 'red',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                />
              }
              title="At Risk Students"
              subtitle=""
              value={<><People sx={{ verticalAlign: "middle", marginRight: "4px" }} />{riskStats?.['High Risk']?.Count || 0}</>}
              additionalInfo={<><PersonIcon sx={{ verticalAlign: "middle", marginRight: "4px" }} /></>}
              percentage="+30.8%"
              iconBackground={colors.primary[400]}
              sx={{ height: '100%' }}
            />
          </Box>
        )}
      </Grid>
    </Grid>
  );
};

export default ProgramRiskKPI;
