import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  codeforcesHandle: { type: String, required: true, unique: true },
  currentRating: { type: Number, default: 0 },
  maxRating: { type: Number, default: 0 },
  lastSynced: { type: Date },
  emailRemindersSent: { type: Number, default: 0 },
  emailReminderEnabled: { type: Boolean, default: true },
  lastSubmissionDate: { type: Date,  default: null }
}, { timestamps: true });

export default mongoose.model('Student', studentSchema);
