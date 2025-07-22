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
import { runCodeforcesSync } from './cron/syncCodeforces.js';
import { inactivityReminders } from './cron/inactivityReminder.js';
import Setting from './models/setting.model.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors({
    origin: 'https://student-progress-management-system-murex.vercel.app',
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/', datasyncRoutes);
app.use('/api/admin/', adminRoutes);

const startServer = async () => {
  try {
    await connectDB();
    const settings = await Setting.findOne();
    const schedule = settings?.cron || '0 2 * * *'; 
    const inactivityTime = settings?.inactivityDays || 7;

    console.log(`✅ Using cron schedule: ${schedule}`);
    console.log(`📨 Inactivity reminders will trigger after ${inactivityTime} days`);

    cron.schedule(schedule, () => {
      console.log(`🔄 Running scheduled Codeforces sync at: ${new Date().toLocaleString()}`);
      runCodeforcesSync().catch(err =>
        console.error('Scheduled sync error:', err)
      );
    });

    cron.schedule('0 9 * * *', () => {
      console.log(`🔔 Running inactivity detection at: ${new Date().toLocaleString()}`);
      inactivityReminders();
    });

    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
