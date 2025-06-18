import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles'; // To access theme colors

const navItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { label: 'Students', icon: <PeopleIcon />, path: '/students' },
  { label: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const theme = useTheme(); // Access current theme

  const handleLogout = () => {
    // Add logout logic here (clear tokens, etc.)
    navigate('/login');
  };

  return (
    <Box
      sx={{
        width: 240,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        py: 2,
      }}
    >
      {/* Top Section with Logo */}
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'center'}}>
          <ManageAccountsIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />
        </Box>

        <List>
          {navItems.map(({ label, icon, path }) => (
            <NavLink
              key={label}
              to={path}
              style={({ isActive }) => ({
                textDecoration: 'none',
                color: 'inherit',
                backgroundColor: isActive ? '#e0e0e0' : 'transparent',
              })}
            >
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText primary={label} />
                </ListItemButton>
              </ListItem>
            </NavLink>
          ))}
        </List>
      </Box>

      {/* Bottom Section */}
      <Box>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};

export default Sidebar;
