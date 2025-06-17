import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import illustration from '../assets/admin-illustration.avif'; // update the path if needed

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (email === 'admin@example.com' && password === 'admin123') {
      localStorage.setItem('adminLoggedIn', 'true');
      navigate('/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Left - Illustration */}
      <div className="w-1/2 bg-white flex items-center justify-center p-8">
        <img
          src={illustration}
          alt="Login Illustration"
          className="w-full max-w-[500px] h-auto object-contain"
        />
      </div>

      {/* Vertical Separator */}
      <div className="w-[1px] bg-gray-300 h-[80%] self-center"></div>

      {/* Right - Login Form */}
      <div className="w-1/2 flex flex-col justify-center items-center px-6 md:px-16 bg-gray-50">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-semibold text-gray-800 mb-8 border-b-2 border-purple-500 w-fit">
            Login as a Admin User
          </h2>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="johndoe@xyz.com"
                className="w-full py-3 px-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
                <i className="fas fa-user"></i>
              </span>
            </div>

            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full py-3 px-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
                <i className="fas fa-lock"></i>
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-full transition duration-300"
            >
              LOGIN
            </button>
          </form>

          <div className="text-sm text-gray-500 mt-6 space-y-1">
            <p>
              <a href="#" className="hover:underline">Forget your password?</a>
            </p>
            <p>
              <a href="#" className="text-purple-600 hover:underline">Get help Signed in.</a>
            </p>
          </div>

          <div className="text-xs text-gray-400 mt-6">
            <p>Terms of use. Privacy policy</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
