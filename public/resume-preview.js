// Resume Preview JavaScript

let resumeData = {};
let selectedColor = 'blue';
let selectedTemplate = 'professional';

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadResumeData();
    loadSavedPreferences();
    renderResume();
});

// Load resume data from localStorage
function loadResumeData() {
    const savedData = localStorage.getItem('resumeData');
    if (savedData) {
        resumeData = JSON.parse(savedData);
        console.log('✅ Resume data loaded:', resumeData);
    } else {
        console.warn('⚠️ No resume data found, redirecting to dashboard...');
        setTimeout(() => {
            window.location.href = '/app-unified.html#dashboard';
        }, 2000);
    }
}

// Load saved color and template preferences
function loadSavedPreferences() {
    selectedColor = localStorage.getItem('resumeColor') || 'blue';
    selectedTemplate = localStorage.getItem('resumeTemplate') || 'professional';
    
    // Set active states in modal
    const colorOption = document.querySelector(`[data-color="${selectedColor}"]`);
    if (colorOption) colorOption.classList.add('active');
    
    const templateOption = document.querySelector(`[data-template="${selectedTemplate}"]`);
    if (templateOption) templateOption.classList.add('active');
}

// Render resume based on template
function renderResume() {
    const resumePage = document.getElementById('resumePage');
    resumePage.setAttribute('data-color', selectedColor);
    
    switch (selectedTemplate) {
        case 'professional':
            resumePage.innerHTML = generateProfessionalTemplate();
            break;
        case 'modern':
            resumePage.innerHTML = generateModernTemplate();
            break;
        case 'minimal':
            resumePage.innerHTML = generateMinimalTemplate();
            break;
        case 'creative':
            resumePage.innerHTML = generateCreativeTemplate();
            break;
        default:
            resumePage.innerHTML = generateProfessionalTemplate();
    }
}

// Professional Template
function generateProfessionalTemplate() {
    return `
        <div class="resume-header">
            <h1>${resumeData.fullName || 'Your Name'}</h1>
            <div class="title">${resumeData.degree || 'Your Title'}</div>
            <div class="contact-info">
                <span><i class="fas fa-envelope"></i> ${resumeData.email || 'email@example.com'}</span>
                <span><i class="fas fa-phone"></i> ${resumeData.phone || '+1 234 567 8900'}</span>
                <span><i class="fas fa-map-marker-alt"></i> ${resumeData.location || 'City, State'}</span>
                ${resumeData.linkedin ? `<span><i class="fab fa-linkedin"></i> LinkedIn</span>` : ''}
                ${resumeData.github ? `<span><i class="fab fa-github"></i> GitHub</span>` : ''}
            </div>
        </div>

        ${resumeData.objective ? `
        <div class="resume-section">
            <h2><i class="fas fa-bullseye"></i> Career Objective</h2>
            <p>${resumeData.objective}</p>
        </div>
        ` : ''}

        <div class="resume-section">
            <h2><i class="fas fa-graduation-cap"></i> Education</h2>
            <div class="education-item">
                <h3>${resumeData.degree || 'Degree Name'}</h3>
                <p>${resumeData.institution || 'Institution Name'} | ${resumeData.graduationYear || 'Year'} ${resumeData.gpa ? `| ${resumeData.gpa}` : ''}</p>
            </div>
        </div>

        <div class="resume-section">
            <h2><i class="fas fa-code"></i> Technical Skills</h2>
            <div class="skills-container">
                ${generateSkillTags(resumeData.technicalSkills)}
            </div>
        </div>

        ${resumeData.softSkills ? `
        <div class="resume-section">
            <h2><i class="fas fa-users"></i> Soft Skills</h2>
            <div class="skills-container">
                ${generateSkillTags(resumeData.softSkills)}
            </div>
        </div>
        ` : ''}

        ${resumeData.tools ? `
        <div class="resume-section">
            <h2><i class="fas fa-tools"></i> Tools & Technologies</h2>
            <div class="skills-container">
                ${generateSkillTags(resumeData.tools)}
            </div>
        </div>
        ` : ''}

        ${resumeData.projects ? `
        <div class="resume-section">
            <h2><i class="fas fa-project-diagram"></i> Projects</h2>
            ${formatProjects(resumeData.projects)}
        </div>
        ` : ''}

        ${resumeData.experience ? `
        <div class="resume-section">
            <h2><i class="fas fa-briefcase"></i> Experience</h2>
            ${formatExperience(resumeData.experience)}
        </div>
        ` : ''}

        ${resumeData.certifications ? `
        <div class="resume-section">
            <h2><i class="fas fa-certificate"></i> Certifications & Achievements</h2>
            ${formatCertifications(resumeData.certifications)}
        </div>
        ` : ''}

        <div style="text-align: center; margin-top: 30px; color: #999; font-size: 0.85rem;">
            Generated by AI Resume Builder - 100% Free
        </div>
    `;
}

