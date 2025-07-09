import { create } from "zustand";
import { axiosInstance } from '../api/axios.js';
import { toast } from "react-hot-toast";

export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  admin: null,
  checkingAuth: false,
  loggingIn: false,

  stats: {
    totalStudents: 0,
    avgRating: null,
    inactiveCount: 0,
    lastSync: null,
    solvedToday: 0,
    problemsPerDay: [],
    activePie: [],
    recentLogs: []
  },

  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const { data } = await axiosInstance.get("/auth/check-auth", { withCredentials: true });
      set({ isAuthenticated: true, admin: data.admin });
    } catch {
      set({ isAuthenticated: false, admin: null });
    } finally {
      set({ checkingAuth: false });
    }
  },

  login: async (credentials) => {
    set({ loggingIn: true });
    try {
      await axiosInstance.post("/auth/login", credentials, { withCredentials: true });
      set({ isAuthenticated: true });
      toast.success("Login successful");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      set({ loggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout", {}, { withCredentials: true });
      set({ isAuthenticated: false, admin: null });
      toast.success("Logged out successfully");
    } catch (err) {
      toast.error("Logout failed");
    }
  },

  getDashboardStats: async () => {
    try {
      const res = await axiosInstance.get('/admin/dashboard-stats', { withCredentials: true });
      set({ stats: res.data });
    } catch (err) {
      console.error('Failed to load dashboard stats', err);
      toast.error("Could not load dashboard data");
    }
  }, 

  manualSync: async () => {
    try {
      await axiosInstance.post('/admin/sync-codeforces', {}, { withCredentials: true });
      toast.success('Manual sync complete');
    } catch (err) {
      console.error('Sync failed:', err);
      toast.error('Manual sync failed');
    }
  },

  sendReminder: async () => {
    try {
      await axiosInstance.post('/admin/test-reminder', {}, { withCredentials: true });
      toast.success('Reminders sent');
    } catch (err) {
      console.error('Reminder failed:', err);
      toast.error('Sending reminders failed');
    }
  }
}));
