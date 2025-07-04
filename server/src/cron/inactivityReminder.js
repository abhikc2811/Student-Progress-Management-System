import Student from '../models/student.model.js';
import sendEmail from '../utils/sendEmail.js'; 

const INACTIVITY_DAYS = parseInt(process.env.INACTIVITY_DAYS || '7');

export const inactivityReminders = async () => {
  const cutoff = new Date(Date.now() - INACTIVITY_DAYS * 24 * 60 * 60 * 1000);
  
  const inactiveStudents = await Student.find({
    lastSubmissionDate: { $lt: cutoff },
    email: { $exists: true, $ne: '' },
    emailReminderEnabled: true
  });

  for (const stu of inactiveStudents) {
    try {
      await sendEmail({
        to: stu.email,
        subject: 'Stay Active on Codeforces!',
        text: `Hi ${stu.name},\n\nWe noticed you haven't solved any problems recently. Keep practicing to improve your skills!\n\nCheers,\nTrimTime Team`
      });
      console.log(`Reminder sent to ${stu.email}`);
    } catch (err) {
      console.error(`Failed to send reminder to ${stu.email}:`, err.message);
    }
  }
};
