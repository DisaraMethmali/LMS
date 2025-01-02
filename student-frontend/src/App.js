import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard'; // Adjust path to match where AdminDashboard is located

const App = () => {
  return (
    <Router>
      <div className="App">
        <h1>Student System</h1>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />


        </Routes>
      </div>
    </Router>
  );
};

export default App;



