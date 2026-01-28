const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Try to import User model, fallback to file-based if not available
let User;
try {
    User = require('../models/User');
} catch (error) {
    console.log('MongoDB User model not available, using file-based storage');
}

// File-based user storage
const usersFile = path.join(__dirname, '../data/users.json');

// Helper functions for file-based storage
function getUsers() {
    try {
        if (fs.existsSync(usersFile)) {
            return JSON.parse(fs.readFileSync(usersFile, 'utf8'));
        }
        return [];
    } catch (error) {
        return [];
    }
}

function saveUsers(users) {
    const dataDir = path.dirname(usersFile);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// Register
router.post('/register', async (req, res) => {
    try {
        const { email, password, fullName } = req.body;
        
        if (!email || !password || !fullName) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Try MongoDB first, then fallback to file-based
        if (User && process.env.USE_FILE_DB !== 'true') {
            // MongoDB approach
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const user = new User({ email, password, fullName });
            await user.save();

            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

            res.status(201).json({
                message: 'User created successfully',
                token,
                user: { id: user._id, email: user.email, fullName: user.fullName }
            });
        } else {
            // File-based approach
            const users = getUsers();
            const existingUser = users.find(user => user.email === email);
            
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = {
                id: Date.now().toString(),
                email,
                password: hashedPassword,
                fullName,
                createdAt: new Date().toISOString()
            };

            users.push(newUser);
            saveUsers(users);

            const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

            res.status(201).json({
                message: 'User created successfully',
                token,
                user: { id: newUser.id, email: newUser.email, fullName: newUser.fullName }
            });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Try MongoDB first, then fallback to file-based
        if (User && process.env.USE_FILE_DB !== 'true') {
            // MongoDB approach
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

            res.json({
                message: 'Login successful',
                token,
                user: { id: user._id, email: user.email, fullName: user.fullName }
            });
        } else {
            // File-based approach
            const users = getUsers();
            const user = users.find(u => u.email === email);
            
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

            res.json({
                message: 'Login successful',
                token,
                user: { id: user.id, email: user.email, fullName: user.fullName }
            });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
