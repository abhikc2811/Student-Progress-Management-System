import mongoose from 'mongoose';

const problemStatsSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  range: {
    type: String,
    enum: ['7d', '30d', '90d'],
    required: true
  },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  totalProblemsSolved: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  averageProblemsPerDay: { type: Number, default: 0 },
  mostDifficultProblem: {
    name: { type: String },
    rating: { type: Number }
  },
  ratingDistribution: {
    type: Map,
    of: Number
  }
}, { timestamps: true });

export default mongoose.model('ProblemStats', problemStatsSchema);
