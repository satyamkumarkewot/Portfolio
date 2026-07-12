/**
 * Satyam Kumar Kewot - Portfolio Interactions
 * Premium Frontend JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize All Sub-Systems
    initParticles();
    initTypingEffect();
    initMouseGlow();
    initTiltEffect();
    initStatsCounter();
    initButtonRipples();
    initMobileMenu();
    initScrollNavbar();
    initScrollReveal();
    initScrollProgress();
    initScrollSpy();
    initCustomCursor();
    initMagneticButtons();
    initBackToTop();
});

// Window load listener for loading screen with fallback
const hideLoadingScreen = () => {
    const loader = document.getElementById('loading-screen');
    if (loader && !loader.classList.contains('fade-out')) {
        loader.classList.add('fade-out');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 800); // Wait for 0.8s opacity/visibility transition
    }
};

window.addEventListener('load', () => {
    setTimeout(hideLoadingScreen, 500); // Small delay for premium feel
});

// Fallback: Force hide loader after 2.5 seconds in case of slow CDN assets
setTimeout(hideLoadingScreen, 2500);

/* ==========================================================================
   STICKY NAVBAR ON SCROLL
   ========================================================================== */
function initScrollNavbar() {
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/* ==========================================================================
   MOBILE MENU TOGGLE
   ========================================================================== */
function initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        navbar.classList.toggle('menu-open');
    });

    // Close menu when clicking link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            navbar.classList.remove('menu-open');
            
            // Set active class
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

/* ==========================================================================
   CANVAS PARTICLES SYSTEM
   ========================================================================== */
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    let animationId = null;
    const maxDistance = 110;
    
    const mouse = {
        x: null,
        y: null,
        radius: 130
    };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.7;
            this.vy = (Math.random() - 0.5) * 0.7;
            this.size = Math.random() * 2 + 1;
            this.color = Math.random() > 0.5 ? '#00F0FF' : '#8A2BE2';
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 5;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.shadowBlur = 0; // reset
        }

        update() {
            // Screen boundaries
            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

            // Move
            this.x += this.vx;
            this.y += this.vy;

            // Mouse interaction (repel effect)
            if (mouse.x !== null && mouse.y !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    this.x += Math.cos(angle) * force * 1.5;
                    this.y += Math.sin(angle) * force * 1.5;
                }
            }
        }
    }

    function setup() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Dynamic density
        const count = Math.floor((canvas.width * canvas.height) / 16000);
        particles = [];
        for (let i = 0; i < Math.min(count, 100); i++) {
            particles.push(new Particle());
        }
    }

    function connect() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxDistance) {
                    const alpha = (maxDistance - dist) / maxDistance * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        connect();
        animationId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        cancelAnimationFrame(animationId);
        setup();
        animate();
    });

    setup();
    animate();
}

/* ==========================================================================
   DYNAMIC TYPING EFFECT
   ========================================================================== */
function initTypingEffect() {
    const words = [
        "Full Stack Developer",
        "Python Developer",
        "Data Analytics Enthusiast"
    ];
    
    const target = document.getElementById('typingTarget');
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            target.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 40; // faster deleting
        } else {
            target.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100; // standard typing speed
        }

        // Handle states
        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeSpeed = 1800; // Pause at end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 400; // Pause before typing next word
        }

        setTimeout(type, typeSpeed);
    }

    // Start
    setTimeout(type, 800);
}

/* ==========================================================================
   MOUSE GLOW / SPOTLIGHT EFFECT
   ========================================================================== */
function initMouseGlow() {
    const mouseGlow = document.getElementById('mouseGlow');
    
    // Smooth mouse follow using requestAnimationFrame
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let glowX = mouseX;
    let glowY = mouseY;
    
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function updateGlow() {
        // Linear interpolation (lerp) for smooth easing
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        
        mouseGlow.style.left = `${glowX}px`;
        mouseGlow.style.top = `${glowY}px`;
        
        requestAnimationFrame(updateGlow);
    }
    
    updateGlow();
}

/* ==========================================================================
   3D CARD TILT EFFECT
   ========================================================================== */
