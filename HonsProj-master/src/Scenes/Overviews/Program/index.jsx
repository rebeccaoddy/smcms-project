import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material/styles";
import Header from '../../../components/Header';
import { ButtonBase, Typography, Box} from '@mui/material';
import { getPrograms } from '../../../Data/ProgramData/ProgramData'; // Adjust the import based on your data fetching method

const Program = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    // Function to fetch programs data from API
    const fetchPrograms = async () => {
      try {
        const data = await getPrograms(); // Fetch program data
        setPrograms(data);
      } catch (error) {
        console.error('Error fetching programs:', error);
      }
    };
    fetchPrograms();
  }, []);

  return (
    <Box p={3}>
    {/* Header component with title "Program List" */}
    <Header title="Program List" />
    <Box
      display="grid"
      gridTemplateColumns="repeat(3, 1fr)" // Show 3 boxes in a row
      gridAutoRows="190px"
      gap="10px"
      p={1}
      mt={0}
    >
      {programs.map(program => (
        <ButtonBase
          key={program.ProgramCode}
          component={Link} // Use Link from react-router-dom
          to={{
            pathname: `/program/${program.ProgramCode}`,
            state: { program } // Pass the program data as state
          }}
        >
          <Box
            backgroundColor={colors.primary[400]}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            p={2}
            borderRadius="10px"
            height="100%" // Set a fixed height for the Box
            width="100%" // Set width to 100% of the column
            sx={{
              transition: 'background-color 0.3s', // Smooth transition for hover
              '&:hover': {
                backgroundColor: theme.palette.primary.dark, // Darken on hover
                '& .MuiTypography-root': {
                  color: theme.palette.common.white, // Change text color to white on hover
                },
              },
            }}
          >
            {/* Display program code on boxes */}
            <Typography 
              variant="h2" 
              fontWeight="bold" 
              color={theme.palette.common.black}
            >
              {program.ProgramCode}
            </Typography>
          </Box>
        </ButtonBase>
      ))}
    </Box>
  </Box>
);
};

export default Program;
