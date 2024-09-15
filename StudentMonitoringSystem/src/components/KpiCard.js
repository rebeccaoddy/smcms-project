import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

const KpiCard = ({ icon, title, subtitle, value, iconBackground }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.mode === "dark" ? "#1F2A40" : "#ffffff",
        padding: 2,
        borderRadius: 2,
        ml: 1,
        mt: 2,
        width: '100%',
        boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.16)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: 'background-color 0.3s, box-shadow 0.3s', // Smooth transition for background color and shadow
        '&:hover': {
          backgroundColor: theme.palette.primary.dark, // Darken on hover
          boxShadow: `0px 6px 12px ${theme.palette.primary.main}`, // Increase shadow on hover
          '& .MuiTypography-root': {
            color: theme.palette.common.white, // Change text color to white on hover
          },
        },
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
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {subtitle}
          </Typography>
        </Box>
      </Box>
      <Typography variant="h1" sx={{ fontWeight: "bold", marginTop: "15px" }}>
        {value}
      </Typography>
    </Box>
  );
};

export default KpiCard;