// Modern Template (similar structure, can be customized)
function generateModernTemplate() {
    return generateProfessionalTemplate(); // For now, using same structure
}

// Minimal Template
function generateMinimalTemplate() {
    return generateProfessionalTemplate(); // For now, using same structure
}

// Creative Template
function generateCreativeTemplate() {
    return generateProfessionalTemplate(); // For now, using same structure
}

// Helper: Generate skill tags
function generateSkillTags(skillsString) {
    if (!skillsString) return '';
    const skills = skillsString.split(',').map(s => s.trim()).filter(s => s);
    return skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('');
}

// Helper: Format projects
function formatProjects(projectsText) {
    if (!projectsText) return '';
    const lines = projectsText.split('\n').filter(line => line.trim());
    let html = '<div class="item">';
    
    lines.forEach(line => {
        if (line.toLowerCase().startsWith('project')) {
            if (html !== '<div class="item">') html += '</div><div class="item">';
            html += `<h3>${line}</h3>`;
        } else if (line.toLowerCase().startsWith('description:')) {
            html += `<p>${line.replace(/description:/i, '').trim()}</p>`;
        } else if (line.toLowerCase().startsWith('technologies:')) {
            html += `<p class="meta">${line}</p>`;
        } else if (line.toLowerCase().startsWith('link:')) {
            html += `<p class="meta">${line}</p>`;
        } else if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
            if (!html.includes('<ul>')) html += '<ul>';
            html += `<li>${line.replace(/^[•\-]\s*/, '')}</li>`;
        } else if (line.trim()) {
            html += `<p>${line}</p>`;
        }
    });
    
    html += '</div>';
    return html;
}

// Helper: Format experience
function formatExperience(experienceText) {
    if (!experienceText) return '';
    const lines = experienceText.split('\n').filter(line => line.trim());
    let html = '<div class="item">';
    
    lines.forEach(line => {
        if (line.includes('-') && !line.trim().startsWith('•') && !line.trim().startsWith('-')) {
            if (html !== '<div class="item">') html += '</div><div class="item">';
            html += `<h3>${line}</h3>`;
        } else if (line.toLowerCase().startsWith('duration:')) {
            html += `<p class="meta">${line.replace(/duration:/i, '').trim()}</p>`;
        } else if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
            if (!html.includes('<ul>')) html += '<ul>';
            html += `<li>${line.replace(/^[•\-]\s*/, '')}</li>`;
        } else if (line.trim()) {
            html += `<p>${line}</p>`;
        }
    });
    
    html += '</div>';
    return html;
}

// Helper: Format certifications
function formatCertifications(certificationsText) {
    if (!certificationsText) return '';
    const lines = certificationsText.split('\n').filter(line => line.trim());
    let html = '<ul>';
    
    lines.forEach(line => {
        if (line.trim()) {
            html += `<li>${line.replace(/^[•\-]\s*/, '')}</li>`;
        }
    });
    
    html += '</ul>';
    return html;
}

// Navigation Functions
function goBackToDashboard() {
    window.location.href = '/app-unified.html#dashboard';
}

// Style Modal Functions
function changeTemplate() {
    const modal = document.getElementById('styleModal');
    modal.classList.add('active');
}

function closeStyleModal() {
    const modal = document.getElementById('styleModal');
    modal.classList.remove('active');
}

function selectColor(color) {
    // Remove active from all
    document.querySelectorAll('.color-option').forEach(opt => {
        opt.classList.remove('active');
    });
    
    // Add active to selected
    const selected = document.querySelector(`[data-color="${color}"]`);
    if (selected) selected.classList.add('active');
    
    selectedColor = color;
}

function selectTemplate(template) {
    // Remove active from all
    document.querySelectorAll('.template-option').forEach(opt => {
        opt.classList.remove('active');
    });
    
    // Add active to selected
    const selected = document.querySelector(`[data-template="${template}"]`);
    if (selected) selected.classList.add('active');
    
    selectedTemplate = template;
}

function applyStyle() {
    // Save preferences
    localStorage.setItem('resumeColor', selectedColor);
    localStorage.setItem('resumeTemplate', selectedTemplate);
    
    // Re-render resume
    renderResume();
    
    // Close modal
    closeStyleModal();
    
    // Show notification
    showNotification('✅ Style updated successfully!');
}

// Download PDF Function
function downloadPDF() {
    // Show loading overlay
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.classList.add('active');
    
    // Use browser's print functionality for PDF
    setTimeout(() => {
        window.print();
        loadingOverlay.classList.remove('active');
    }, 500);
}

// Notification Function
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        font-weight: 600;
        color: #2d3748;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Close modal on outside click
document.getElementById('styleModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'styleModal') {
        closeStyleModal();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + P for print
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        downloadPDF();
    }
    
    // Escape to close modal
    if (e.key === 'Escape') {
        closeStyleModal();
    }
});

console.log('✅ Resume Preview initialized');
