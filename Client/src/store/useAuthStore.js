import { create } from "zustand";
import { axiosInstance } from '../api/axios.js';
import { toast } from "react-hot-toast";

export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  admin: null,
  checkingAuth: false,
  loggingIn: false,

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
      toast.success("Looged out successfully");
    } catch (err) {
      toast.error("Logout failed");
    }
  }
}));
