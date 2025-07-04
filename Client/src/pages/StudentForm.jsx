import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useStudentStore from '../store/useStudentStore.js';

const StudentForm = ({ mode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addStudent, updateStudent, getAllStudents } = useStudentStore();

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

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (mode === 'create') await addStudent(form, () => navigate('/students'));
    else await updateStudent(id, form, navigate('/students'));
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {mode === 'create' ? 'Add Student' : 'Edit Student'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['name', 'email', 'phone', 'codeforcesHandle'].map(field => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700">{field}</label>
            <input
              type="text"
              name={field}
              value={form[field]}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {mode === 'create' ? 'Create' : 'Update'}
        </button>
      </form>
    </div>
  );
};

export default StudentForm;
