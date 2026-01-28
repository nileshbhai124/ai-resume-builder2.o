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
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            alert('Login successful!');
            showDashboard();
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        alert('Login error: ' + error.message);
    }
}

async function handleRegister(event) {
    event.preventDefault();
    
    const fullName = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    
    try {
        const response = await fetch('/api/auth/register', {
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
    
    // Generate resume preview
    const resumeHTML = generateResumeHTML(formData);
    
    // Open in new window
    const newWindow = window.open('', '_blank');
    newWindow.document.write(resumeHTML);
    newWindow.document.close();
    
    alert('✅ Resume generated successfully! Check the new window.');
}

function downloadResume() {
    alert('📄 PDF download feature coming soon! For now, you can print the generated resume as PDF.');
}

// Resume Template Carousel
let currentSlide = 0;
let autoplayInterval;
let isAutoplayActive = true;
const slideInterval = 3000; // 3 seconds

function initCarousel() {
    const track = document.getElementById('carouselTrack');
    const dotsContainer = document.getElementById('carouselDots');
    
    if (!track) return;
    
    const cards = track.children;
    const totalSlides = cards.length;
    
    // Create dots
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot';
        if (i === 0) dot.classList.add('active');
        dot.onclick = () => goToSlide(i);
        dotsContainer.appendChild(dot);
    }
    
    // Start autoplay
    startAutoplay();
}

function moveCarousel(direction) {
    const track = document.getElementById('carouselTrack');
    const cards = track.children;
    const totalSlides = cards.length;
    
    // Calculate visible slides based on screen width
    let visibleSlides = 3;
    if (window.innerWidth <= 1024) visibleSlides = 2;
    if (window.innerWidth <= 768) visibleSlides = 1;
    
    const maxSlide = totalSlides - visibleSlides;
    
    currentSlide += direction;
    
    // Loop around
    if (currentSlide < 0) currentSlide = maxSlide;
    if (currentSlide > maxSlide) currentSlide = 0;
    
    updateCarousel();
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
    resetAutoplay();
}

function updateCarousel() {
    const track = document.getElementById('carouselTrack');
    const dots = document.querySelectorAll('.dot');
    const cardWidth = track.children[0].offsetWidth;
    const gap = 30;
    
    // Move track
    const offset = -(currentSlide * (cardWidth + gap));
    track.style.transform = `translateX(${offset}px)`;
    
    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function startAutoplay() {
    if (isAutoplayActive) {
        autoplayInterval = setInterval(() => {
            moveCarousel(1);
        }, slideInterval);
    }
}

function stopAutoplay() {
    clearInterval(autoplayInterval);
}

function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
}

function toggleAutoplay() {
    isAutoplayActive = !isAutoplayActive;
    const icon = document.getElementById('playPauseIcon');
    const text = document.getElementById('playPauseText');
    
    if (isAutoplayActive) {
        icon.className = 'fas fa-pause';
        text.textContent = 'Pause';
        startAutoplay();
    } else {
        icon.className = 'fas fa-play';
        text.textContent = 'Play';
        stopAutoplay();
    }
}

// Handle window resize
window.addEventListener('resize', () => {
    updateCarousel();
});

function generateResumeHTML(data) {
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
    
    // Initialize carousel
    initCarousel();
    
    console.log('App initialized - Landing page should be visible');
});
