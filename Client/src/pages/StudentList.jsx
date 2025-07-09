import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CSVLink } from 'react-csv';
import { useTheme } from '@mui/material/styles';
import StudentRow from '../components/StudentRow.jsx';
import useStudentStore from '../store/useStudentStore.js';

const StudentList = () => {
  const students = useStudentStore(state => state.students);
  const getAllStudents = useStudentStore(state => state.getAllStudents);
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  useEffect(() => {
    getAllStudents();
  }, [getAllStudents]);

  const handleAdd = () => navigate('/students/new');

  const headers = [
    { label: 'Name', key: 'name' },
    { label: 'Email', key: 'email' },
    { label: 'Phone', key: 'phone' },
    { label: 'CF Handle', key: 'codeforcesHandle' },
    { label: 'Current Rating', key: 'currentRating' },
    { label: 'Max Rating', key: 'maxRating' }
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Students
        </h1>
        <div className="space-x-2">
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Student
          </button>
          <CSVLink
            data={students}
            headers={headers}
            filename="students.csv"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Download CSV
          </CSVLink>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table
          className={`min-w-full shadow-md rounded-lg overflow-hidden border ${
            isDark ? 'border-gray-600' : 'border-gray-200'
          }`}
          style={{
            backgroundColor: isDark
              ? theme.palette.background.paper
              : theme.palette.background.default,
            color: theme.palette.text.primary
          }}
        >
          <thead
            className={`${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}
            style={{ color: isDark ? '#fff' : '#000' }}
          >
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">CF Handle</th>
              <th className="px-4 py-2 text-right">Current Rating</th>
              <th className="px-4 py-2 text-right">Max Rating</th>
              <th className="px-4 py-2 text-center">Reminders</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <StudentRow
                key={student._id}
                student={student}
                isDark={isDark}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentList;
