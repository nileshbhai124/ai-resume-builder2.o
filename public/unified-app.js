// Unified App Navigation
function showLanding() {
    hideAllSections();
    document.getElementById('landing').classList.add('active');
    document.getElementById('landing').style.display = 'block';
    window.scrollTo(0, 0);
    console.log('Switched to landing page');
}

function showLogin() {
    hideAllSections();
    document.getElementById('login').classList.add('active');
    document.getElementById('login').style.display = 'block';
    window.scrollTo(0, 0);
    console.log('Switched to login page');
}

function showRegister() {
    hideAllSections();
    document.getElementById('register').classList.add('active');
    document.getElementById('register').style.display = 'block';
    window.scrollTo(0, 0);
    console.log('Switched to register page');
}

function showDashboard() {
    hideAllSections();
    document.getElementById('dashboard').classList.add('active');
    document.getElementById('dashboard').style.display = 'block';
    window.scrollTo(0, 0);
    console.log('Switched to dashboard');
}

function hideAllSections() {
    const sections = ['landing', 'login', 'register', 'dashboard'];
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.remove('active');
            section.style.display = 'none';
        }
    });
}

// Authentication Functions
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Ensure API_BASE_URL is set (fallback if config.js hasn't loaded)
    const API_URL = window.API_BASE_URL || 'http://localhost:3000';
    
    console.log('🔐 Attempting login...', { email });
    console.log('🔗 API URL:', `${API_URL}/api/auth/login`);
    
    try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        console.log('📡 Response status:', response.status);
        console.log('📡 Response headers:', response.headers);
        
        // Get response text first to see what we're receiving
        const responseText = await response.text();
        console.log('📄 Response text:', responseText);
        
        // Try to parse as JSON
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            console.error('❌ JSON Parse Error:', parseError);
            console.error('❌ Received text:', responseText.substring(0, 200));
            alert('Login error: Server returned invalid response. Please check console for details.');
            return;
        }
        
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            alert('Login successful!');
            showDashboard();
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('❌ Login error:', error);
        alert('Login error: ' + error.message);
    }
}

async function handleRegister(event) {
    event.preventDefault();
    
    const fullName = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    
    // Ensure API_BASE_URL is set (fallback if config.js hasn't loaded)
    const API_URL = window.API_BASE_URL || 'http://localhost:3000';
    
    try {
        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fullName, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            alert('Registration successful!');
            showDashboard();
        } else {
            alert(data.message || 'Registration failed');
        }
    } catch (error) {
        alert('Registration error: ' + error.message);
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showLanding();
}

// Form submission
document.getElementById('resume-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Resume saved! (Connect to backend API)');
});

function generateResume() {
    // Collect form data
    const formData = {
        fullName: document.getElementById('fullName')?.value || '',
        email: document.getElementById('email')?.value || '',
        phone: document.getElementById('phone')?.value || '',
        location: document.getElementById('location')?.value || '',
        linkedin: document.getElementById('linkedin')?.value || '',
        github: document.getElementById('github')?.value || '',
        objective: document.getElementById('objective')?.value || '',
        degree: document.getElementById('degree')?.value || '',
        institution: document.getElementById('institution')?.value || '',
        graduationYear: document.getElementById('graduationYear')?.value || '',
        gpa: document.getElementById('gpa')?.value || '',
        technicalSkills: document.getElementById('technicalSkills')?.value || '',
        softSkills: document.getElementById('softSkills')?.value || '',
        tools: document.getElementById('tools')?.value || '',
        projects: document.getElementById('projects')?.value || '',
        experience: document.getElementById('experience')?.value || '',
        certifications: document.getElementById('certifications')?.value || ''
    };
    
    // Validate required fields
    if (!formData.fullName || !formData.email || !formData.phone || !formData.degree || !formData.institution || !formData.technicalSkills) {
        alert('⚠️ Please fill in all required fields (marked with *)');
        return;
    }
    
    // Save resume data to localStorage
    localStorage.setItem('resumeData', JSON.stringify(formData));
    
    // Redirect to preview page
    window.location.href = '/resume-preview.html';
}

