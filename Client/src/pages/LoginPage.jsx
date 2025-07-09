import { useState } from 'react';
import Topbar from '../components/Topbar';
import illustration from '../assets/admin-illustration.png';
import { useAuthStore } from '../store/useAuthStore';
import { useTheme } from '@mui/material/styles';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { login, loggingIn } = useAuthStore();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({ username, password });
  };

  // SOFT COLOR PALETTE
  const formBg = isDark ? 'bg-[#28293e]' : 'bg-gray-50';
  const textColor = isDark ? 'text-[#e6e6f1]' : 'text-gray-800';
  const subTextColor = isDark ? 'text-[#a0a0bb]' : 'text-gray-500';
  const borderColor = isDark ? 'border-white' : 'border-gray-300';
  const inputBg = isDark ? 'bg-[#32344a]' : 'bg-white';
  const placeholderColor = isDark ? 'placeholder-white' : 'placeholder-gray-500';
  const leftBg = isDark ? 'bg-purple-800' : 'bg-white';

  return (
    <>
      <Topbar />

      <div className="flex md:flex-row h-[calc(100vh-64px)] overflow-hidden">
        {/* Left Illustration */}
        <div className={`hidden md:flex w-1/2 h-full items-center justify-center ${leftBg}`}>
          <img
            src={illustration}
            alt="Admin Login Illustration"
            className="w-3/4 h-auto object-contain"
          />
        </div>

        {/* Right – Login Form */}
        <div className={`w-full md:w-1/2 flex items-center justify-center ${formBg} p-6`}>
          <div className="w-full max-w-md">
            <h2 className={`text-3xl font-semibold mb-6 border-b-2 border-purple-500 w-fit ${textColor}`}>
              Login as Admin
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className={`w-full py-3 px-12 ${inputBg} ${placeholderColor} border ${borderColor} rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 ${textColor}`}
                  required
                />
                <span className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-xl ${subTextColor}`}>
                  <i className="fas fa-user"></i>
                </span>
              </div>

              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full py-3 px-12 ${inputBg} ${placeholderColor} border ${borderColor} rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 ${textColor}`}
                  required
                />
                <span className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-xl ${subTextColor}`}>
                  <i className="fas fa-lock"></i>
                </span>
              </div>

              <button
                type="submit"
                disabled={loggingIn}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-full transition duration-300 disabled:opacity-50"
              >
                {loggingIn ? 'Logging in...' : 'LOGIN'}
              </button>
            </form>

            <div className={`text-sm mt-6 space-y-1 ${subTextColor}`}>
              <p>
                <a href="#" className="hover:underline">
                  Forgot your password?
                </a>
              </p>
              <p>
                <a href="#" className="text-purple-500 hover:underline">
                  Get help signing in
                </a>
              </p>
            </div>

            <div className={`text-xs mt-6 ${subTextColor}`}>
              <p>Terms of use. Privacy policy</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
