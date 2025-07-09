import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  cron: { type: String, default: '0 0 * * *' },       // stored as “M H * * *”
  inactivityDays: { type: Number, default: 7 },       // how many days before reminder
}, { timestamps: true });

export default mongoose.model('Setting', settingSchema);
