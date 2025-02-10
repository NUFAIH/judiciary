const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS

// MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "NewPassword",
    database: "judicialsys",
});

db.connect((err) => {
    if (err) throw err;
    console.log("✅ MySQL connected!");
});

// ✅ LOGIN Route
app.post("/login", (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
        return res.status(400).json({ message: "Username, password, and role are required" });
    }

    let table = role === "judge" ? "judges" : role === "lawyer" ? "lawyers" : role === "admin" ? "admins" : null;
    if (!table) return res.status(400).json({ message: "Invalid role" });

    const sql = `SELECT * FROM ${table} WHERE username = ?;`;
    db.query(sql, [username], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length === 0) return res.status(400).json({ message: "User not found" });

        const user = results[0];

        // Compare password (this is a plaintext comparison, should use bcrypt in production)
        if (password !== user.password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: user.id, username: user.username, role }, "your_secret_key", { expiresIn: "1h" });

        res.json({ message: "Login successful", token });
    });
});
// ✅ Create User Route (Admin can add Judges & Lawyers)
app.post("/users", (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
        return res.status(400).json({ message: "Username, password, and role are required" });
    }

    let table = role === "judge" ? "judges" : role === "lawyer" ? "lawyers" : null;
    if (!table) return res.status(400).json({ message: "Invalid role" });

    const sql = `INSERT INTO ${table} (username, password) VALUES (?, ?);`;
    db.query(sql, [username, password], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ message: "User created successfully", userId: result.insertId });
    });
});

// ✅ Get All Users (For Admin Dashboard)
app.get("/users", (req, res) => {
    const sql = `SELECT 'judge' AS role, id, username FROM judges 
                 UNION 
                 SELECT 'lawyer' AS role, id, username FROM lawyers;`;

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json(results);
    });
});
app.delete("/users/:id", (req, res) => {
    const userId = req.params.id;
    const { role } = req.body; // Get the role from request body

    if (!role) {
        return res.status(400).json({ message: "Role is required to delete a user" });
    }

    let table = role === "judge" ? "judges" : role === "lawyer" ? "lawyers" : null;
    if (!table) return res.status(400).json({ message: "Invalid role" });

    const sql = `DELETE FROM ${table} WHERE id = ?`;
    db.query(sql, [userId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
    });
});



// Start Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
