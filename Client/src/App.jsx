import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ThemeContextProvider from './context/ThemeContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import StudentPage from './pages/StudentPage';
import SettingsPage from './pages/SettingsPage';
import DashboardLayout from './layout/DashboardLayout';

function App() {
  return (
    <ThemeContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />

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
