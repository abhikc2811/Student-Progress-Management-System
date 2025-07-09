import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import cron from 'node-cron';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import studentRoutes from './routes/student.routes.js';
import datasyncRoutes from './routes/datasync.route.js';
import adminRoutes from './routes/admin.routes.js'


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
app.use('/api/admin/', adminRoutes);

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