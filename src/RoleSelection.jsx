import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/RoleSelection.css'; // Import the CSS file

const RoleSelection = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('');

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    navigate(`/login?role=${role}`);
  };

  return (
    <div className="role-selection-container">
      <h2 className="role-selection-title">Choose Your Role</h2>
      <p className="role-selection-subtitle">Who are you today?</p>
      <ul className="role-list">
        <li
          className="role-item lawyer"
          onClick={() => handleRoleSelection('lawyer')}
        >
          Lawyer
        </li>
        <li
          className="role-item judge"
          onClick={() => handleRoleSelection('judge')}
        >
          Judge
        </li>
        <li
          className="role-item admin"
          onClick={() => handleRoleSelection('admin')}
        >
          Admin
        </li>
      </ul>
    </div>
  );
};

export default RoleSelection;