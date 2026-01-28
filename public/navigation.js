// Navigation Helper for AI Resume Builder
// Provides smooth page transitions and navigation management

(function() {
    'use strict';

    // Add loading overlay to body
    function createLoadingOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'page-loading';
        overlay.innerHTML = '<div class="spinner"></div>';
        document.body.appendChild(overlay);
        return overlay;
    }

    // Show loading state
    function showLoading() {
        let overlay = document.querySelector('.page-loading');
        if (!overlay) {
            overlay = createLoadingOverlay();
        }
        setTimeout(() => overlay.classList.add('active'), 10);
    }

    // Hide loading state
    function hideLoading() {
        const overlay = document.querySelector('.page-loading');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }

    // Smooth navigation function
    window.navigateTo = function(url, delay = 300) {
        showLoading();
        setTimeout(() => {
            window.location.href = url;
        }, delay);
    };

    // Handle all "Get Started" buttons
    document.addEventListener('DOMContentLoaded', function() {
        // Add click handlers to all Get Started buttons
        const getStartedButtons = document.querySelectorAll('[href="dashboard.html"], [href="/dashboard.html"]');
        getStartedButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                navigateTo('/dashboard.html');
            });
        });

        // Add click handler to logout buttons
        const logoutButtons = document.querySelectorAll('#logout-btn, [onclick*="logout"]');
        logoutButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                if (this.id === 'logout-btn' || this.getAttribute('onclick')?.includes('logout')) {
                    e.preventDefault();
                    handleLogout();
                }
            });
        });

        // Hide loading overlay after page loads
        hideLoading();
    });

    // Handle logout
    function handleLogout() {
        // Clear session
        localStorage.removeItem('token');
        
        // Show success message if function exists
        if (typeof showMessage === 'function') {
            showMessage('Logged out successfully!', 'success');
        }
        
        // Navigate to landing page
        navigateTo('/');
    }

    // Add page transition on load
    document.addEventListener('DOMContentLoaded', function() {
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        }, 10);
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', function() {
        showLoading();
        setTimeout(() => {
            location.reload();
        }, 300);
    });

})();
