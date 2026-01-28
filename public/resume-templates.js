// Theme Switching
let currentTheme = 'blue';

document.addEventListener('DOMContentLoaded', () => {
    initializeThemes();
    setupThemeButtons();
});

function initializeThemes() {
    // Apply default theme to all templates
    const templates = document.querySelectorAll('.resume-preview');
    templates.forEach(template => {
        template.setAttribute('data-theme', currentTheme);
    });
}

function setupThemeButtons() {
    const themeButtons = document.querySelectorAll('.theme-btn');
    
    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            themeButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get theme
            const theme = button.getAttribute('data-theme');
            currentTheme = theme;
            
            // Apply theme to all templates
            applyTheme(theme);
        });
    });
}

function applyTheme(theme) {
    const templates = document.querySelectorAll('.resume-preview');
    
    templates.forEach(template => {
        template.setAttribute('data-theme', theme);
        
        // Apply CSS variables based on theme
        const resumePage = template.querySelector('.resume-page');
        if (resumePage) {
            resumePage.setAttribute('data-theme', theme);
        }
    });
    
    // Show notification
    showNotification(`Theme changed to ${theme}`, 'success');
}

// Template Actions
function useTemplate(templateId) {
    showNotification('Redirecting to resume builder...', 'info');
    
    // Store selected template in localStorage
    localStorage.setItem('selectedTemplate', templateId);
    localStorage.setItem('selectedTheme', currentTheme);
    
    // Redirect to main app
    setTimeout(() => {
        window.location.href = '/';
    }, 1000);
}