function initTiltEffect() {
    const targets = document.querySelectorAll('.tilt-target');

    // Skip tilt on mobile touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    targets.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x coordinate within client
            const y = e.clientY - rect.top;  // y coordinate within client
            
            // Calculate normalized tilt (between -0.5 and 0.5)
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const tiltX = (y - centerY) / centerY; 
            const tiltY = (centerX - x) / centerX; 

            // Max tilt degrees
            const maxTilt = 10; 
            
            card.style.transform = `perspective(1000px) rotateX(${tiltX * maxTilt}deg) rotateY(${tiltY * maxTilt}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        });
    });
}

/* ==========================================================================
   STATS COUNTER ANIMATION
   ========================================================================== */
function initStatsCounter() {
    const cards = document.querySelectorAll('.stat-card[data-stat-target]');
    
    const countTo = (element, target) => {
        let current = 0;
        const duration = 1500; // ms
        const stepTime = Math.abs(Math.floor(duration / target));
        
        const timer = setInterval(() => {
            current += 1;
            element.textContent = current;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            }
        }, stepTime || 100);
    };

    // Trigger stats counter on viewport intersection
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetNum = parseInt(entry.target.getAttribute('data-stat-target'));
                const counterSpan = entry.target.querySelector('.counter');
                if (counterSpan && counterSpan.textContent === '0') {
                    countTo(counterSpan, targetNum);
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => observer.observe(card));
}

/* ==========================================================================
   BUTTON RIPPLE EFFECT
   ========================================================================== */
function initButtonRipples() {
    const buttons = document.querySelectorAll('.ripple-btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Get click coordinates relative to the button
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Create ripple span
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-span');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            // Append to button
            this.appendChild(ripple);

            // Remove after animation completes
            ripple.addEventListener('animationend', () => {
                ripple.remove();
            });
        });
    });
}

/* ==========================================================================
   SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   SCROLL PROGRESS BAR
   ========================================================================== */
function initScrollProgress() {
    const progress = document.getElementById('scroll-progress');
    if (!progress) return;
    window.addEventListener('scroll', () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percentage = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
        progress.style.width = `${percentage}%`;
    });
}

/* ==========================================================================
   SCROLL SPY NAVBAR HIGHLIGHTS
   ========================================================================== */
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id], main[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPos = window.scrollY + 200; // offset for nav bar height & trigger line
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${current}` || (current === 'home' && href === '#')) {
                link.classList.add('active');
            }
        });
    });
}

/* ==========================================================================
   CUSTOM CURSOR TRAIL
   ========================================================================== */
function initCustomCursor() {
    const cursor = document.getElementById('customCursor');
    const cursorDot = document.getElementById('customCursorDot');
    if (!cursor || !cursorDot) return;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let isMoving = false;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMoving = true;
        
        // Instant dot movement
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
        cursorDot.style.opacity = '1';
        cursor.style.opacity = '1';
    });

    // LERP for smooth outer circle trail
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover state expanding
    const updateHoverables = () => {
        const hoverables = document.querySelectorAll('a, button, .tilt-target, .tech-badge, input, textarea, .social-icon, .nav-link');
        hoverables.forEach(el => {
            // Remove previous to avoid duplicates if re-called
            el.removeEventListener('mouseenter', addHoverClass);
            el.removeEventListener('mouseleave', removeHoverClass);
            
            el.addEventListener('mouseenter', addHoverClass);
            el.addEventListener('mouseleave', removeHoverClass);
        });
    };

    function addHoverClass() {
        cursor.classList.add('hover');
    }
    function removeHoverClass() {
        cursor.classList.remove('hover');
    }

    updateHoverables();
    
    // Periodically run in case dynamic elements are loaded/revealed
    setInterval(updateHoverables, 2000);
}

/* ==========================================================================
   MAGNETIC BUTTON EFFECT
   ========================================================================== */
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-outline, .social-icon, .back-to-top-btn, .logo');
    
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return; // Skip on mobile

    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const btnX = rect.left + rect.width / 2;
            const btnY = rect.top + rect.height / 2;
            
            const distX = e.clientX - btnX;
            const distY = e.clientY - btnY;
            
            // Subtle magnetic pull (translation)
            btn.style.transform = `translate(${distX * 0.25}px, ${distY * 0.25}px)`;
            btn.style.transition = 'transform 0.1s ease-out';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px)';
            btn.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)';
        });
    });
}

/* ==========================================================================
   BACK TO TOP FLOATING BUTTON
   ========================================================================== */
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    });
    
    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
