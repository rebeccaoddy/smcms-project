import React from 'react';
import { Grid, useTheme } from '@mui/material';
import KpiCard from '../../../../components/KpiCard';
import ComputerIcon from '@mui/icons-material/Computer';
import PersonIcon from '@mui/icons-material/Person';
import PercentIcon from '@mui/icons-material/Percent';
import { tokens } from '../../../../theme';

const MAMKPI = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Grid container spacing={2} sx={{ width: '100%' }}>
      <Grid item xs={6}>
        <KpiCard
          icon={<ComputerIcon sx={{ fontSize: '40px' }} />}
          title="Mathematics"
          subtitle="Course"
          value=""
          additionalInfo=""
          percentage=""
          iconBackground={colors.primary[400]}
          sx={{ height: '100%' }}
        />
      </Grid>
      <Grid item xs={6}></Grid>
      <Grid item xs={4}>
        <KpiCard
          icon={<PersonIcon sx={{ fontSize: '25px' }} />}
          title="Students"
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
          icon={<PercentIcon sx={{ fontSize: '25px' }} />}
          title="Avg Grades"
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
          icon={<PersonIcon sx={{ fontSize: '25px' }} />}
          title="Student Cases"
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

export default MAMKPI;
