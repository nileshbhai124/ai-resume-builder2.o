// Vercel Serverless Function - Login API
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
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // For demo: Check if user exists in memory or use default test user
        let user = users.find(u => u.email === email);
        
        // Default test user for demo
        if (!user && email === 'test@example.com') {
            user = {
                id: 'test-user-1',
                email: 'test@example.com',
                password: await bcrypt.hash('password123', 10),
                fullName: 'Test User'
            };
        }

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || 'resume-builder-secret-key-2024-secure',
            { expiresIn: '7d' }
        );

        // Success response
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
}
