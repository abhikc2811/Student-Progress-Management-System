import express from 'express';
import { codeforcesSync, testReminder, getDashboardStats, getSettings, updateSettings } from '../controllers/admin.controller.js';

const router = express.Router();

router.post('/sync-codeforces', codeforcesSync);
router.post('/test-reminder', testReminder);
router.get('/dashboard-stats', getDashboardStats)
router.get('/settings', getSettings);
router.post('/settings', updateSettings)

export default router;