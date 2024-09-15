import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import LogoutOutlined from "@mui/icons-material/LogoutOutlined";  
import { CasesOutlined } from "@mui/icons-material";



const Item = ({ title, to, icon, selected, setSelected }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
      <MenuItem
        active={selected === title}
        style={{
          color: colors.grey[100],
        }}
        onClick={() => setSelected(title)}
        icon={icon}
      >
        <Typography>
          <Link to={to} style={{ textDecoration: 'none', color: 'inherit' }}>
            {title}
          </Link>
        </Typography>
      </MenuItem>
    );
};

const NavBar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selected, setSelected] = useState("Dashboard");

    return (
      <Box
        sx={{
          "& .pro-sidebar-inner": {
            background: `${colors.primary[400]} !important`,
          },
          "& .pro-icon-wrapper": {
            backgroundColor: "transparent !important",
          },
          "& .pro-inner-item": {
            padding: "5px 35px 5px 20px !important",
          },
          "& .pro-inner-item:hover": {
            color: "#868dfb !important",
          },
          "& .pro-menu-item.active": {
            color: "#6870fa !important",
          },
        }}
      >
        <ProSidebar collapsed={isCollapsed}>
          {/* Main Menu Area */}
          <Box flex="1"> 
            <Menu iconShape="square">
              <MenuItem
                onClick={() => setIsCollapsed(!isCollapsed)}
                icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
                style={{
                  margin: "10px 0 20px 0",
                  color: colors.grey[100],
                }}
              >
                {!isCollapsed && (
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    ml="15px"
                  >
                    <Typography variant="h3" color={colors.grey[100]}>
                      MENU
                    </Typography>
                    <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                      <MenuOutlinedIcon />
                    </IconButton>
                  </Box>
                )}
              </MenuItem>
              
              <Box paddingLeft={isCollapsed ? undefined : "10%"}>
                <Item
                  title="Science Faculty"
                  to="/faculty"
                  icon={<PeopleOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Program"
                  to="/program"
                  icon={<ReceiptOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Course"
                  to="/course"
                  icon={<SchoolOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Student"
                  to="/student"
                  icon={<PersonOutlineOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Case Management"
                  to="/cases"
                  icon={<CasesOutlined />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </Box>
            </Menu>
          </Box>

           {/* Bottom Section - Logout */}
        <Box paddingLeft={isCollapsed ? undefined : "10%"}>
          <MenuItem
            style={{
              color: colors.grey[100],
              display: 'flex',
              justifyContent: isCollapsed ? 'center' : 'start', // Center icon when collapsed
              padding: "5px 35px 5px 20px", // Same padding as other items
            }}
            icon={<LogoutOutlined />} // Standard Logout icon
            onClick={() => {
              window.location.href = "http://localhost:5173/login";
            }}
          >
            {!isCollapsed && <Typography>Logout</Typography>} {/* Show only text when not collapsed */}
          </MenuItem>
        </Box>
        </ProSidebar>
      </Box>
    );
};

export default NavBar;