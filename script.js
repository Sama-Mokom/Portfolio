/* ==========================================================================
   DARK MODE TOGGLE
   ========================================================================== */

const toggle = document.getElementById('theme-toggle');
const themeLabel = document.getElementById('theme-label');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme');

function setTheme(dark) {
    document.body.classList.toggle('dark', dark);
    themeLabel.textContent = dark ? '' : '';
    localStorage.setItem('theme', dark ? 'dark' : 'light');

    // Add smooth transition when theme changes
    document.body.style.transition = 'background 0.3s ease, color 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
}

// Initialize theme
if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    toggle.checked = true;
    setTheme(true);
}

toggle.addEventListener('click', () => {
    setTheme(toggle.checked);
});

/* ==========================================================================
   SCROLL REVEAL ANIMATIONS
   ========================================================================== */

// Add 'reveal' class to elements that should animate on scroll
function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        '.project-card, .experience-card, .skill-category, .resume-section, .about-section, .contact-section'
    );

    // Add initial hidden state
    revealElements.forEach((el, index) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${index * 0.1}s`;
    });

    // Intersection Observer for scroll reveal
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initScrollReveal);

/* ==========================================================================
   SMOOTH NAVIGATION
   ========================================================================== */

// Smooth scroll to sections
function initSmoothNavigation() {
    // Get all anchor links that point to sections
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            // Skip empty hashes or just '#'
            if (!href || href === '#') return;

            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                e.preventDefault();

                // Smooth scroll to target
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Update URL without jumping
                history.pushState(null, null, href);
            }
        });
    });
}

// Initialize smooth navigation
document.addEventListener('DOMContentLoaded', initSmoothNavigation);

/* ==========================================================================
   ACTIVE SECTION HIGHLIGHTING
   ========================================================================== */

function initActiveSectionTracking() {
    const sections = document.querySelectorAll('section[id]');

    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-100px 0px -66%'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Update URL hash without scrolling
                const id = entry.target.getAttribute('id');
                if (id) {
                    history.replaceState(null, null, `#${id}`);
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

// Initialize active section tracking
document.addEventListener('DOMContentLoaded', initActiveSectionTracking);

/* ==========================================================================
   CARD HOVER ENHANCEMENTS
   ========================================================================== */

// Add interactive hover effects to project cards
function initCardInteractions() {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Initialize card interactions
document.addEventListener('DOMContentLoaded', initCardInteractions);

/* ==========================================================================
   KEYBOARD ACCESSIBILITY
   ========================================================================== */

// Ensure keyboard navigation works properly
document.addEventListener('DOMContentLoaded', () => {
    // Add focus-visible support for better keyboard navigation
    document.body.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });

    document.body.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-nav');
    });
});

/* ==========================================================================
   PERFORMANCE OPTIMIZATION
   ========================================================================== */

// Reduce animations on low-power devices
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--transition-fast', '0ms');
    document.documentElement.style.setProperty('--transition-base', '0ms');
    document.documentElement.style.setProperty('--transition-slow', '0ms');
}
