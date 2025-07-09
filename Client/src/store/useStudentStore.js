import { create } from 'zustand';
import { axiosInstance } from '../api/axios.js';
import { toast } from 'react-hot-toast';

const useStudentStore = create((set, get) => ({
  students: [],
  selectedStudent: null,
  contestHistory: [],
  problemStats: null,
  heatmapData: [],
  
  getAllStudents: async () => {
    try {
      const { data } = await axiosInstance.get('/students', { withCredentials: true });
      set({ students: data });
    } catch (err) {
      toast.error('Failed to load students');
      console.error('Error fetching students:', err);
    }
  },

  getStudentById: async (id) => {
    try {
      const { data } = await axiosInstance.get(`/students/${id}`, { withCredentials: true });
      set({ selectedStudent: data });
    } catch (err) {
      toast.error('Failed to fetch student');
      console.error('Error fetching student:', err);
    }
  },

  fetchContestHistory: async (id, days) => {
    try {
      const { data } = await axiosInstance.get(`/contests/${id}?days=${days}`, { withCredentials: true });
      set({ contestHistory: data });
    } catch (err) {
      toast.error('Failed to load contest history');
      console.error('Error fetching contest history:', err);
    }
  },

  fetchHeatmap: async (id, year) => {
    try {
      const { data } = await axiosInstance.get(`/submissions/${id}?year=${year}`, { withCredentials: true });
      const formatted = data.map(d => ({
        date: d._id,
        count: d.count
      }));
      set({ heatmapData: formatted});
    } catch (err) {
      toast.error('Failed to load heatmap data');
      console.log('Error fetching heatmap data', err);
    }
  },

  fetchProblemStats: async (id, range) => {
    try {
      const { data } = await axiosInstance.get(`/stats/${id}?range=${range}d`, { withCredentials: true });
      set({ problemStats: data });
    } catch (err) {
      set({problemStats: null});
      toast.error('Failed to load problem stats');
      console.error('Error fetching problem stats:', err);
    }
  },

  addStudent: async (studentData, onSuccess) => {
    try {
      const { data } = await axiosInstance.post('/students', studentData, { withCredentials: true });
      toast.success('Student added');
      await get().getAllStudents();
      if (onSuccess) onSuccess(data);
    } catch (err) {
      toast.error('Failed to add student');
      console.error('Error adding student:', err);
    }
  },

  updateStudent: async (id, updatedData, onSuccess) => {
    try {
      const { data } = await axiosInstance.put(`/students/${id}`, updatedData, { withCredentials: true });
      toast.success('Student updated');
      await get().getAllStudents();
      if (onSuccess) onSuccess(data);
    } catch (err) {
      toast.error('Failed to update student');
      console.error('Error updating student:', err);
    }
  },
  
  deleteStudent: async (id) => {
    try {
      await axiosInstance.delete(`/students/${id}`, { withCredentials: true });
      toast.success('Student deleted');
      await get().getAllStudents();
    } catch (err) {
      toast.error('Failed to delete student');
      console.error('Error deleting student:', err);
    }
  },

  toggleReminder: async (id) => {
    await axiosInstance.patch(`/students/${id}/toggle-reminder`);
    await get().getAllStudents(); 
  },

}));

export default useStudentStore;