function downloadResume() {
    // Check if resume data exists
    const savedData = localStorage.getItem('resumeData');
    if (!savedData) {
        alert('⚠️ Please generate your resume first by clicking "Generate Resume" button.');
        return;
    }
    
    // Redirect to preview page where user can download
    window.location.href = '/resume-preview.html';
}

// Resume Templates Carousel
let currentSlideIndex = 0;
let autoPlayInterval;
let currentFilter = 'all';
let visibleCards = [];

function initTemplatesCarousel() {
    updateVisibleCards();
    createIndicators();
    startAutoPlay();
    
    // Pause on hover
    const carousel = document.getElementById('templatesCarousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', pauseAutoPlay);
        carousel.addEventListener('mouseleave', startAutoPlay);
    }
}

function updateVisibleCards() {
    const allCards = document.querySelectorAll('.template-card');
    visibleCards = [];
    
    // Update visibility and collect visible cards
    allCards.forEach(card => {
        const profession = card.getAttribute('data-profession');
        if (currentFilter === 'all' || profession === currentFilter) {
            card.style.display = 'flex';
            card.style.flexShrink = '0';
            visibleCards.push(card);
        } else {
            card.style.display = 'none';
        }
    });
    
    // Reset to first slide when filter changes
    currentSlideIndex = 0;
    updateCarouselPosition();
    createIndicators();
}

function filterTemplates(profession) {
    currentFilter = profession;
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-profession="${profession}"]`).classList.add('active');
    
    updateVisibleCards();
    pauseAutoPlay();
    startAutoPlay();
}

function moveSlide(direction) {
    const maxIndex = Math.max(0, visibleCards.length - getVisibleSlidesCount());
    currentSlideIndex += direction;
    
    if (currentSlideIndex < 0) {
        currentSlideIndex = maxIndex;
    } else if (currentSlideIndex > maxIndex) {
        currentSlideIndex = 0;
    }
    
    updateCarouselPosition();
    updateIndicators();
}

function goToSlide(index) {
    currentSlideIndex = index;
    updateCarouselPosition();
    updateIndicators();
}

function updateCarouselPosition() {
    const carousel = document.getElementById('templatesCarousel');
    if (!carousel || visibleCards.length === 0) return;
    
    // Get actual card width dynamically
    const firstCard = visibleCards[0];
    if (!firstCard) return;
    
    const cardWidth = firstCard.offsetWidth;
    const gap = 30;
    const offset = -(currentSlideIndex * (cardWidth + gap));
    
    carousel.style.transform = `translateX(${offset}px)`;
    carousel.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
}

function getVisibleSlidesCount() {
    const width = window.innerWidth;
    if (width >= 1400) return 3;
    if (width >= 1024) return 2;
    return 1;
}

function createIndicators() {
    const indicatorsContainer = document.getElementById('carouselIndicators');
    if (!indicatorsContainer) return;
    
    indicatorsContainer.innerHTML = '';
    const maxIndex = Math.max(0, visibleCards.length - getVisibleSlidesCount());
    
    for (let i = 0; i <= maxIndex; i++) {
        const indicator = document.createElement('div');
        indicator.className = 'indicator';
        if (i === currentSlideIndex) indicator.classList.add('active');
        indicator.onclick = () => {
            goToSlide(i);
            pauseAutoPlay();
            startAutoPlay();
        };
        indicatorsContainer.appendChild(indicator);
    }
}

function updateIndicators() {
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlideIndex);
    });
}

function startAutoPlay() {
    pauseAutoPlay(); // Clear any existing interval
    autoPlayInterval = setInterval(() => {
        moveSlide(1);
    }, 4000); // Auto-play every 4 seconds
}

function pauseAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
    }
}

// Handle window resize
window.addEventListener('resize', () => {
    updateCarouselPosition();
    createIndicators();
});

function generateResumeHTML(data) {
    // Get color theme
    const colorThemes = {
        blue: { primary: '#2196f3', light: '#e3f2fd' },
        green: { primary: '#4caf50', light: '#e8f5e9' },
        purple: { primary: '#9c27b0', light: '#f3e5f5' },
        teal: { primary: '#009688', light: '#e0f2f1' },
        orange: { primary: '#ff9800', light: '#fff3e0' },
        red: { primary: '#f44336', light: '#ffebee' },
        indigo: { primary: '#3f51b5', light: '#e8eaf6' },
        pink: { primary: '#e91e63', light: '#fce4ec' }
    };
    
    const theme = colorThemes[selectedResumeColor] || colorThemes.blue;
    
    return `
