import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'Dmax' && password === 'Dmax12345') {
      setIsLoggedIn(true);
      navigate('/dashboard');  // Navigate to dashboard after login
    } else {
      setError('Error: Invalid credentials');
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm text-center text-white bg-opacity-90">
        <h2 className="text-3xl font-semibold mb-4">LOGIN</h2>
        <p className="mb-6 text-gray-400">Please enter your login and password!</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-transparent border border-blue-500 rounded-full text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Username"
            />
            <label
              htmlFor="username"
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-all duration-300 ${
                username && 'top-1/4 text-sm'
              }`}
            >
              Username
            </label>
          </div>

          <div className="relative">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-transparent border border-blue-500 rounded-full text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
            />
            <label
              htmlFor="password"
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-all duration-300 ${
                password && 'top-1/4 text-sm'
              }`}
            >
              Password
            </label>
          </div>

          {error && <p className="text-red-500 text-sm italic mb-2">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-orange-600 hover:bg-orange-700 transition duration-300"
          >
            Login
          </button>
        </form>

        <a href="#" className="text-sm text-gray-400 mt-4 inline-block hover:text-blue-500">
          Forgot password?
        </a>
      </div>
    </div>
  );
};

export default LoginPage;
