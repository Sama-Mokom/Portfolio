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

/* ==========================================================================
   PROJECT MODAL
   ========================================================================== */

const projectDetails = {
    'music-platform': {
        title: 'Cameroon Music Industry Platform',
        description: `
            <p>A comprehensive full-stack platform designed to connect artists, fans, and promoters in the Cameroonian music industry. This platform addresses the fragmentation in the music industry by providing a centralized hub for discovery, booking, and transactions.</p>

            <h3>Key Features</h3>
            <ul>
                <li><strong>Authentication & Security:</strong> JWT-based authentication with secure token management and role-based access control</li>
                <li><strong>Artist Profiles:</strong> Customizable profiles with portfolio showcases, media galleries, and bio sections</li>
                <li><strong>Music Upload System:</strong> Advanced upload functionality with audio fingerprinting for copyright protection</li>
                <li><strong>Booking System:</strong> Comprehensive booking platform with calendar integration and availability management</li>
                <li><strong>Escrow Payments:</strong> Secure payment processing with escrow functionality to protect both artists and promoters</li>
                <li><strong>Digital Wallet:</strong> Integrated wallet system for seamless transactions and earnings management</li>
                <li><strong>Search & Discovery:</strong> Advanced search with filters for genre, location, and availability</li>
                <li><strong>Real-time Notifications:</strong> Redis-powered notification system for bookings and updates</li>
            </ul>

            <h3>Technical Implementation</h3>
            <ul>
                <li>Built with Next.js 14 using the App Router for optimal performance and SEO</li>
                <li>TypeScript throughout for type safety and better developer experience</li>
                <li>NestJS backend with modular architecture and dependency injection</li>
                <li>MySQL database with Prisma ORM for type-safe database queries</li>
                <li>Redis for caching and real-time features</li>
                <li>TailwindCSS for responsive, modern UI design</li>
                <li>RESTful API architecture with comprehensive error handling</li>
            </ul>
        `,
        techStack: ['Next.js 14', 'TypeScript', 'NestJS', 'MySQL', 'Prisma', 'Redis', 'JWT', 'TailwindCSS'],
        github: 'https://github.com/Sama-Mokom/cameroon-music-platform',
        live: null,
        comingSoon: true
    },
    'quick-shop': {
        title: 'Quick Shop',
        description: `
            <p>A small-scale e-commerce platform that helps both vendors and buyers manage online sales efficiently. This platform provides an intuitive interface for product management, shopping cart functionality, and order processing.</p>

            <h3>Key Features</h3>
            <ul>
                <li><strong>Product Catalog:</strong> Browse and search products with category filtering</li>
                <li><strong>Shopping Cart:</strong> Add, remove, and update items with real-time price calculations</li>
                <li><strong>Vendor Dashboard:</strong> Manage products, inventory, and view sales analytics</li>
                <li><strong>Order Management:</strong> Track orders from placement to delivery</li>
                <li><strong>User Authentication:</strong> Secure login for both buyers and vendors</li>
                <li><strong>Responsive Design:</strong> Optimized for desktop and mobile devices</li>
            </ul>

            <h3>Technical Implementation</h3>
            <ul>
                <li>Frontend built with HTML5, CSS3, and vanilla JavaScript</li>
                <li>Node.js backend with Express for API routes</li>
                <li>Session management for user authentication</li>
                <li>Database integration for product and order storage</li>
            </ul>
        `,
        techStack: ['HTML', 'CSS', 'JavaScript', 'Node.js'],
        github: 'https://github.com/Sama-Mokom/my-ecommerce-app',
        live: 'https://x-clussive-shop.onrender.com/'
    },
    'kitchen-sync': {
        title: 'Kitchen Sync',
        description: `
            <p>A web-based restaurant management system that enables restaurant owners to monitor operations, track orders, and manage inventory in real-time. This application streamlines restaurant operations and improves efficiency.</p>

            <h3>Key Features</h3>
            <ul>
                <li><strong>Real-time Order Tracking:</strong> Monitor orders from placement to completion</li>
                <li><strong>Inventory Management:</strong> Track stock levels and receive low-stock alerts</li>
                <li><strong>Menu Management:</strong> Easy-to-use interface for updating menu items and pricing</li>
                <li><strong>Sales Analytics:</strong> View daily, weekly, and monthly sales reports</li>
                <li><strong>Staff Management:</strong> Track employee schedules and performance</li>
                <li><strong>Table Management:</strong> Visual table layout for managing reservations and seating</li>
            </ul>

            <h3>Technical Implementation</h3>
            <ul>
                <li>React for building dynamic and interactive UI components</li>
                <li>Firebase for real-time database and authentication</li>
                <li>Cloud Firestore for scalable data storage</li>
                <li>Responsive design with CSS for mobile and tablet support</li>
                <li>Real-time updates using Firebase listeners</li>
            </ul>
        `,
        techStack: ['React', 'CSS', 'JavaScript', 'Firebase'],
        github: 'https://github.com/Sama-Mokom/KitchenSync',
        live: 'https://kitchen-sync-1.netlify.app/'
    },
    'portfolio': {
        title: 'Portfolio Website',
        description: `
            <p>A responsive personal portfolio website showcasing projects, skills, and experience. Built with a focus on accessibility, performance, and modern web design principles.</p>

            <h3>Key Features</h3>
            <ul>
                <li><strong>Dark Mode Support:</strong> Toggle between light and dark themes with preference persistence</li>
                <li><strong>Responsive Design:</strong> Optimized layouts for mobile, tablet, and desktop devices</li>
                <li><strong>Accessibility:</strong> WCAG compliant with keyboard navigation and screen reader support</li>
                <li><strong>Performance Optimized:</strong> Fast loading times with optimized images and minimal dependencies</li>
                <li><strong>SEO Friendly:</strong> Proper meta tags, structured data, and semantic HTML</li>
                <li><strong>Interactive Animations:</strong> Smooth scroll reveals and hover effects</li>
                <li><strong>Project Modals:</strong> Detailed project information in accessible modal dialogs</li>
            </ul>

            <h3>Technical Implementation</h3>
            <ul>
                <li>Pure HTML5 with semantic markup for better SEO and accessibility</li>
                <li>CSS3 with custom properties for theming and maintainability</li>
                <li>Vanilla JavaScript for interactions without framework overhead</li>
                <li>Local storage for theme persistence</li>
                <li>Intersection Observer API for scroll animations</li>
                <li>Git for version control and GitHub Pages for deployment</li>
            </ul>
        `,
        techStack: ['HTML5', 'CSS3', 'JavaScript', 'Git'],
        github: 'https://github.com/Sama-Mokom',
        live: '#hero'
    }
};