<!DOCTYPE html>
<html>
<head>
    <title>${data.fullName} - Resume</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
        .section { margin-bottom: 20px; }
        .section h3 { color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
        .contact-info { display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; }
        .skills { display: flex; flex-wrap: wrap; gap: 10px; }
        .skill-tag { background: #f0f0f0; padding: 5px 10px; border-radius: 15px; font-size: 0.9em; }
        @media print { body { margin: 0; } }
    </style>
</head>
<body>
    <div class="header">
        <h1>${data.fullName}</h1>
        <div class="contact-info">
            <span>📧 ${data.email}</span>
            <span>📱 ${data.phone}</span>
            <span>📍 ${data.location}</span>
            ${data.linkedin ? `<span>💼 LinkedIn</span>` : ''}
            ${data.github ? `<span>💻 GitHub</span>` : ''}
        </div>
    </div>
    
    ${data.objective ? `
    <div class="section">
        <h3>🎯 Career Objective</h3>
        <p>${data.objective}</p>
    </div>` : ''}
    
    <div class="section">
        <h3>🎓 Education</h3>
        <p><strong>${data.degree}</strong><br>
        ${data.institution} | ${data.graduationYear}
        ${data.gpa ? `| ${data.gpa}` : ''}</p>
    </div>
    
    <div class="section">
        <h3>💻 Technical Skills</h3>
        <div class="skills">
            ${data.technicalSkills.split(',').map(skill => `<span class="skill-tag">${skill.trim()}</span>`).join('')}
        </div>
    </div>
    
    ${data.softSkills ? `
    <div class="section">
        <h3>🤝 Soft Skills</h3>
        <div class="skills">
            ${data.softSkills.split(',').map(skill => `<span class="skill-tag">${skill.trim()}</span>`).join('')}
        </div>
    </div>` : ''}
    
    ${data.tools ? `
    <div class="section">
        <h3>🛠️ Tools & Technologies</h3>
        <div class="skills">
            ${data.tools.split(',').map(tool => `<span class="skill-tag">${tool.trim()}</span>`).join('')}
        </div>
    </div>` : ''}
    
    ${data.projects ? `
    <div class="section">
        <h3>🚀 Projects</h3>
        <pre style="white-space: pre-wrap; font-family: Arial, sans-serif;">${data.projects}</pre>
    </div>` : ''}
    
    ${data.experience ? `
    <div class="section">
        <h3>💼 Experience</h3>
        <pre style="white-space: pre-wrap; font-family: Arial, sans-serif;">${data.experience}</pre>
    </div>` : ''}
    
    ${data.certifications ? `
    <div class="section">
        <h3>🏆 Certifications & Achievements</h3>
        <pre style="white-space: pre-wrap; font-family: Arial, sans-serif;">${data.certifications}</pre>
    </div>` : ''}
    
    <div style="text-align: center; margin-top: 30px; color: #666; font-size: 0.9em;">
        Generated by AI Resume Builder - 100% Free
    </div>
</body>
</html>`;
}

// Initialize - ALWAYS show landing first
document.addEventListener('DOMContentLoaded', () => {
    // Ensure landing is visible and others are hidden
    showLanding();
    
    // Add event listeners for auth forms
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Initialize templates carousel
    initTemplatesCarousel();
    
    // Initialize color selector
    initColorSelector();
    
    // Load saved resume data if exists
    loadSavedResumeData();
    
    console.log('App initialized - Landing page should be visible');
});

// Load saved resume data into form
function loadSavedResumeData() {
    const savedData = localStorage.getItem('resumeData');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            
            // Populate form fields
            if (document.getElementById('fullName')) document.getElementById('fullName').value = data.fullName || '';
            if (document.getElementById('email')) document.getElementById('email').value = data.email || '';
            if (document.getElementById('phone')) document.getElementById('phone').value = data.phone || '';
            if (document.getElementById('location')) document.getElementById('location').value = data.location || '';
            if (document.getElementById('linkedin')) document.getElementById('linkedin').value = data.linkedin || '';
            if (document.getElementById('github')) document.getElementById('github').value = data.github || '';
            if (document.getElementById('objective')) document.getElementById('objective').value = data.objective || '';
            if (document.getElementById('degree')) document.getElementById('degree').value = data.degree || '';
            if (document.getElementById('institution')) document.getElementById('institution').value = data.institution || '';
            if (document.getElementById('graduationYear')) document.getElementById('graduationYear').value = data.graduationYear || '';
            if (document.getElementById('gpa')) document.getElementById('gpa').value = data.gpa || '';
            if (document.getElementById('technicalSkills')) document.getElementById('technicalSkills').value = data.technicalSkills || '';
            if (document.getElementById('softSkills')) document.getElementById('softSkills').value = data.softSkills || '';
            if (document.getElementById('tools')) document.getElementById('tools').value = data.tools || '';
            if (document.getElementById('projects')) document.getElementById('projects').value = data.projects || '';
            if (document.getElementById('experience')) document.getElementById('experience').value = data.experience || '';
            if (document.getElementById('certifications')) document.getElementById('certifications').value = data.certifications || '';
            
            console.log('✅ Saved resume data loaded into form');
        } catch (error) {
            console.error('Error loading saved resume data:', error);
        }
    }
}

// Color Selector for Resume
let selectedResumeColor = 'blue';

function initColorSelector() {
    const colorOptions = document.querySelectorAll('.color-option');
    
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all
            colorOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked
            this.classList.add('active');
            
            // Get selected color
            selectedResumeColor = this.getAttribute('data-color');
            
            // Store in localStorage
            localStorage.setItem('resumeColor', selectedResumeColor);
            
            // Show notification
            showColorNotification(selectedResumeColor);
        });
    });
    
    // Load saved color
    const savedColor = localStorage.getItem('resumeColor');
    if (savedColor) {
        selectedResumeColor = savedColor;
        const savedOption = document.querySelector(`[data-color="${savedColor}"]`);
        if (savedOption) {
            colorOptions.forEach(opt => opt.classList.remove('active'));
            savedOption.classList.add('active');
        }
    }
}

function showColorNotification(color) {
    const colorNames = {
        blue: 'Professional Blue',
        green: 'Fresh Green',
        purple: 'Creative Purple',
        teal: 'Modern Teal',
        orange: 'Warm Orange',
        red: 'Bold Red',
        indigo: 'Deep Indigo',
        pink: 'Vibrant Pink'
    };
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'color-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>Resume color changed to ${colorNames[color]}</span>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .color-notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        }
        
        .color-notification i {
            color: #4caf50;
            font-size: 1.2rem;
        }
        
        .color-notification span {
            color: #2d3748;
            font-weight: 600;
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    
    if (!document.querySelector('style[data-color-notification]')) {
        style.setAttribute('data-color-notification', 'true');
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
