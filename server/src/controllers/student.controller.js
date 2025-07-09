import Student from '../models/student.model.js';
import { runCodeforcesSync } from '../cron/syncCodeforces.js';

export const addStudent = async (req, res) => {
  try {
    const student = await Student.create(req.body);
    if (student.codeforcesHandle) {
      await runCodeforcesSync(student._id);
    }
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (req.body.codeforcesHandle) {
      await runCodeforcesSync(student._id);
    }
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const toggleReminder = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    student.emailReminderEnabled = !student.emailReminderEnabled;
    await student.save();

    res.json({ message: 'Reminder status updated', updated: student.emailReminderEnabled });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
