import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import lnote from './lnote.png'; // Adjust path if needed

const Login = () => {
  const [username, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const flyingNotes = useMemo(() => {
    return [...Array(40)].map((_, index) => ({
      key: index,
      delay: Math.random() * 1,
      duration: Math.random() * 20 + 1,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 40 + 20,
    }));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Login failed');
      }
      const token = localStorage.getItem('token');
      var pass = 0;
      if (token) {
        alert("You're already logged in. Logout first to switch accounts.");
      pass = 1;
}
    if (pass === 0)
    {
      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      navigate('/dashboard');}
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center">
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        {flyingNotes.map((note) => (
          <img
            key={note.key}
            src={lnote}
            alt="note"
            className="absolute opacity-60 animate-float"
            style={{
              animationDelay: `${note.delay}s`,
              animationDuration: `${note.duration}s`,
              left: `${note.left}%`,
              top: `${note.top}%`,
              width: `${note.size}px`,
              height: `${note.size}px`,
            }}
          />
        ))}
      </div>

      {/* Login form */}
      <div className="z-10 flex flex-col items-center space-y-4">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-semibold text-center text-black mb-6">Login</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">Name</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:bg-gray-800 text-white font-semibold py-2 px-8 rounded-full transition">
              Login
            </button>
          </form>
        </div>
        <button
          onClick={() => navigate('/signup')}
          className="text-white hover:text-pink-700 underline font-medium transition duration-150">
          Don’t have an account? Sign up
        </button>
      </div>
    </div>
  );
};

export default Login;
