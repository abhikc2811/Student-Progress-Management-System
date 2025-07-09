import { AppBar, Toolbar, Typography, Box, Button, IconButton, useTheme, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ThemeToggleButton from './ThemeToggleButton';

const Topbar = ({ onDrawerToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{
        backdropFilter: 'blur(10px)',
        backgroundColor:
          theme.palette.mode === 'light'
            ? 'rgba(249, 249, 249, 0.8)'
            : 'rgba(38, 38, 38, 0.7)',
        borderBottom: '1px solid',
        borderColor: theme.palette.mode === 'light' ? '#e0e0e0' : '#2e2e2e',
        transition: 'all 0.3s ease',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isMobile && onDrawerToggle && (
            <IconButton onClick={onDrawerToggle} color="inherit">
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            variant="h6"
            sx={{ fontWeight: 500, fontStyle: 'italic' }}
          >
            Student Progress Management System
          </Typography>
        </Box>

        <Box>
          <ThemeToggleButton />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
