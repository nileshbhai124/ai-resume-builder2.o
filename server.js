const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Disable mongoose connection warnings
mongoose.set('strictQuery', false);

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Disable caching for development
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});

// Simple file-based database for development
const dbPath = path.join(__dirname, 'data');
if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath);
}

// Initialize data files
const usersFile = path.join(dbPath, 'users.json');
const resumesFile = path.join(dbPath, 'resumes.json');

if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, JSON.stringify([]));
}
if (!fs.existsSync(resumesFile)) {
    fs.writeFileSync(resumesFile, JSON.stringify([]));
}

console.log('✅ File-based database initialized');

// Database connection (only try MongoDB if URI is provided)
if (process.env.MONGODB_URI && process.env.USE_FILE_DB !== 'true') {
    console.log('🔄 Attempting MongoDB connection...');
    mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 5000
    })
      .then(() => {
        console.log('✅ MongoDB Atlas connected successfully');
        console.log('📊 Database: MongoDB Atlas (Cloud)');
      })
      .catch(err => {
        console.log('⚠️  MongoDB connection failed - using local file storage');
        console.log('💡 To setup MongoDB Atlas, check MONGODB_INSTRUCTIONS.md');
      });
} else {
    console.log('✅ Using file-based database');
    console.log('💡 To enable MongoDB, update .env file and set USE_FILE_DB=false');
}

// API Routes - MUST come before static files
app.use('/api/auth', require('./routes/auth'));
app.use('/api/resume', require('./routes/resume'));

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'Server is working', 
        timestamp: new Date().toISOString(),
        version: '2.0'
    });
});

// Static files - comes after API routes
app.use(express.static('public'));

// Serve specific pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'landing.html'));
});

app.get('/landing.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'landing.html'));
});

app.get('/app-unified.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'app-unified.html'));
});

app.get('/dashboard.html', (req, res) => {
  // Dashboard should show app-unified.html (which handles login/dashboard internally)
  res.sendFile(path.join(__dirname, 'public', 'app-unified.html'));
});

app.get('/dashboard', (req, res) => {
  // Redirect /dashboard to /dashboard.html
  res.redirect('/dashboard.html');
});

app.get('/home.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'landing.html'));
});

app.get('/resume-preview.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'resume-preview.html'));
});

// Serve frontend - catch all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'landing.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.message);
    console.error('Stack:', err.stack);
    res.status(500).json({ 
        message: 'Server error', 
        error: err.message 
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('📊 Database: File-based storage ready');
  console.log('🌐 Frontend: Unified single-page app');
});
