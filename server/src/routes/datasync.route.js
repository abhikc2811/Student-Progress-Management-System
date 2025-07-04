import express from 'express';
import { fetchContestHistory, problemStats, heatmapSubmit } from '../controllers/datasync.controller.js';

const router = express.Router();

router.get('/contests/:studentId', fetchContestHistory);
router.get('/stats/:studentId', problemStats);
router.get('/submissions/:studentId', heatmapSubmit);

export default router;