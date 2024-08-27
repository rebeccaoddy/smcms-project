// KpiCards.js
import React from 'react';
import Grid from '@mui/material/Grid';
import KpiCard from '../../../components/KpiCard'; // Adjust the import according to your project structure
import ComputerIcon from '@mui/icons-material/Computer';
import PersonIcon from '@mui/icons-material/Person';
import PercentIcon from '@mui/icons-material/Percent';
import { Box, Button, useTheme, Typography} from "@mui/material";
import { tokens } from "../../../theme";

const KpiRender = ({ selectedProgram }) => {

    const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const renderKpiCards = () => {
    switch (selectedProgram) {
      case 'Computer Science':
        return (
          <>
            <Grid item xs={6}>
              <KpiCard
                icon={<ComputerIcon sx={{ fontSize: '40px' }} />}
                title="Computer Science"
                subtitle="Course"
                value=""
                additionalInfo=""
                percentage=""
                iconBackground={colors.primary[400]}
                sx={{ height: '100%' }}
              />
            </Grid>
            <Grid item xs={6}>
              <KpiCard
                icon={<PersonIcon sx={{ fontSize: '40px' }} />}
                title="Students"
                subtitle=""
                value="285"
                additionalInfo={<><PersonIcon sx={{ verticalAlign: "middle", marginRight: "4px" }} /> 33 more Students</>}
                percentage="+5.2%"
                iconBackground={colors.primary[400]}
                sx={{ height: '100%' }}
              />
            </Grid>
            <Grid item xs={6}>
              <KpiCard
                icon={<PercentIcon sx={{ fontSize: '40px' }} />}
                title="Avg Grades"
                subtitle=""
                value="73.2%"
                additionalInfo={<><PercentIcon sx={{ verticalAlign: "middle", marginRight: "4px" }} /> Higher than usual</>}
                percentage="+3.8%"
                iconBackground={colors.primary[400]}
                sx={{ height: '100%' }}
              />
            </Grid>
            <Grid item xs={6}>
              <KpiCard
                icon={<PersonIcon sx={{ fontSize: '40px' }} />}
                title="Student Cases"
                subtitle=""
                value="27"
                additionalInfo={<><PersonIcon sx={{ verticalAlign: "middle", marginRight: "4px" }} /> 4 more cases</>}
                percentage="+14.8%"
                iconBackground={colors.primary[400]}
                sx={{ height: '100%' }}
              />
            </Grid>
          </>
        );
      case 'Mathematics':
        return (
          <>
            <Grid item xs={6}>
              <KpiCard
                icon={<ComputerIcon sx={{ fontSize: '40px' }} />}
                title="Computer Science"
                subtitle="Course"
                value=""
                additionalInfo=""
                percentage=""
                iconBackground={colors.primary[400]}
                sx={{ height: '100%' }}
              />
            </Grid>
            <Grid item xs={6}>
              <KpiCard
                icon={<PersonIcon sx={{ fontSize: '40px' }} />}
                title="Students"
                subtitle=""
                value="285"
                additionalInfo={<><PersonIcon sx={{ verticalAlign: "middle", marginRight: "4px" }} /> 33 more Students</>}
                percentage="+5.2%"
                iconBackground={colors.primary[400]}
                sx={{ height: '100%' }}
              />
            </Grid>
            <Grid item xs={6}>
              <KpiCard
                icon={<PercentIcon sx={{ fontSize: '40px' }} />}
                title="Avg Grades"
                subtitle=""
                value="73.2%"
                additionalInfo={<><PercentIcon sx={{ verticalAlign: "middle", marginRight: "4px" }} /> Higher than usual</>}
                percentage="+3.8%"
                iconBackground={colors.primary[400]}
                sx={{ height: '100%' }}
              />
            </Grid>
            <Grid item xs={6}>
              <KpiCard
                icon={<PersonIcon sx={{ fontSize: '40px' }} />}
                title="Student Cases"
                subtitle=""
                value="27"
                additionalInfo={<><PersonIcon sx={{ verticalAlign: "middle", marginRight: "4px" }} /> 4 more cases</>}
                percentage="+14.8%"
                iconBackground={colors.primary[400]}
                sx={{ height: '100%' }}
              />
            </Grid>
          </>
        );
      case 'Physics':
        return (
          <>
            <Grid item xs={6}>
              <KpiCard
                icon={<ComputerIcon sx={{ fontSize: '40px' }} />}
                title="Computer Science"
                subtitle="Course"
                value=""
                additionalInfo=""
                percentage=""
                iconBackground={colors.primary[400]}
                sx={{ height: '100%' }}
              />
            </Grid>
            <Grid item xs={6}>
              <KpiCard
                icon={<PersonIcon sx={{ fontSize: '40px' }} />}
                title="Students"
                subtitle=""
                value="285"
                additionalInfo={<><PersonIcon sx={{ verticalAlign: "middle", marginRight: "4px" }} /> 33 more Students</>}
                percentage="+5.2%"
                iconBackground={colors.primary[400]}
                sx={{ height: '100%' }}
              />
            </Grid>
            <Grid item xs={6}>
              <KpiCard
                icon={<PercentIcon sx={{ fontSize: '40px' }} />}
                title="Avg Grades"
                subtitle=""
                value="73.2%"
                additionalInfo={<><PercentIcon sx={{ verticalAlign: "middle", marginRight: "4px" }} /> Higher than usual</>}
                percentage="+3.8%"
                iconBackground={colors.primary[400]}
                sx={{ height: '100%' }}
              />
            </Grid>
            <Grid item xs={6}>
              <KpiCard
                icon={<PersonIcon sx={{ fontSize: '40px' }} />}
                title="Student Cases"
                subtitle=""
                value="27"
                additionalInfo={<><PersonIcon sx={{ verticalAlign: "middle", marginRight: "4px" }} /> 4 more cases</>}
                percentage="+14.8%"
                iconBackground={colors.primary[400]}
                sx={{ height: '100%' }}
              />
            </Grid>
          </>
        );
      case 'Chemistry':
        return (
          <>
            <Grid item xs={6}>
              <KpiCard
                icon={<ComputerIcon sx={{ fontSize: '40px' }} />}
                title="Computer Science"
                subtitle="Course"
                value=""
                additionalInfo=""
                percentage=""
                iconBackground={colors.primary[400]}
                sx={{ height: '100%' }}
              />
            </Grid>
            <Grid item xs={6}>
              <KpiCard
                icon={<PersonIcon sx={{ fontSize: '40px' }} />}
                title="Students"
                subtitle=""
                value="285"
                additionalInfo={<><PersonIcon sx={{ verticalAlign: "middle", marginRight: "4px" }} /> 33 more Students</>}
                percentage="+5.2%"
                iconBackground={colors.primary[400]}
                sx={{ height: '100%' }}
              />
            </Grid>
            <Grid item xs={6}>
              <KpiCard
                icon={<PercentIcon sx={{ fontSize: '40px' }} />}
                title="Avg Grades"
                subtitle=""
                value="73.2%"
                additionalInfo={<><PercentIcon sx={{ verticalAlign: "middle", marginRight: "4px" }} /> Higher than usual</>}
                percentage="+3.8%"
                iconBackground={colors.primary[400]}
                sx={{ height: '100%' }}
              />
            </Grid>
            <Grid item xs={6}>
              <KpiCard
                icon={<PersonIcon sx={{ fontSize: '40px' }} />}
                title="Student Cases"
                subtitle=""
                value="27"
                additionalInfo={<><PersonIcon sx={{ verticalAlign: "middle", marginRight: "4px" }} /> 4 more cases</>}
                percentage="+14.8%"
                iconBackground={colors.primary[400]}
                sx={{ height: '100%' }}
              />
            </Grid>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Grid container spacing={2} sx={{ width: '100%' }}>
      {renderKpiCards()}
    </Grid>
  );
};

export default KpiRender;
