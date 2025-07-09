import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import ThemeContextProvider from './context/ThemeContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import StudentList from './pages/StudentList';
import StudentForm from './pages/StudentForm';
import StudentPage from './pages/StudentPage';
import Settings from './pages/Settings';
import DashboardLayout from './layout/DashboardLayout';
import { useAuthStore } from './store/useAuthStore';
import { useEffect } from 'react';
import { Loader } from "lucide-react";

const App = () => {
  const { admin, checkingAuth, checkAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  const RequireAuth = () => {
    return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
  };

  return (
    <ThemeContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />} />

          <Route element={<RequireAuth />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/students" element={<StudentList />} />
              <Route path="/students/new" element={<StudentForm mode="create" />} />
              <Route path="/students/:id/edit" element={<StudentForm mode="edit" />} />
              <Route path="/students/:id" element={<StudentPage />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </ThemeContextProvider>
  );
};

export default App;
