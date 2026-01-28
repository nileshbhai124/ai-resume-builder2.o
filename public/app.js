const API_URL = 'http://localhost:3000/api';
let token = localStorage.getItem('token');

// Check authentication on load
document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname;
  
  // If on landing page, always show landing
  if (currentPage.includes('landing.html')) {
    // Landing page - no auth check needed
    return;
  }
  
  // For main app (index.html)
  if (token) {
    showDashboard();
    loadResumeData();
    checkATSScore();
  } else {
    showAuth();
  }
});

function showLanding() {
  document.getElementById('landing-page').style.display = 'block';
  document.getElementById('auth-section').style.display = 'none';
  document.getElementById('dashboard-section').style.display = 'none';
}

function showAuth() {
  if (document.getElementById('landing-page')) {
    document.getElementById('landing-page').style.display = 'none';
  }
  document.getElementById('auth-section').style.display = 'block';
  document.getElementById('dashboard-section').style.display = 'none';
}

function showDashboard() {
  if (document.getElementById('landing-page')) {
    document.getElementById('landing-page').style.display = 'none';
  }
  document.getElementById('auth-section').style.display = 'none';
  document.getElementById('dashboard-section').style.display = 'block';
}

// Register
document.getElementById('register-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fullName = document.getElementById('reg-name').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password })
    });

    const data = await response.json();
    if (response.ok) {
      token = data.token;
      localStorage.setItem('token', token);
      showMessage('Registration successful!', 'success');
      showDashboard();
    } else {
      showMessage(data.message, 'error');
    }
  } catch (error) {
    showMessage('Registration failed', 'error');
  }
});

// Login
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (response.ok) {
      token = data.token;
      localStorage.setItem('token', token);
      showMessage('Login successful!', 'success');
      showDashboard();
      loadResumeData();
    } else {
      showMessage(data.message, 'error');
    }
  } catch (error) {
    showMessage('Login failed', 'error');
  }
});

// Logout
document.getElementById('logout-btn')?.addEventListener('click', () => {
  localStorage.removeItem('token');
  token = null;
  showAuth();
  showMessage('Logged out successfully', 'success');
});

