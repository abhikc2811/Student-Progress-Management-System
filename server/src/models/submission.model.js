import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  studentId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  problemId:    { type: String },
  contestId:    { type: Number },
  index:        { type: String },
  name:         { type: String },
  rating:       { type: Number },
  verdict:      { type: String },
  creationTimeSeconds: { type: Number, required: true }
}, { timestamps: true });

submissionSchema.index({ studentId: 1, problemId: 1 }, { unique: true });

export default mongoose.model('Submission', submissionSchema);
