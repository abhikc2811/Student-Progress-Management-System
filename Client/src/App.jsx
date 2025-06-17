import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard'; 
import ThemeContextProvider from './context/ThemeContext';
import Navbar from './components/Navbar';

function App() {
  return (
    <ThemeContextProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </ThemeContextProvider>
  );
}

export default App;
