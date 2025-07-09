import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '@mui/material';
import useStudentStore from '../store/useStudentStore.js';

const StudentForm = ({ mode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addStudent, updateStudent, getAllStudents } = useStudentStore();
  const theme = useTheme();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    codeforcesHandle: ''
  });

  useEffect(() => {
    if (mode === 'edit' && id) {
      const load = async () => {
        const student = await getAllStudents().then(() =>
          useStudentStore.getState().students.find(s => s._id === id)
        );
        setForm({
          name: student.name,
          email: student.email,
          phone: student.phone,
          codeforcesHandle: student.codeforcesHandle
        });
      };
      load();
    }
  }, [mode, id, getAllStudents]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    if (mode === 'create') await addStudent(form, () => navigate('/students'));
    else await updateStudent(id, form, navigate('/students'));
  };

  // Define colors based on theme mode
  const inputTextColor = theme.palette.mode === 'dark' ? '#fff' : '#000';
  const placeholderColor = theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)';
  const borderColor = theme.palette.mode === 'dark' ? '#555' : '#ccc';
  const backgroundColor = theme.palette.mode === 'dark' ? '#333' : '#fff';

  return (
    <div className="p-4 max-w-md mx-auto bg-transparent">
      <h1 className="text-2xl font-bold mb-4">
        {mode === 'create' ? 'Add Student' : 'Edit Student'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['name', 'email', 'phone', 'codeforcesHandle'].map(field => (
          <div key={field}>
            <label
              htmlFor={field}
              className="block text-md font-medium"
              style={{ color: inputTextColor }}
            >
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type="text"
              id={field}
              name={field}
              value={form[field]}
              onChange={handleChange}
              placeholder={`Enter ${field}`}
              required
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                borderRadius: 6,
                border: `1px solid ${borderColor}`,
                backgroundColor,
                color: inputTextColor,
                // placeholder styles using ::placeholder pseudo-element workaround:
                // We need to inject a style tag or use CSS classes for placeholder, so here is a simple trick:
              }}
              className="placeholder-opacity-100"
              // To set placeholder color inline, we need a small hack below
            />
            <style>
              {`
                #${field}::placeholder {
                  color: ${placeholderColor};
                  opacity: 1;
                }
              `}
            </style>
          </div>
        ))}
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200"
        >
          {mode === 'create' ? 'Create Student' : 'Update Student'}
        </button>
      </form>
    </div>
  );
};

export default StudentForm;
