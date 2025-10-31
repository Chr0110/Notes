import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImage from './lnote.png';

const Landing = () => {
  const navigate = useNavigate();

  const flyingNotes = useMemo(() => {
    return [...Array(30)].map((_, index) => ({
      key: index,
      delay: Math.random() * 2,
      duration: Math.random() * 20 + 10,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 40 + 30,
    }));
  }, []);

  const handleSignupClick = () => {
    navigate('/signup');
  };

  const handleSignInClick = () => {
    navigate('/login');
  };

  return (
    <div className="relative bg-black min-h-screen overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        {flyingNotes.map((note) => (
          <img
            key={note.key}
            src={bgImage}
            alt="floating note"
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

      <div className="flex flex-col items-center justify-center min-h-screen relative z-10">
        <h1 className="m-4 text-4xl font-extrabold bg-clip-text text-transparent bg-white">
          Capture Every{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-pink-600">
            Thought
          </span>, Anytime
        </h1>

        <div className="mb-4">
          <button
            onClick={handleSignupClick}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:bg-gray-800 text-white font-semibold py-2 px-8 rounded-full transition"
          >
            Sign up
          </button>
        </div>

        <div>
          <button
            onClick={handleSignInClick}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:bg-gray-800 text-white font-semibold py-2 px-8 rounded-full transition"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
