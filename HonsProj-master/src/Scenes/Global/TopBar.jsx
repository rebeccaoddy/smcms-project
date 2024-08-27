import { Box, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import Header from "../../components/Header";
import { Button,  Typography} from "@mui/material";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
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

      <Box display="flex" justifyContent="flex-end"> 
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
      </Box>  
      
    </Box>
    
  );
};

export default Topbar;