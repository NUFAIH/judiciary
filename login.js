const express = require("express");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors()); // Allow frontend to call the backend

// Create MySQL Connection
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

// Login Route
app.post("/login", (req, res) => {
    const { username, password, role } = req.body; // Include role in the request body

    if (!username || !password || !role) {
        return res.status(400).json({ message: "Username, password, and role are required" });
    }

    // Dynamically select table based on role
    let table = '';
    if (role === 'judge') {
        table = 'judges';
    } else if (role === 'lawyer') {
        table = 'lawyers';
    } else if (role === 'admin') {
        table = 'admins';
    } else {
        return res.status(400).json({ message: "Invalid role" });
    }

    // Query the database for the user based on the role
    const sql = `SELECT * FROM ${table} WHERE username = ?;`;
    db.query(sql, [username], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }

        const user = results[0];

        // Compare plaintext passwords
        if (password !== user.password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, "your_secret_key", { expiresIn: "1h" });

        res.json({ message: "Login successful", token });
    });
});

// Start Server
app.listen(5000, () => {
    console.log("✅ Server running on port 5000");
});
