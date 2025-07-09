import { useEffect, useState } from 'react';
import { axiosInstance } from '../api/axios';
import toast from 'react-hot-toast';
import { Box, Typography, TextField, Button, useTheme, Paper } from '@mui/material';

export default function Settings() {
  const [timePicker, setTimePicker] = useState('00:00');
  const [inactivityDays, setInactivityDays] = useState('');
  const [loading, setLoading] = useState(false);

  const theme = useTheme(); 

  const cronToTime = (cron) => {
    if (!cron) return '00:00';
    const [min, hr] = cron.split(' ');
    return `${hr.padStart(2, '0')}:${min.padStart(2, '0')}`;
  };

  const timeToCron = (time) => {
    const [hr, min] = time.split(':').map(Number);
    return `${min} ${hr} * * *`;
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get('/admin/settings');
        setTimePicker(cronToTime(res.data.cron));
        setInactivityDays(res.data.inactivityDays || '');
      } catch (err) {
        console.error('Failed to load settings:', err);
        toast.error('Failed to load settings');
      }
    })();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await axiosInstance.post('/admin/settings', {
        cron: timeToCron(timePicker),
        inactivityDays: Number(inactivityDays),
      });
      toast.success('Settings updated!');
    } catch (err) {
      console.error('Update failed:', err);
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        px: 3,
        py: 4,
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        maxWidth: 700,
        mx: 'auto',
      }}
    >
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        ⚙️ Settings
      </Typography>

      {/* Sync Time Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, bgcolor: theme.palette.background.paper }}>
        <Typography variant="h6" gutterBottom>
          Daily Sync Time
        </Typography>
        <TextField
          type="time"
          value={timePicker}
          onChange={(e) => setTimePicker(e.target.value)}
          sx={{
            width: 150,
            '& input::-webkit-calendar-picker-indicator': {
              cursor: 'pointer',
              filter: theme.palette.mode === 'dark' ? 'invert(1)' : 'none',
            },
          }}
          inputProps={{
            step: 60,         
            min: '00:00',     
            max: '23:59',     
          }}
          InputLabelProps={{ shrink: true }}
        />
        <Typography variant="body2" sx={{ mt: 1, color: theme.palette.text.secondary }}>
          Choose the time each day when Codeforces data will sync.
        </Typography>
      </Paper>

      {/* Inactivity Reminder Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, bgcolor: theme.palette.background.paper }}>
        <Typography variant="h6" gutterBottom>
          Inactivity Reminder
        </Typography>
        <TextField
          type="number"
          min="1"
          value={inactivityDays}
          onChange={(e) => setInactivityDays(e.target.value)}
          placeholder="e.g. 7"
          fullWidth
        />
        <Typography variant="body2" sx={{ mt: 1, color: theme.palette.text.secondary }}>
          Send reminder if a student hasn’t submitted in the last X days.
        </Typography>
      </Paper>

      <Box textAlign="right">
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? 'Saving...' : '💾 Save Changes'}
        </Button>
      </Box>
    </Box>
  );
}
