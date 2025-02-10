import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Extract role from the URL query parameter
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const selectedRole = queryParams.get('role');
    setRole(selectedRole);  // Set role from URL
  }, [location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    if (!username || !password || !role) {
      setErrorMessage('All fields are required');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Successfully logged in
        console.log('Login successful', data.token);
        localStorage.setItem('token', data.token); // Store the token in localStorage or state
        navigate(`/${role}-dashboard`); // Redirect to the corresponding dashboard
      } else {
        // Failed login
        setErrorMessage(data.message || 'An error occurred');
      }
    } catch (error) {
      console.error('Error during login', error);
      setErrorMessage('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Login Page</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        {/* Submit Button with Loading State */}
        <button type="submit" disabled={loading}>
          {loading ? (
            <span>Loading...</span> // Show loading text or spinner
          ) : (
            'Login'
          )}
        </button>
      </form>

      {/* Error Message */}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default Login;
