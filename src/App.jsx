import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoleSelection from './RoleSelection';
import Login from './Login';
import JudgeDashboard from './JudgeDashboard';  // Make sure this import is correct
import LawyerDashboard from './LawyerDashboard';
import AdminDashboard from './AdminDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoleSelection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/judge-dashboard" element={<JudgeDashboard />} />
        <Route path="/lawyer-dashboard" element={<LawyerDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
