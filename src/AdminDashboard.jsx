import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import UserManagement from "./components/UserManagement";
import CaseManagement from "./components/CaseManagement";
import CourtSessions from "./components/CourtSessions";
import ReportsDashboard from "./components/ReportsDashboard";
import Documents from "./components/Documents";
import Notifications from "./components/Notifications";
import AdminProfile from "./components/AdminProfile";

const AdminDashboard = () => {
  const navigate = useNavigate(); // ✅ Initialize useNavigate

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <nav>
        <ul>
          <li><Link to="/admin-dashboard/users">User Management</Link></li>
          <li><Link to="/admin-dashboard/cases">Case Management</Link></li>
          <li><Link to="/admin-dashboard/sessions">Court Sessions</Link></li>
          <li><Link to="/admin-dashboard/reports">Reports</Link></li>
          <li><Link to="/admin-dashboard/documents">Documents</Link></li>
          <li><Link to="/admin-dashboard/notifications">Notifications</Link></li>
          <li><Link to="/admin-dashboard/profile">Admin Profile</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="users" element={<UserManagement />} />
        <Route path="cases" element={<CaseManagement />} />
        <Route path="sessions/*" element={<CourtSessions />} >
          <Route path="cases" element={<CaseManagement />} />
        </Route>
        <Route path="reports" element={<ReportsDashboard />} />
        <Route path="documents" element={<Documents />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile" element={<AdminProfile />} />
      </Routes>
    </div>
  );
};

export default AdminDashboard;
