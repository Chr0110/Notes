import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import lnote from './lnote.png'
const Signup = () => {
  const [username, setName] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRepassword] = useState('');
  const [backto, setBackto] = useState(0);
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

  const handelSignup = async (e) => {
    e.preventDefault();
  if (password !== repassword) {
    alert('Passwords do not match');
    return;
  }

  try {
    // console.log(username, password);
    const response = await fetch('http://localhost:3000/users/register',
      {
        method: 'POST',
        headers:{
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      // console.log(response)
      if (!response.ok)
      {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }
      setName('');
      setPassword('');
      setRepassword('');
      setBackto(1);
    } 
    catch (error) {
      console.error('Error during registration:', error.message);
      alert(`Error: ${error.message}`);
    }
  };
  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center">
      <div className="absolute top-0 left-0 w-full h-full z-0">
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
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm z-10">
        <h2 className="text-2xl font-semibold text-center text-black mb-6">Sign up</h2>
        <form onSubmit={handelSignup}>
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
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-1">Re-write password</label>
            <input
              type="password"
              value={repassword}
              onChange={(e) => setRepassword(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          <button
            onClick={() => navigate('/')}
            className="fixed top-6 right-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-2 rounded-3xl hover:bg-gray-800 shadow-lg z-50 font-bold">
              Home
            </button>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:bg-gray-800 text-white font-semibold py-2 px-8 rounded-full transition"
          >
            Sign up
              </button>
          {backto === 1 && (
        <button
          onClick={() => navigate('/login')}
          className="mt-4 w-full bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-pink-700"
        >
          ⬅️ Back to login
        </button>
      )}
        </form>
      </div>

    </div>
  );
};

export default Signup;
