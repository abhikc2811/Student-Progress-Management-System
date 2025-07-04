import mongoose from 'mongoose';

const contestSchema = new mongoose.Schema({
  studentId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  contestId:     { type: Number, required: true },
  contestName:   { type: String },
  rank:          { type: Number },
  ratingChange:  { type: Number },
  newRating:     { type: Number },
  problemsUnsolved: { type: Number },
  date:          { type: Date }
}, { timestamps: true });

export default mongoose.model('Contest', contestSchema);
