import mongoose from 'mongoose';
import Student from '../models/student.model.js';
import Submission from '../models/submission.model.js';
import Setting from '../models/setting.model.js';
import { runCodeforcesSync } from '../cron/syncCodeforces.js';
import { inactivityReminders } from '../cron/inactivityReminder.js';

export const codeforcesSync = async (req, res) => {
    try {
        await runCodeforcesSync();
        return res.json({ message: 'Codeforces sync started' });
    }   catch (err) {
        console.error('Manual sync error:', err);
        return res.status(500).json({ error: 'Sync failed' });
    }
};

export const testReminder = async (req, res) => {
    try {
        await inactivityReminders();
        res.json({ message: 'Inactivity reminders sent to inactive students' });
    }   catch (err) {
        console.error('Test reminder error:', err);
        res.status(500).json({ error: 'Failed to send test reminders' });
    }
};

export const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now - 30 * 86400 * 1000);
    const todayStart = new Date(now.setHours(0,0,0,0));
    const totalStudents = await Student.countDocuments();
    const avgRatingRes = await Student.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$currentRating' } } }
    ]);
    const avgRating = avgRatingRes[0]?.avgRating || 0;

    const cutoff = new Date(Date.now() - (parseInt(process.env.INACTIVITY_DAYS) || 7) * 86400 * 1000);
    const inactiveCount = await Student.countDocuments({
      emailReminderEnabled: true,
      $or: [
        { lastSubmissionDate: { $lt: cutoff } },
        { lastSubmissionDate: null }
      ]
    });

    const lastSyncDoc = await Student.findOne({ lastSynced: { $exists: true } })
      .sort({ lastSynced: -1 })
      .select('lastSynced')
      .lean();
    const lastSync = lastSyncDoc?.lastSynced || null;

    const solvedToday = await Submission.countDocuments({
      creationTimeSeconds: {
        $gte: Math.floor(todayStart.getTime() / 1000)
      }
    });

    const perDay = await Submission.aggregate([
      { $match: { creationTimeSeconds: { $gte: Math.floor(thirtyDaysAgo.getTime()/1000) } } },
      { $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: { $toDate: { $multiply: ['$creationTimeSeconds',1000] } } }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    const activeCount = totalStudents - inactiveCount;
    const pieData = [
      { name: 'Active', value: activeCount },
      { name: 'Inactive', value: inactiveCount }
    ];

    const recentRaw = await Submission.find({})
      .sort({ creationTimeSeconds: -1 })
      .limit(10)
      .populate('studentId', 'name')
      .lean();

    const recentLogs = recentRaw.map(sub => ({
      _id: sub._id.toString(),
      message: `${sub.studentId?.name || 'Unknown'} submitted ${sub.name} - ${sub.verdict}`,
      date: new Date(sub.creationTimeSeconds * 1000)
    }));

    res.json({
      totalStudents,
      avgRating,
      inactiveCount,
      lastSync,
      solvedToday,
      problemsPerDay: perDay,
      activePie: pieData,
      recentLogs
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ error: 'Failed to load dashboard stats' });
  }
};

export const getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) settings = await Setting.create({});
    return res.json({
      cron: settings.cron,
      inactivityDays: settings.inactivityDays
    });
  } catch (err) {
    console.error('Error fetching settings:', err);
    return res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

export const updateSettings = async (req, res) => {
  const { cron, inactivityDays } = req.body;
  try {
    let settings = await Setting.findOne();
    if (!settings) settings = new Setting();
    if (typeof cron === 'string') settings.cron = cron;
    if (typeof inactivityDays === 'number') settings.inactivityDays = inactivityDays;
    await settings.save();
    return res.json({ message: 'Settings updated successfully' });
  } catch (err) {
    console.error('Error updating settings:', err);
    return res.status(500).json({ error: 'Failed to update settings' });
  }
};