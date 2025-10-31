// src/components/FlyingNotesBackground.jsx
import React, { useMemo } from 'react';
import bgImage from './lnote.png'; // Adjust path if needed

const FlyingNotesBackground = ({ count = 30 }) => {
  const flyingNotes = useMemo(() => {
    return [...Array(count)].map((_, index) => ({
      key: index,
      delay: Math.random() * 2,
      duration: Math.random() * 20 + 10,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 50 + 30, // Adjust size range here
    }));
  }, [count]);

  return (
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
  );
};

export default FlyingNotesBackground;
