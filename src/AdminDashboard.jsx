import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: "", password: "", role: "judge" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users on load
  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleCreateUser = async () => {
    try {
        const response = await fetch("http://localhost:5000/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser), // 🔥 Corrected
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData);
        }

        const data = await response.json();
        console.log("User added:", data);

        // Refresh users list after adding new user
        setUsers([...users, { id: data.userId, ...newUser }]);
        setNewUser({ username: "", password: "", role: "judge" }); // Reset form
    } catch (error) {
        console.error("Error creating user:", error.message);
    }
};
const handleDeleteUser = async (id, role) => {
    try {
        const response = await fetch(`http://localhost:5000/users/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role }), // ✅ Send role in the request body
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData);
        }

        setUsers(users.filter(user => user.id !== id)); // Remove user from UI
    } catch (error) {
        console.error("Error deleting user:", error.message);
    }
};





  return (
    <div>
      <h2>Admin Dashboard</h2>

      {/* Create User Form */}
      <div>
        <h3>Add New User</h3>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={newUser.username}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={newUser.password}
          onChange={handleChange}
        />
        <select name="role" value={newUser.role} onChange={handleChange}>
          <option value="judge">Judge</option>
          <option value="lawyer">Lawyer</option>
        </select>
        <button onClick={handleCreateUser}>Create User</button>
      </div>

      {/* Users List */}
{loading ? (
  <p>Loading...</p>
) : error ? (
  <p>{error}</p>
) : (
    <ul>
    {users.map((user) => (
      <li key={user.id}>
        {user.username} ({user.role}) 
        <button onClick={() => handleDeleteUser(user.id, user.role)}> Delete</button>
      </li>
    ))}
  </ul>
  
)}

    </div>
  );
};

export default AdminDashboard;
