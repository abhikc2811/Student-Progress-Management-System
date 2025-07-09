import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  studentId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  problemId:    { type: String },
  contestId:    { type: Number },
  index:        { type: String },
  problemName:         { type: String },
  rating:       { type: Number },
  verdict:      { type: String },
  creationTimeSeconds: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('Submission', submissionSchema);
