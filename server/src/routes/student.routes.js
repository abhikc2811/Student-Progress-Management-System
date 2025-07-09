import express from 'express';
import { addStudent, getAllStudents, getStudentById, updateStudent, deleteStudent, toggleReminder } from '../controllers/student.controller.js';

const router = express.Router();

router.post('/', addStudent);
router.get('/', getAllStudents);
router.get('/:id', getStudentById);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);
router.patch('/:id/toggle-reminder', toggleReminder);

export default router;
