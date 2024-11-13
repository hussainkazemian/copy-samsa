import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from './db.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Secret Key for JWT
const JWT_SECRET = process.env.JWT_SECRET;

// Register Route
app.post('/register', async (req, res) => {
    const { full_name, date_of_birth, contact_number, address, email, password } = req.body;

    // Check if all required fields are provided
    if (!full_name || !date_of_birth || !contact_number || !address || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Attempt to insert user into database
        await pool.query(
            'INSERT INTO users (full_name, date_of_birth, contact_number, address, email, password) VALUES (?, ?, ?, ?, ?, ?)',
            [full_name, date_of_birth, contact_number, address, email, hashedPassword]
        );
        
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        // Handle unique constraint violation for email
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Email is already registered' });
        }
        console.error("Registration error:", err);
        res.status(500).json({ message: 'Error registering user', error: err.message });
    }
});

// Login Route with Added Debugging
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log("Login attempt for:", email); // Logging the email attempting login

    try {
        const user = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        console.log("User data retrieved:", user); // Log user data retrieved from the database

        if (user.length === 0) {
            console.log("User not found");
            return res.status(400).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user[0].password);
        console.log("Password valid:", isPasswordValid); // Log password comparison result

        if (!isPasswordValid) {
            console.log("Incorrect password");
            return res.status(400).json({ message: 'Incorrect password' });
        }

        const token = jwt.sign({ user_id: user[0].user_id }, JWT_SECRET, { expiresIn: '1h' });
        console.log("Login successful, token generated:", token); // Log token for debugging

        // Returning user email and user_id along with token for further frontend use if needed
        res.json({ token, message: 'Login successful', user: { email: user[0].email, user_id: user[0].user_id } });
    } catch (err) {
        console.error("Login error:", err); // This will log the error in the server console
        res.status(500).json({ message: 'Error logging in' });
    }
});

// Root route to handle GET request to '/'
app.get('/', (req, res) => {
    res.send('Welcome to the Samsa Restaurant API');
});

// Forgot Password Route (Mock Implementation)
app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (user.length === 0) return res.status(400).json({ message: 'User not found' });

        // TODO: Implement email sending logic for password reset in production
        res.json({ message: 'Password reset email sent (mock implementation)' });
    } catch (err) {
        console.error("Password reset error:", err);
        res.status(500).json({ message: 'Error handling password reset' });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