function downloadTemplate(templateId) {
    showNotification('Preparing PDF download...', 'info');
    
    // Get the template element
    const template = document.getElementById(templateId);
    const resumePage = template.querySelector('.resume-page');
    
    if (!resumePage) {
        showNotification('Template not found', 'error');
        return;
    }
    
    // Create a printable version
    const printWindow = window.open('', '_blank');
    const themeColors = getThemeColors(currentTheme);
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Resume - Download</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #2d3748;
                }
                
                .resume-page {
                    max-width: 8.5in;
                    margin: 0 auto;
                    padding: 0.5in;
                }
                
                .resume-header {
                    border-bottom: 3px solid ${themeColors.primary};
                    padding-bottom: 20px;
                    margin-bottom: 25px;
                }
                
                .resume-header.centered {
                    text-align: center;
                }
                
                .resume-name {
                    font-size: 2.5rem;
                    color: ${themeColors.primary};
                    letter-spacing: 2px;
                    margin-bottom: 5px;
                    font-weight: 700;
                }
                
                .resume-title {
                    font-size: 1.2rem;
                    color: #4a5568;
                    margin-bottom: 15px;
                    font-weight: 500;
                }
                
                .contact-info {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 15px;
                    font-size: 0.9rem;
                    color: #718096;
                }
                
                .contact-info i {
                    color: ${themeColors.primary};
                    margin-right: 5px;
                }
                
                .resume-section {
                    margin-bottom: 25px;
                }
                
                .section-title {
                    font-size: 1.1rem;
                    color: ${themeColors.primary};
                    letter-spacing: 1px;
                    margin-bottom: 12px;
                    padding-bottom: 5px;
                    border-bottom: 2px solid ${themeColors.light};
                    font-weight: 700;
                }
                
                .section-content {
                    color: #4a5568;
                    line-height: 1.7;
                    text-align: justify;
                }
                
                .experience-item {
                    margin-bottom: 20px;
                }
                
                .exp-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 10px;
                }
                
                .job-title {
                    font-size: 1.05rem;
                    color: #2d3748;
                    font-weight: 700;
                    margin-bottom: 3px;
                }
                
                .company {
                    color: #718096;
                    font-size: 0.95rem;
                    font-style: italic;
                }
                
                .date {
                    color: ${themeColors.primary};
                    font-weight: 600;
                    font-size: 0.9rem;
                    white-space: nowrap;
                }
                
                .achievements {
                    list-style: none;
                    padding-left: 0;
                }
                
                .achievements li {
                    padding-left: 20px;
                    position: relative;
                    margin-bottom: 8px;
                    color: #4a5568;
                    line-height: 1.6;
                }
                
                .achievements li:before {
                    content: "▸";
                    position: absolute;
                    left: 0;
                    color: ${themeColors.primary};
                    font-weight: bold;
                }
                
                .education-item {
                    margin-bottom: 15px;
                }
                
                .edu-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 5px;
                }
                
                .degree {
                    font-size: 1.05rem;
                    color: #2d3748;
                    font-weight: 700;
                    margin-bottom: 3px;
                }
                
                .school {
                    color: #718096;
                    font-size: 0.95rem;
                }
                
                .edu-details {
                    color: #4a5568;
                    font-size: 0.9rem;
                    line-height: 1.5;
                }
                
                .skills-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 10px;
                }
                
                .skill-category {
                    color: #4a5568;
                    line-height: 1.7;
                }
                
                .skill-category strong {
                    color: ${themeColors.primary};
                }
                
                .cert-list {
                    list-style: none;
                    padding-left: 0;
                }
                
                .cert-list li {
                    padding-left: 20px;
                    position: relative;
                    margin-bottom: 8px;
                    color: #4a5568;
                }
                
                .cert-list li:before {
                    content: "✓";
                    position: absolute;
                    left: 0;
                    color: ${themeColors.primary};
                    font-weight: bold;
                }
                
                @media print {
                    body {
                        margin: 0;
                    }
                    
                    .resume-page {
                        padding: 0.5in;
                    }
                }
            </style>
        </head>
        <body>
            ${resumePage.outerHTML}
            <script>
                window.onload = function() {
                    setTimeout(() => {
                        window.print();
                    }, 500);
                };
            </script>
        </body>
        </html>
    `);
    
    printWindow.document.close();
    
    showNotification('Opening print dialog...', 'success');
}

function previewTemplate(templateId) {
    const template = document.getElementById(templateId);
    const resumePage = template.querySelector('.resume-page');
    
    if (!resumePage) {
        showNotification('Template not found', 'error');
        return;
    }
    
    // Create full-screen preview
    const modal = document.createElement('div');
    modal.className = 'preview-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closePreview()"></div>
        <div class="modal-content">
            <button class="close-btn" onclick="closePreview()">
                <i class="fas fa-times"></i>
            </button>
            <div class="preview-container">
                ${resumePage.outerHTML}
            </div>
        </div>
    `;
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .preview-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
        }
        
        .modal-content {
            position: relative;
            z-index: 1001;
            max-width: 900px;
            max-height: 90vh;
            overflow-y: auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        
        .close-btn {
            position: sticky;
            top: 10px;
            right: 10px;
            float: right;
            width: 40px;
            height: 40px;
            background: #f44336;
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1.2rem;
            z-index: 1002;
            margin: 10px;
        }
        
        .close-btn:hover {
            background: #d32f2f;
        }
        
        .preview-container {
            padding: 40px;
        }
        
        .preview-container .resume-page {
            box-shadow: none;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Apply current theme to preview
    const previewResume = modal.querySelector('.resume-page');
    if (previewResume) {
        previewResume.setAttribute('data-theme', currentTheme);
    }
}

function closePreview() {
    const modal = document.querySelector('.preview-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

// Helper Functions
function getThemeColors(theme) {
    const themes = {
        blue: { primary: '#2196f3', light: '#e3f2fd' },
        grey: { primary: '#607d8b', light: '#eceff1' },
        green: { primary: '#4caf50', light: '#e8f5e9' },
        purple: { primary: '#9c27b0', light: '#f3e5f5' },
        teal: { primary: '#009688', light: '#e0f2f1' },
        orange: { primary: '#ff9800', light: '#fff3e0' }
    };
    
    return themes[theme] || themes.blue;
}

function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
            z-index: 2000;
            animation: slideIn 0.3s ease;
            font-weight: 600;
        }
        
        .notification.success {
            border-left: 4px solid #4caf50;
            color: #2e7d32;
        }
        
        .notification.error {
            border-left: 4px solid #f44336;
            color: #c62828;
        }
        
        .notification.info {
            border-left: 4px solid #2196f3;
            color: #1565c0;
        }
        
        @keyframes slideIn {
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
    
    if (!document.querySelector('style[data-notification]')) {
        style.setAttribute('data-notification', 'true');
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // ESC to close preview
    if (e.key === 'Escape') {
        closePreview();
    }
});