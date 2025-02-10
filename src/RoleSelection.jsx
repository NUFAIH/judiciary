import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RoleSelection = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('');

  const handleRoleSelection = (role) => {
    setSelectedRole(role);  // Set the role when selected
    // Navigate to the login page with the selected role passed as a URL parameter
    navigate(`/login?role=${role}`);
  };

  return (
    <div>
      <h2>Select Your Role</h2>
      <ul>
        <li onClick={() => handleRoleSelection('lawyer')}>Lawyer</li>
        <li onClick={() => handleRoleSelection('judge')}>Judge</li>
        <li onClick={() => handleRoleSelection('admin')}>Admin</li>
      </ul>
    </div>
  );
};

export default RoleSelection;