// Save Resume
document.getElementById('resume-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const resumeData = {
    personalInfo: {
      fullName: document.getElementById('fullName').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      location: document.getElementById('location').value,
      linkedin: document.getElementById('linkedin').value,
      portfolio: document.getElementById('portfolio').value
    },
    targetJob: document.getElementById('targetJob').value,
    careerObjective: document.getElementById('careerObjective').value,
    education: [{
      degree: document.getElementById('degree').value,
      institution: document.getElementById('institution').value,
      graduationYear: parseInt(document.getElementById('graduationYear').value),
      gpa: document.getElementById('gpa').value
    }],
    skills: {
      technical: document.getElementById('technical-skills').value.split(',').map(s => s.trim()),
      soft: document.getElementById('soft-skills').value.split(',').map(s => s.trim())
    },
    projects: document.getElementById('projects').value.split('\n\n').map(p => {
      const lines = p.split('\n');
      return {
        title: lines[0] || '',
        description: lines[1] || '',
        technologies: (lines[2] || '').split(',').map(t => t.trim())
      };
    }).filter(p => p.title),
    experience: document.getElementById('experience').value.split('\n\n').map(e => {
      const lines = e.split('\n');
      return {
        role: lines[0] || '',
        company: lines[1] || '',
        duration: lines[2] || '',
        responsibilities: lines.slice(3).filter(l => l)
      };
    }).filter(e => e.role),
    certifications: document.getElementById('certifications').value.split('\n').filter(c => c),
    template: document.querySelector('input[name="template"]:checked')?.value || 'professional'
  };

  try {
    const response = await fetch(`${API_URL}/resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(resumeData)
    });

    const data = await response.json();
    if (response.ok) {
      showMessage('Resume saved successfully!', 'success');
      checkATSScore();
    } else {
      showMessage(data.message, 'error');
    }
  } catch (error) {
    showMessage('Failed to save resume', 'error');
  }
});

// Generate Resume
async function generateResume() {
  const template = document.querySelector('input[name="template"]:checked').value;
  
  try {
    const response = await fetch(`${API_URL}/resume/generate`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ template })
    });

    const data = await response.json();
    if (response.ok) {
      document.getElementById('generated-resume').textContent = data.content;
      document.getElementById('resume-output').style.display = 'block';
      document.getElementById('resume-output').scrollIntoView({ behavior: 'smooth' });
    } else {
      showMessage(data.message, 'error');
    }
  } catch (error) {
    showMessage('Failed to generate resume', 'error');
  }
}

// AI Optimize Resume
async function optimizeResume() {
  const targetJob = document.getElementById('targetJob').value || 'software developer';
  
  try {
    const response = await fetch(`${API_URL}/resume/optimize`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ targetJob })
    });

    const data = await response.json();
    if (response.ok) {
      document.getElementById('careerObjective').value = data.optimizedObjective;
      showMessage(`✨ Resume optimized! Match: ${data.jobMatch.matchPercentage}%`, 'success');
      
      // Show suggestions
      if (data.jobMatch.suggestions.length > 0) {
        setTimeout(() => {
          alert('AI Suggestions:\n\n' + data.jobMatch.suggestions.join('\n\n'));
        }, 1000);
      }
    } else {
      showMessage(data.message, 'error');
    }
  } catch (error) {
    showMessage('Failed to optimize resume', 'error');
  }
}

// Check ATS Score
async function checkATSScore() {
  try {
    const response = await fetch(`${API_URL}/resume/ats-score`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
      const data = await response.json();
      const scoreDisplay = document.getElementById('ats-score-display');
      if (scoreDisplay) {
        scoreDisplay.textContent = `ATS Score: ${data.atsScore}/100`;
        scoreDisplay.className = data.atsScore >= 70 ? 'ats-score good' : 'ats-score';
      }
    }
  } catch (error) {
    console.log('Could not fetch ATS score');
  }
}

// Show Job Match Modal
async function showJobMatch() {
  const targetJob = document.getElementById('targetJob').value;
  
  if (!targetJob) {
    showMessage('Please enter a target job first', 'error');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/resume/job-match`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ targetJob })
    });

    const data = await response.json();
    if (response.ok) {
      const modal = document.getElementById('job-match-modal');
      const content = document.getElementById('job-match-content');
      
      content.innerHTML = `
        <div class="match-score">
          <h3>Match Score: ${data.jobMatch.matchPercentage}%</h3>
          <div class="progress-bar">
            <div class="progress" style="width: ${data.jobMatch.matchPercentage}%"></div>
          </div>
        </div>
        
        <div class="match-section">
          <h4>✅ Matched Keywords (${data.jobMatch.matchedKeywords.length})</h4>
          <div class="keywords">${data.jobMatch.matchedKeywords.map(k => `<span class="keyword matched">${k}</span>`).join('')}</div>
        </div>
        
        <div class="match-section">
          <h4>❌ Missing Keywords (${data.jobMatch.missingKeywords.length})</h4>
          <div class="keywords">${data.jobMatch.missingKeywords.map(k => `<span class="keyword missing">${k}</span>`).join('')}</div>
        </div>
        
        <div class="match-section">
          <h4>💡 AI Suggestions</h4>
          <ul>
            ${data.jobMatch.suggestions.map(s => `<li>${s}</li>`).join('')}
          </ul>
        </div>
        
        <div class="match-section">
          <h4>📊 ATS Score: ${data.atsScore}/100</h4>
        </div>
      `;
      
      modal.style.display = 'block';
    } else {
      showMessage(data.message, 'error');
    }
  } catch (error) {
    showMessage('Failed to analyze job match', 'error');
  }
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

