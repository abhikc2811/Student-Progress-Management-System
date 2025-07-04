import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import cron from 'node-cron';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import studentRoutes from './routes/student.routes.js';
import datasyncRoutes from './routes/datasync.route.js';
import { runCodeforcesSync } from './cron/syncCodeforces.js';
import { inactivityReminders } from './cron/inactivityReminder.js';
import sendEmail from './utils/sendEmail.js'


dotenv.config();

const app = express();
const PORT = process.env.PORT;

const schedule = process.env.SYNC_CRON_SCHEDULE || '0 2 * * *';

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/', datasyncRoutes);

app.post('/api/admin/sync-codeforces', async (req, res) => {
  try {
    await runCodeforcesSync();
    return res.json({ message: 'Codeforces sync started' });
  } catch (err) {
    console.error('Manual sync error:', err);
    return res.status(500).json({ error: 'Sync failed' });
  }
});

app.post('/api/admin/test-reminder', async (req, res) => {
  try {
    await inactivityReminders();
    res.json({ message: 'Inactivity reminders sent to inactive students' });
  } catch (err) {
    console.error('Test reminder error:', err);
    res.status(500).json({ error: 'Failed to send test reminders' });
  }
});

cron.schedule(schedule, () => {
  console.log(`🔄 Running scheduled Codeforces sync at: ${schedule}`);
  runCodeforcesSync().catch(err =>
    console.error('Scheduled sync error:', err)
  );
});

cron.schedule('0 9 * * *', () => {
  console.log('🔔 Running inactivity detection');
  inactivityReminders();
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    connectDB();
});