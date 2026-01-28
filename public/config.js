// API Configuration
// This file determines which backend URL to use based on environment

// Automatically detect environment
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000'  // Local development
  : 'https://ai-resume-backend.onrender.com';  // Production backend on Render

// Export for use in other files
window.API_BASE_URL = API_BASE_URL;

console.log('🔗 API Base URL:', API_BASE_URL);
console.log('🌐 Environment:', window.location.hostname === 'localhost' ? 'Development' : 'Production');
