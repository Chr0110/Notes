import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './Landing';
import Login from './Login';
import Signup from './Signup';
import './App.css'
import Dashboard from './Dashboard';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App