import { AppBar, Toolbar, Typography, Box, Button, IconButton, useTheme, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import ThemeToggleButton from './ThemeToggleButton';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  return (
    <>
      <AppBar
        position="fixed"
        color="transparent"
        elevation={0}
        sx={{
          backdropFilter: 'blur(10px)',
          backgroundColor: theme.palette.mode === 'light'
            ? 'rgba(255, 255, 255, 0.8)'
            : 'rgba(18, 18, 18, 0.7)',
          borderBottom: '1px solid',
          borderColor: theme.palette.mode === 'light' ? '#e0e0e0' : '#2e2e2e',
          transition: 'all 0.3s ease',
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ cursor: 'pointer', fontWeight: 500, fontStyle: 'italic' }}
            onClick={() => navigate('/')}
          >
            Student Progress Management System
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {!isMobile && (
              <>
                <Button
                  onClick={() => navigate('/')}
                  sx={{ fontWeight: 500 }}
                  color="inherit"
                >
                  Dashboard
                </Button>
                <Button
                  onClick={() => navigate('/students')}
                  sx={{ fontWeight: 500 }}
                  color="inherit"
                >
                  Students
                </Button>
              </>
            )}

            <ThemeToggleButton />

            {isMobile && (
              <IconButton color="inherit">
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Spacer toolbar */}
      <Toolbar />
    </>
  );
};

export default Navbar;
