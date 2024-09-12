import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import {  useTheme } from "@mui/material";
import { tokens } from "../theme"


const KpiCard = ({ icon, title, subtitle, value, additionalInfo, percentage, iconBackground }) => {
    const theme = useTheme();
  const colors = tokens(theme.palette.mode);
    return (
      <Box
        sx={{
          backgroundColor: theme.palette.mode === "dark" ? "#1F2A40" : "#ffffff",
          padding: 2,
          borderRadius: 2,
          width: '100%',
          boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box display="flex" alignItems="center">
          <Box
            sx={{
              backgroundColor: iconBackground,
              borderRadius: '50%',
              padding: '8px',
            }}
          >
            {icon}
          </Box>
          <Box sx={{ ml: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {title}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {subtitle}
            </Typography>
          </Box>
        </Box>
        <Typography variant="h3" sx={{ fontWeight: "bold", marginTop: "10px" }}>
          {value}
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary", marginTop: "9px" }}>
          {additionalInfo}
        </Typography>
        <Typography variant="body2" sx={{ color: "green", fontWeight: "bold" }}>
          {percentage}
        </Typography>
      </Box>
    );
  };
  
  export default KpiCard;

