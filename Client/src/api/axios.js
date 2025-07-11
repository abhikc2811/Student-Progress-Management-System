import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'https://student-progress-production.up.railway.app/api',
  withCredentials: true,
});