function initProjectModals() {
    const modal = document.getElementById('project-modal');
    const modalTitle = document.querySelector('.modal-project-title');
    const modalDetails = document.querySelector('.modal-project-details');
    const modalClose = document.querySelector('.modal-close');
    const modalOverlay = document.querySelector('.modal-overlay');

    // Get all view details buttons
    const viewDetailsButtons = document.querySelectorAll('.view-details-btn');

    // Open modal function
    function openModal(projectId) {
        const project = projectDetails[projectId];
        if (!project) return;

        // Populate modal content
        modalTitle.textContent = project.title;
        modalDetails.innerHTML = `
            ${project.description}

            <h3>Technologies Used</h3>
            <div class="modal-tech-stack">
                ${project.techStack.map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
            </div>

            <div class="modal-project-links">
                <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="btn-secondary">
                    <span class="link-icon">⚡</span> View on GitHub
                </a>
                ${project.live && !project.comingSoon ?
                    `<a href="${project.live}" ${project.live.startsWith('#') ? '' : 'target="_blank" rel="noopener noreferrer"'} class="btn-primary">
                        <span class="link-icon">🔗</span> ${project.live.startsWith('#') ? "You're here!" : 'Live Demo'}
                    </a>` :
                    project.comingSoon ?
                    `<a href="#" class="btn-primary btn-disabled">
                        <span class="link-icon">🚧</span> Coming Soon
                    </a>` : ''
                }
            </div>
        `;

        // Show modal
        modal.removeAttribute('hidden');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling

        // Focus on close button for accessibility
        setTimeout(() => modalClose.focus(), 100);
    }

    // Close modal function
    function closeModal() {
        modal.setAttribute('aria-hidden', 'true');
        setTimeout(() => {
            modal.setAttribute('hidden', '');
            document.body.style.overflow = ''; // Restore scrolling
        }, 200);
    }

    // Add click listeners to view details buttons
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const projectCard = button.closest('.project-card');
            const projectId = projectCard.getAttribute('data-project');
            openModal(projectId);
        });
    });

    // Close modal on close button click
    modalClose.addEventListener('click', closeModal);

    // Close modal on overlay click
    modalOverlay.addEventListener('click', closeModal);

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
            closeModal();
        }
    });
}

// Initialize modal functionality
document.addEventListener('DOMContentLoaded', initProjectModals);
