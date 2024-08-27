import React from 'react';
import { Grid, useTheme, Box } from '@mui/material';
import KpiCard from '../../../../components/KpiCard';
import ComputerIcon from '@mui/icons-material/Computer';
import PersonIcon from '@mui/icons-material/Person';
import PercentIcon from '@mui/icons-material/Percent';
import { tokens } from '../../../../theme';

const RiskKPI = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Grid container spacing={2} sx={{ width: '100%' }}>
      
      
      <Grid item xs={4}>
      <KpiCard
        icon={
            <Box
            sx={{
                width: '25px', // Set the width of the circle
                height: '25px', // Set the height of the circle
                borderRadius: '50%', // Make it circular
                backgroundColor: 'green', // Set the circle color
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
            />
        }
        title="No Risk Students"
        subtitle=""
        value="310"
        additionalInfo={<><PersonIcon sx={{ verticalAlign: "middle", marginRight: "4px" }} /> 33 more Students</>}
        percentage="+9.0%"
        iconBackground={colors.primary[400]}
        sx={{ height: '100%' }}
        />

      </Grid>
      <Grid item xs={4}>
      <KpiCard
        icon={
            <Box
            sx={{
                width: '25px', // Set the width of the circle
                height: '25px', // Set the height of the circle
                borderRadius: '50%', // Make it circular
                backgroundColor: 'orange', // Set the circle color
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
            />
        }
        title="Potential Risk Students"
          subtitle=""
          value="78%"
          additionalInfo={<><PercentIcon sx={{ verticalAlign: "middle", marginRight: "4px" }} /> Higher than usual</>}
          percentage="+1.8%"
          iconBackground={colors.primary[400]}
          sx={{ height: '100%' }}
        />
      </Grid>
      <Grid item xs={4}>
      <KpiCard
        icon={
            <Box
            sx={{
                width: '25px', // Set the width of the circle
                height: '25px', // Set the height of the circle
                borderRadius: '50%', // Make it circular
                backgroundColor: 'red', // Set the circle color
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
            />
        }
        title="At Risk Students"
          subtitle=""
          value="45"
          additionalInfo={<><PersonIcon sx={{ verticalAlign: "middle", marginRight: "4px" }} /> 4 more cases</>}
          percentage="+30.8%"
          iconBackground={colors.primary[400]}
          sx={{ height: '100%' }}
        />
      </Grid>
    </Grid>
  );
};

export default RiskKPI;
