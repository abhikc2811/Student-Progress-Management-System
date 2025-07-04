import mongoose from 'mongoose';
import Contest from '../models/contest.model.js';
import ProblemStats from '../models/problemStats.model.js';
import Submission from '../models/submission.model.js';

export const fetchContestHistory = async (req, res) => {
  const days = parseInt(req.query.days) || 90;
  const from = new Date(Date.now() - days * 86400 * 1000);
    
  try {
    const contests = await Contest.find({
      studentId: req.params.studentId,
      date: { $gte: from }
    }).sort({ date: 1 });
    res.json(contests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const problemStats = async (req, res) => {
  const range = req.query.range || '30d';
  
  try {
    const stats = await ProblemStats.findOne({
      studentId: req.params.studentId,
      range
    });
    if (!stats) return res.status(404).json({ error: 'Stats not found' });
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const heatmapSubmit = async (req, res) => {
  try {
    const { studentId } = req.params;
    const year = parseInt(req.query.year); // optional query param
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ error: 'Invalid student ID' });
    }
    const matchQuery = {
      studentId: new mongoose.Types.ObjectId(studentId),
    };
    if (!isNaN(year)) {
      const start = new Date(`${year}-01-01`);
      const end = new Date(`${year + 1}-01-01`);
      matchQuery.creationTimeSeconds = {
        $gte: Math.floor(start.getTime() / 1000),
        $lt: Math.floor(end.getTime() / 1000),
      };
    }
    const dailyCounts = await Submission.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: { $toDate: { $multiply: ['$creationTimeSeconds', 1000] } }
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.json(dailyCounts);
  } catch (err) {
    console.error('Heatmap fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch submission heatmap data' });
  }
};
