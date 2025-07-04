import { useNavigate } from 'react-router-dom';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import useStudentStore from '../store/useStudentStore';

const StudentRow = ({ student, onRefresh }) => {
  const navigate = useNavigate();
  const { deleteStudent } = useStudentStore();
  const { _id, name, email, phone, codeforcesHandle, currentRating, maxRating } = student;

  const handleView = () => navigate(`/students/${_id}`);
  const handleEdit = () => navigate(`/students/${_id}/edit`);

  const handleDelete = async () => {
    if (window.confirm('Delete this student?')) {
      deleteStudent(_id);
    }
  };

  return (
    <tr className="border-b even:bg-gray-50">
      <td className="px-4 py-2">{name}</td>
      <td className="px-4 py-2">{email}</td>
      <td className="px-4 py-2">{phone}</td>
      <td className="px-4 py-2">{codeforcesHandle}</td>
      <td className="px-4 py-2 text-right">{currentRating}</td>
      <td className="px-4 py-2 text-right">{maxRating}</td>
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