import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null); 
  const [add, setAdd] = useState(false);
  const [titlee, setTitle] = useState('');
  const [contentt, setContent] = useState('');


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleNote = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
  try {
    const title = titlee;
    const content = contentt;
    const response = await fetch('http://localhost:3000/notes/write', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });
  
    if (!response.ok) {
      console.log(err.message)
      const err = await response.json();
      throw new Error(err.message || 'Posting failed');
    }
      const newNote = await response.json();
      setNotes([...notes, newNote]);
      setTitle('');
      setContent('');
      setAdd(false);
  
  } catch (error) {
    alert(error.message);
  }};


  const deletenote = async(id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3000/notes/id/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' },
      });
    
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Posting failed');
      }
      setNotes(notes.filter(note => note.id !== id));
    
    } catch (error) {
      alert(error.message);
    }};

  useEffect(() => {
    const fetchNotes = async () => {

      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/notes', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setNotes(data);
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };

    fetchNotes();
  }, []);

  const getPreview = (content) => {
    if (content.length > 20)
      return content.slice(0, 20) + '...';
    return content

  };
  const getPreview2 = (content) => {
    if (content.length < 20)
      return content.slice(0, 20);
    return content.slice(0, 20) + '...';
  };
  return (
<div className="min-h-screen bg-gray-900 pt-32 px-6 pb-6">
<div className="bg-gray-900 bg-opacity-90 py-4 px-6  rounded-b-0xl flex justify-between items-center w-full fixed top-0 left-0 z-50">
<h1 className="text-3xl font-bold text-white text-center w-full">My Notes</h1>
<button
              onClick={() => setAdd(true)}
              className="absolute top-4 right-6 bg-gradient-to-r from-purple-600 to-pink-600  text-white px-5 py-2 rounded-3xl hover:bg-gray-800 shadow-lg font-bold"

              >
              ✚ New Note
            </button>
      <button
          onClick={() => {
            localStorage.removeItem('token'); 
            window.location.href = '/login';
          }}
          className="absolute top-4 left-6 bg-pink-800 text-white px-4 py-2 rounded-full hover:bg-red-900 shadow-lg font-bold"
          >
          🚪 Logout
        </button>
            </div>
          <div 
          className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 transition duration-200 ${add ? 'blur-sm' : ''}`}>
            {Array.isArray(notes) && notes.map((note) => (
          <div
          key={note.id}
          onClick={() => setSelectedNote(note)}
          className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition cursor-pointer relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              deletenote(note.id);
            }}
            className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
            title="Delete">
            🗑️
          </button>
        
          <h2 className="text-xl text-black font-semibold text-black mb-2">
            {getPreview2(note.title)} ✨
          </h2>
          <p className="text-black mb-2">{getPreview(note.content)}</p>
          <p className="text-sm text-gray-400">
            Created: {new Date(note.createdAt).toLocaleString()}
          </p>
        </div>
        ))}
      </div>

      
      {selectedNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-lg w-full shadow-lg relative max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">{selectedNote.title} ✨</h2>
            <p className="text-gray-800 whitespace-pre-wrap">{selectedNote.content}</p>
            <button
              onClick={() => setSelectedNote(null)}
              className="absolute top-2 right-2 text-black text-xl hover:text-red-500"
              >
                ✖
            </button>
          </div>
        </div>
      )}
     {add && (
  <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm relative">
      <button
        onClick={() => setAdd(false)}
        className="absolute top-2 right-2 text-black text-xl hover:text-red-500"
      >
        ✖
      </button>

      <form onSubmit={handleNote}>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Title</label>
          <input
            type="text"
            value={titlee}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 px-2 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-1">Content</label>
          <textarea
            value={contentt}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black resize-none  overflow-y-auto"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
        >
          Post
        </button>
      </form>
    </div>
  </div>
)}

 </div>
  );
};

export default Dashboard;
