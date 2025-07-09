import { useNavigate } from 'react-router-dom';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import useStudentStore from '../store/useStudentStore';
import { useTheme } from '@mui/material/styles';

const StudentRow = ({ student, onRefresh }) => {
  const navigate = useNavigate();
  const { deleteStudent, toggleReminder } = useStudentStore();
  const { _id, name, email, phone, codeforcesHandle, currentRating, maxRating, emailReminderEnabled } = student;
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark' 

  const handleView = () => navigate(`/students/${_id}`);
  const handleEdit = () => navigate(`/students/${_id}/edit`);

  const handleDelete = async () => {
    if (window.confirm('Delete this student?')) {
      deleteStudent(_id);
    }
  };

  return (
    <tr className={`border-b ${isDark ? 'even:bg-neutral-800' : 'even:bg-gray-100'}`}>
      <td className="px-4 py-2">{name}</td>
      <td className="px-4 py-2">{email}</td>
      <td className="px-4 py-2">{phone}</td>
      <td className="px-4 py-2">{codeforcesHandle}</td>
      <td className="px-4 py-2 text-right">{currentRating}</td>
      <td className="px-4 py-2 text-right">{maxRating}</td>
      <td className="px-4 py-2 text-center">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={emailReminderEnabled}
            onChange={() => toggleReminder(_id)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500"></div>
          <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 transform peer-checked:translate-x-5"></div>
        </label>
      </td>
      <td className="px-4 py-2 text-center space-x-2">
        <button onClick={handleView} title="View">
          <FaEye />
        </button>
        <button onClick={handleEdit} title="Edit">
          <FaEdit />
        </button>
        <button onClick={handleDelete} title="Delete" className="text-red-600">
          <FaTrash />
        </button>
      </td>
    </tr>
  );
}

export default StudentRow;