function copyResume() {
  const text = document.getElementById('generated-resume').textContent;
  navigator.clipboard.writeText(text);
  showMessage('Resume copied to clipboard!', 'success');
}

// Load Resume Data
async function loadResumeData() {
  try {
    const response = await fetch(`${API_URL}/resume`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
      const resume = await response.json();
      populateForm(resume);
    }
  } catch (error) {
    console.log('No existing resume data');
  }
}

function populateForm(resume) {
  if (resume.personalInfo) {
    document.getElementById('fullName').value = resume.personalInfo.fullName || '';
    document.getElementById('email').value = resume.personalInfo.email || '';
    document.getElementById('phone').value = resume.personalInfo.phone || '';
    document.getElementById('location').value = resume.personalInfo.location || '';
    document.getElementById('linkedin').value = resume.personalInfo.linkedin || '';
    document.getElementById('portfolio').value = resume.personalInfo.portfolio || '';
  }
  if (resume.education?.[0]) {
    document.getElementById('degree').value = resume.education[0].degree || '';
    document.getElementById('institution').value = resume.education[0].institution || '';
    document.getElementById('graduationYear').value = resume.education[0].graduationYear || '';
    document.getElementById('gpa').value = resume.education[0].gpa || '';
  }
  if (resume.skills) {
    document.getElementById('technical-skills').value = resume.skills.technical?.join(', ') || '';
    document.getElementById('soft-skills').value = resume.skills.soft?.join(', ') || '';
  }
  document.getElementById('targetJob').value = resume.targetJob || '';
  document.getElementById('careerObjective').value = resume.careerObjective || '';
  
  if (resume.template) {
    const templateRadio = document.querySelector(`input[name="template"][value="${resume.template}"]`);
    if (templateRadio) templateRadio.checked = true;
  }
}

function showMessage(message, type) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}`;
  messageDiv.textContent = message;
  document.body.appendChild(messageDiv);
  setTimeout(() => messageDiv.remove(), 3000);
}

function switchToLogin() {
  document.getElementById('register-section').style.display = 'none';
  document.getElementById('login-section').style.display = 'block';
}

function switchToRegister() {
  document.getElementById('login-section').style.display = 'none';
  document.getElementById('register-section').style.display = 'block';
}


// One-Click Enhance
async function oneClickEnhance() {
  if (!confirm('This will enhance your entire resume with AI. Continue?')) return;
  
  try {
    const response = await fetch(`${API_URL}/resume/enhance`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    if (response.ok) {
      showMessage('✨ Resume enhanced successfully!', 'success');
      loadResumeData();
      
      setTimeout(() => {
        alert('Improvements Made:\n\n' + data.improvements.join('\n'));
      }, 1000);
    } else {
      showMessage(data.message, 'error');
    }
  } catch (error) {
    showMessage('Failed to enhance resume', 'error');
  }
}

// Show AI Tools Modal
function showAITools() {
  document.getElementById('ai-tools-modal').style.display = 'block';
}

// Rewrite Bullet Point
async function rewriteBullet() {
  const bullet = document.getElementById('bullet-input').value;
  if (!bullet) {
    showMessage('Please enter a bullet point', 'error');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/resume/rewrite-bullet`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ bullet })
    });

    const data = await response.json();
    if (response.ok) {
      document.getElementById('bullet-output').innerHTML = `
        <div class="comparison">
          <div class="before">
            <strong>Before:</strong><br>${data.original}
          </div>
          <div class="after">
            <strong>After:</strong><br>${data.enhanced}
          </div>
        </div>
        <button onclick="copyText('${data.enhanced.replace(/'/g, "\\'")}')">Copy Enhanced</button>
      `;
    }
  } catch (error) {
    showMessage('Failed to rewrite bullet', 'error');
  }
}

