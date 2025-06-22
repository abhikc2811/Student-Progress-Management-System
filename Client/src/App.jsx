import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ThemeContextProvider from './context/ThemeContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import StudentPage from './pages/StudentPage';
import SettingsPage from './pages/SettingsPage';
import DashboardLayout from './layout/DashboardLayout';
import { useAuthStore } from './store/useAuthStore';
import { useEffect } from 'react';

const App = () => {
  const { checkingAuth, checkAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (checkingAuth) {
    return (
      <div className="flex justify-center items-center h-screen">
        Checking auth…
      </div>
    );
  }

  return (
    <ThemeContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />

          <Route element={<DashboardLayout />} >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/students"   element={<StudentPage />} />
            <Route path="/settings"   element={<SettingsPage />} />
          </Route>
        </Routes>
      </Router>
    </ThemeContextProvider>
  );
}

export default App;
