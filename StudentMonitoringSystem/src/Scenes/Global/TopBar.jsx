import { Box,  useTheme } from "@mui/material";
import {  tokens } from "../../theme";
import { Typography} from "@mui/material";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const imageUrl = "https://ucthpc.uct.ac.za/wp-content/uploads/2015/09/logocircless.png"
  
  return (
    <Box
      backgroundColor={colors.primary[400]} // Adjust the color as needed
      color={theme.palette.primary.contrastText} // Text color
      p={2} // Padding around the banner
      mb={1} // Margin bottom to create separation from other content
      borderRadius={0} // Rounded corners for the banner
      display="flex"
      justifyContent="center"
      alignItems="center"
      height = "60px"
      
    >
      <img 
        src={imageUrl}
        alt="Logo" 
        style={{ width: '50px', height: '50px', marginRight: '10px', marginTop: '-5px' }} 
      />    
      <Typography variant="h2" color={colors.grey[100]}>
        Student Analytic Dashboard
      </Typography>
    </Box>
    
  );
};

export default Topbar;