// Generate Summary
async function generateSummaryAI() {
  try {
    const response = await fetch(`${API_URL}/resume/generate-summary`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    if (response.ok) {
      document.getElementById('summary-output').innerHTML = `
        <div class="generated-content">
          <p>${data.summary}</p>
          <button onclick="useSummary('${data.summary.replace(/'/g, "\\'")}')">Use This Summary</button>
        </div>
      `;
    }
  } catch (error) {
    showMessage('Failed to generate summary', 'error');
  }
}

function useSummary(summary) {
  document.getElementById('careerObjective').value = summary;
  closeModal('ai-tools-modal');
  showMessage('Summary added to your resume!', 'success');
}

// Suggest Skills
async function suggestSkills() {
  const targetJob = document.getElementById('skill-job-input').value || document.getElementById('targetJob').value;
  
  if (!targetJob) {
    showMessage('Please enter a target job', 'error');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/resume/suggest-skills`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ targetJob })
    });

    const data = await response.json();
    if (response.ok) {
      document.getElementById('skills-output').innerHTML = `
        <div class="skills-suggestions">
          <h4>Suggested Skills for ${targetJob}:</h4>
          <div class="skill-tags">
            ${data.suggested.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
          </div>
          <button onclick="addSkills('${data.suggested.join(', ')}')">Add These Skills</button>
        </div>
      `;
    }
  } catch (error) {
    showMessage('Failed to suggest skills', 'error');
  }
}

function addSkills(skills) {
  const currentSkills = document.getElementById('technical-skills').value;
  const newSkills = currentSkills ? currentSkills + ', ' + skills : skills;
  document.getElementById('technical-skills').value = newSkills;
  closeModal('ai-tools-modal');
  showMessage('Skills added to your resume!', 'success');
}

// Check Grammar
async function checkGrammarAI() {
  const text = document.getElementById('grammar-input').value;
  
  if (!text) {
    showMessage('Please enter text to check', 'error');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/resume/check-grammar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    });

    const data = await response.json();
    if (response.ok) {
      const issuesHTML = data.issues.length > 0 
        ? data.issues.map(issue => `
            <div class="grammar-issue ${issue.severity}">
              <strong>${issue.severity.toUpperCase()}:</strong> ${issue.message}
              ${issue.count ? `(Found ${issue.count} times)` : ''}
            </div>
          `).join('')
        : '<div class="grammar-success">✅ No issues found!</div>';

      document.getElementById('grammar-output').innerHTML = `
        <div class="grammar-results">
          <h4>Grammar Score: ${data.score}/100</h4>
          <div class="issues-list">${issuesHTML}</div>
        </div>
      `;
    }
  } catch (error) {
    showMessage('Failed to check grammar', 'error');
  }
}

// Tailor Resume
async function tailorResume() {
  const jobDescription = document.getElementById('job-desc-input').value;
  
  if (!jobDescription) {
    showMessage('Please enter a job description', 'error');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/resume/tailor`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ jobDescription })
    });

    const data = await response.json();
    if (response.ok) {
      document.getElementById('tailor-output').innerHTML = `
        <div class="tailor-results">
          <h4>Matched Keywords:</h4>
          <div class="keyword-tags">
            ${data.matchedKeywords.map(kw => `<span class="keyword-tag">${kw}</span>`).join('')}
          </div>
          <h4>Suggestions:</h4>
          <ul>
            ${data.suggestions.map(s => `<li>${s}</li>`).join('')}
          </ul>
          <button onclick="applyTailoring()">Apply Tailoring</button>
        </div>
      `;
    }
  } catch (error) {
    showMessage('Failed to tailor resume', 'error');
  }
}

function applyTailoring() {
  loadResumeData();
  closeModal('ai-tools-modal');
  showMessage('Resume tailored successfully!', 'success');
}

function copyText(text) {
  navigator.clipboard.writeText(text);
  showMessage('Copied to clipboard!', 'success');
}


// Smooth scroll to features
function scrollToFeatures() {
  document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
}

// Add scroll animations
document.addEventListener('DOMContentLoaded', () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe elements for animation
  document.querySelectorAll('.feature-box, .template-card, .testimonial-card, .step').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
  });
});
