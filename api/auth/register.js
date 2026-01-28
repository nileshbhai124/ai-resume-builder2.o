// Vercel Serverless Function - Register API
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// In-memory storage for demo (replace with database in production)
let users = [];

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { email, password, fullName } = req.body;

        // Validation
        if (!email || !password || !fullName) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            email,
            password: hashedPassword,
            fullName,
            createdAt: new Date().toISOString()
        };

        // Store user (in-memory for demo)
        users.push(newUser);

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser.id },
            process.env.JWT_SECRET || 'resume-builder-secret-key-2024-secure',
            { expiresIn: '7d' }
        );

        // Success response
        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: newUser.id,
                email: newUser.email,
                fullName: newUser.fullName
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
}
