/* ========================================
   ROMANTIC GREETING CARD WEBSITE SCRIPTS
   ======================================== */

/* ========================================
   CUSTOMIZATION: TYPING MESSAGE
   ========================================
   Edit this string to change the romantic 
   message that appears with the typing effect.
*/
const typingMessage = `Every moment with you is a treasure I hold dear in my heart. 
Your love has transformed my world into something beautiful beyond words. 
You are my sunshine, my happiness, my everything. 
Happy Women's Day, my love! 💕`;

/* ========================================
   CUSTOMIZATION: TYPING SPEED
   ========================================
   Adjust this value (in milliseconds) to 
   change how fast characters appear.
*/
const typingSpeed = 40;

/* ========================================
   DOM ELEMENTS
   ======================================== */
const envelope = document.getElementById('envelope');
const heroSection = document.getElementById('hero');
const mainContent = document.querySelector('.main-content');
const heartsCanvas = document.getElementById('heartsCanvas');
const bgMusic = document.getElementById('bgMusic');
const typingTextElement = document.getElementById('typing-text');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCounter = document.getElementById('lightboxCounter');
const lightboxDescription = document.getElementById('lightboxDescription');
const galleryItems = document.querySelectorAll('.gallery-item');
const galleryImages = document.querySelectorAll('.gallery-item img');
const progressBar = document.getElementById('progressBar');
const slideshowBtn = document.getElementById('slideshowBtn');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const slideshowLabel = document.getElementById('slideshowLabel');
const themeToggle = document.getElementById('themeToggle');
const themeToggleIcon = document.getElementById('themeToggleIcon');
const themeToggleLabel = document.getElementById('themeToggleLabel');
const themeFadeOverlay = document.getElementById('themeFadeOverlay');

/* ========================================
   LIGHT / DARK THEME TOGGLE
   ======================================== */
const THEME_STORAGE_KEY = 'womens-day-theme';
const THEME_TRANSITION_MS = 800;
let isThemeTransitioning = false;

// Check if View Transitions API is supported
const supportsViewTransitions = 'startViewTransition' in document;

function getThemeBackground(theme) {
    if (theme === 'dark') {
        return 'linear-gradient(45deg, #1b1423, #2d2238)';
    }
    return 'linear-gradient(45deg, #ffd6e7, #ffffff)';
}

function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.body.classList.toggle('theme-dark', isDark);

    if (themeToggle) {
        themeToggle.setAttribute('aria-pressed', String(isDark));
    }

    if (themeToggleIcon) {
        themeToggleIcon.textContent = isDark ? '☀️' : '🌙';
    }

    if (themeToggleLabel) {
        themeToggleLabel.textContent = isDark ? 'Light' : 'Dark';
    }
}

function toggleThemeWithTransition() {
    if (isThemeTransitioning) return;

    const nextTheme = document.body.classList.contains('theme-dark') ? 'light' : 'dark';
    const currentTheme = document.body.classList.contains('theme-dark') ? 'dark' : 'light';
    isThemeTransitioning = true;

    // Modern approach: Use View Transitions API
    if (supportsViewTransitions) {
        document.documentElement.classList.add('theme-transitioning');
        
        const transition = document.startViewTransition(() => {
            applyTheme(nextTheme);
        });

        transition.finished.finally(() => {
            document.documentElement.classList.remove('theme-transitioning');
            isThemeTransitioning = false;
        });
    }
    // Fallback: Use clip-path animation overlay
    else if (themeFadeOverlay) {
        themeFadeOverlay.style.background = getThemeBackground(currentTheme);
        themeFadeOverlay.classList.remove('active');
        void themeFadeOverlay.offsetWidth;
        themeFadeOverlay.classList.add('active');

        applyTheme(nextTheme);

        setTimeout(() => {
            themeFadeOverlay.classList.remove('active');
            isThemeTransitioning = false;
        }, THEME_TRANSITION_MS);
    }
    // Simple fallback: Instant switch
    else {
        applyTheme(nextTheme);
        isThemeTransitioning = false;
    }

    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
}

function initThemeToggle() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    applyTheme(initialTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleThemeWithTransition);
    }
}

/* ========================================
   ENVELOPE CLICK HANDLER (OVERLAY REMOVAL)
   ========================================
   Logic flow:
   1. Click envelope
   2. Open envelope animation (0.8s)
   3. Add "closing" class to hero section
   4. CSS animation translateY(-100vh) (0.8s)
   5. Overlay disappears
   6. Page content visible behind
   7. Trigger cinematic reveal effect
   8. Start floating hearts animation
*/
let envelopeOpened = false;
let typingStarted = false;

envelope.addEventListener('click', function() {
    if (envelopeOpened) return;
    
    envelopeOpened = true;
    
    // Add opened class to trigger envelope opening animation
    envelope.classList.add('opened');
    
    // Start background music
    playBackgroundMusic();
    
    // After envelope opening animation completes (0.8s),
    // trigger the overlay exit animation
    setTimeout(() => {
        // Add closing class to trigger overlay slide-up animation
        heroSection.classList.add('closing');
        
        // Trigger cinematic reveal effect on main content
        // Removes blur, zoom, and opacity transition
        mainContent.classList.remove('cinematic-hidden');
        mainContent.classList.add('cinematic-visible');
        
        // Start floating hearts animation
        startFloatingHearts();
        
        // Start typing animation immediately as overlay begins to close
        if (!typingStarted) {
            startTypingAnimation();
        }
        
        // After overlay animation completes (0.8s),
        // hide the overlay and scroll to next section
        setTimeout(() => {
            heroSection.classList.add('hidden');
            
            // Smooth scroll to message section with delay for better UX
            setTimeout(() => {
                const messageSection = document.getElementById('message');
                if (messageSection) {
                    messageSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 300);
        }, 800);
    }, 800);
});

/* ========================================
   BACKGROUND MUSIC PLAYER
   ======================================== */
function playBackgroundMusic() {
    if (bgMusic) {
        bgMusic.volume = 0.5; // Set volume to 50%
        bgMusic.play().catch(error => {
            // Handle autoplay restrictions
            console.log('Audio playback requires user interaction:', error);
        });
    }
}

/* ========================================
   TYPING ANIMATION
   ======================================== */
let charIndex = 0;

function startTypingAnimation() {
    typingStarted = true;
    typingTextElement.textContent = '';
    typeCharacter();
}

function typeCharacter() {
    if (charIndex < typingMessage.length) {
        typingTextElement.textContent += typingMessage.charAt(charIndex);
        charIndex++;
        setTimeout(typeCharacter, typingSpeed);
    }
}

/* ========================================
   CINEMATIC GALLERY WITH LIGHTBOX
   ========================================
   Features:
   - Stagger reveal animation on scroll
   - Fullscreen lightbox viewer
   - Image navigation (prev/next)
   - Keyboard support (arrows, ESC)
   - Sparkle hover effect
*/

let currentLightboxIndex = 0;
const totalImages = galleryImages.length;

// ====================================
// STAGGER REVEAL ANIMATION
// ====================================
// CUSTOMIZATION: Adjust stagger delay here
const STAGGER_DELAY = 200; // milliseconds between each item

// Intersection Observer for gallery stagger animation
const galleryObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Trigger stagger animation
            const items = entry.target.querySelectorAll('.gallery-item');
            items.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('reveal');
                }, index * STAGGER_DELAY);
            });
            
            // Unobserve after animation triggered
            galleryObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Observe the gallery container
const galleryContainer = document.getElementById('gallery-container');
if (galleryContainer) {
    galleryObserver.observe(galleryContainer);
}

// ====================================
// LIGHTBOX FUNCTIONALITY
// ====================================

// Initialize gallery click handlers
galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    if (img) {
        img.addEventListener('click', () => {
            openLightbox(index);
        });
    }
});

function openLightbox(index) {
    currentLightboxIndex = index;
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function navigateLightbox(direction) {
    currentLightboxIndex += direction;
    
    // Wrap around
    if (currentLightboxIndex < 0) {
        currentLightboxIndex = totalImages - 1;
    } else if (currentLightboxIndex >= totalImages) {
        currentLightboxIndex = 0;
    }
    
    updateLightboxImage();
}

function updateLightboxImage() {
    const currentImage = galleryImages[currentLightboxIndex];
    lightboxImage.src = currentImage.src;
    lightboxImage.alt = currentImage.alt;
    lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${totalImages}`;

    if (lightboxDescription) {
        const description = currentImage.dataset.description || currentImage.alt || '';
        lightboxDescription.textContent = description;
    }
}

// Keyboard navigation for lightbox
document.addEventListener('keydown', function(e) {
    if (!lightbox.classList.contains('active')) return;
    
    switch(e.key) {
        case 'Escape':
            closeLightbox();
            break;
        case 'ArrowLeft':
            navigateLightbox(-1);
            break;
        case 'ArrowRight':
            navigateLightbox(1);
            break;
    }
});

// ====================================
// AUTOMATIC SLIDESHOW MODE
// ====================================
// CUSTOMIZATION: Slideshow interval time
const SLIDESHOW_INTERVAL = 3000; // milliseconds (3 seconds)

let slideshowActive = false;
let slideshowTimer = null;

function toggleSlideshow() {
    slideshowActive = !slideshowActive;
    
    if (slideshowActive) {
        startSlideshow();
        slideshowBtn.classList.add('active');
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
        slideshowLabel.textContent = 'Playing...';
    } else {
        stopSlideshow();
        slideshowBtn.classList.remove('active');
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        slideshowLabel.textContent = 'Slideshow';
    }
}

function startSlideshow() {
    if (slideshowTimer) clearInterval(slideshowTimer);
    
    slideshowTimer = setInterval(() => {
        // Add crossfade animation
        lightboxImage.classList.add('crossfade');
        setTimeout(() => {
            lightboxImage.classList.remove('crossfade');
        }, 400);
        
        navigateLightbox(1);
    }, SLIDESHOW_INTERVAL);
}

function stopSlideshow() {
    if (slideshowTimer) {
        clearInterval(slideshowTimer);
        slideshowTimer = null;
    }
}

// Stop slideshow when lightbox closes
const originalCloseLightbox = closeLightbox;
closeLightbox = function() {
    stopSlideshow();
    slideshowActive = false;
    slideshowBtn.classList.remove('active');
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
    slideshowLabel.textContent = 'Slideshow';
    originalCloseLightbox();
};

// ====================================
// SPARKLE HOVER EFFECT
// ====================================
// CUSTOMIZATION: Adjust sparkle parameters
const SPARKLE_COUNT = 7; // Number of sparkles per hover
const SPARKLE_DURATION = 700; // milliseconds

galleryItems.forEach(item => {
    const img = item.querySelector('img');
    
    if (img) {
        img.addEventListener('mouseenter', function(e) {
            createSparkles(item);
        });
    }
});

function createSparkles(container) {
    const rect = container.getBoundingClientRect();
    
    for (let i = 0; i < SPARKLE_COUNT; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            
            // Random position around the edges
            const edge = Math.floor(Math.random() * 4);
            let x, y;
            
            switch(edge) {
                case 0: // top
                    x = Math.random() * rect.width;
                    y = Math.random() * 10;
                    break;
                case 1: // right
                    x = rect.width - Math.random() * 10;
                    y = Math.random() * rect.height;
                    break;
                case 2: // bottom
                    x = Math.random() * rect.width;
                    y = rect.height - Math.random() * 10;
                    break;
                case 3: // left
                    x = Math.random() * 10;
                    y = Math.random() * rect.height;
                    break;
            }
            
            sparkle.style.left = x + 'px';
            sparkle.style.top = y + 'px';
            
            // Random size between 3px and 6px
            const size = Math.random() * 3 + 3;
            sparkle.style.width = size + 'px';
            sparkle.style.height = size + 'px';
            
            // Color variations (white, pink, gold)
            const colors = [
                'rgba(255, 255, 255, 0.9)',
                'rgba(255, 182, 193, 0.9)',
                'rgba(255, 215, 0, 0.9)',
                'rgba(255, 192, 203, 0.9)'
            ];
            sparkle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            sparkle.style.boxShadow = '0 0 8px currentColor';
            
            container.appendChild(sparkle);
            
            // Remove after animation completes
            setTimeout(() => {
                sparkle.remove();
            }, SPARKLE_DURATION);
        }, i * 50); // Stagger sparkle appearance
    }
}

/* ========================================
   INTERSECTION OBSERVER FOR REVEAL ANIMATIONS
   ========================================
   Supports multiple animation types:
   - .fade-in: default fade + slide up
   - .reveal-text: text fade + slide up
   - .reveal-slide-left: images slide from left
   - .reveal-drop: highlights drop from top
*/

// Create a unified observer for all reveal animation types
const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Start typing if message section becomes visible and envelope was opened
            if (entry.target.closest('.message-section') && envelopeOpened && !typingStarted) {
                setTimeout(() => {
                    startTypingAnimation();
                }, 300);
            }
            
            // Optionally unobserve after animation (uncomment if desired)
            // observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
});

// Observe all elements with reveal animation classes
const revealElements = document.querySelectorAll('.fade-in, .reveal-text, .reveal-slide-left, .reveal-drop, .reveal-delayed, .reveal-letter-content, .reveal-stage-2, .reveal-stage-3');
revealElements.forEach(element => {
    revealObserver.observe(element);
});

/* ========================================
   GALLERY IMAGE ERROR HANDLING
   ========================================
   If an image fails to load, this creates
   a placeholder with a romantic gradient.
*/
document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('error', function() {
        // Create a placeholder for missing images
        this.style.background = 'linear-gradient(135deg, #ffe4ec, #ffd6e7)';
        this.style.minHeight = '200px';
        this.alt = 'Image placeholder';
    });
});

/* ========================================
   SMOOTH SCROLL POLYFILL (optional)
   ======================================== */
// Adds smooth scroll support for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    // Basic smooth scroll fallback
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ========================================
   INITIALIZATION
   ======================================== */
document.addEventListener('DOMContentLoaded', function() {
    console.log('💕 Romantic Greeting Card Website Loaded');
    console.log('Click the envelope to begin the experience!');

    // Initialize light/dark theme based on user preference
    initThemeToggle();
    
    // Initialize scroll progress bar
    updateScrollProgress();
});

/* ========================================
   ROMANTIC SCROLL PROGRESS BAR
   ========================================
   Updates the progress bar as user scrolls.
*/
function updateScrollProgress() {
    // ====================================
    // Scroll percentage calculation:
    // scrollTop = how far scrolled from top
    // documentHeight = total scrollable height
    // viewportHeight = visible window height
    // progress = scrollTop / (documentHeight - viewportHeight)
    // ====================================
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const documentHeight = document.documentElement.scrollHeight;
    const viewportHeight = document.documentElement.clientHeight;
    
    // Calculate scroll percentage (0 to 100)
    const scrollPercentage = (scrollTop / (documentHeight - viewportHeight)) * 100;
    
    // Update progress bar width
    if (progressBar) {
        progressBar.style.width = scrollPercentage + '%';
    }
}

// Listen for scroll events
window.addEventListener('scroll', updateScrollProgress);

// Update on window resize
window.addEventListener('resize', updateScrollProgress);

/* ========================================
   FLOATING HEARTS BACKGROUND ANIMATION
   ========================================
   Creates a subtle romantic animation where
   small hearts float upward in the background
   after the envelope overlay disappears.
*/

// Heart particle class
class HeartParticle {
    constructor(canvasWidth, canvasHeight) {
        // ====================================
        // CUSTOMIZATION: Heart Properties
        // ====================================
        // Adjust these ranges for different effects
        
        // Random horizontal position
        this.x = Math.random() * canvasWidth;
        
        // Start from bottom or slightly below
        this.y = canvasHeight + Math.random() * 100;
        
        // Size between 6px and 20px
        this.size = Math.random() * 14 + 6;
        
        // Vertical speed (upward movement)
        this.speedY = Math.random() * 1 + 0.5;
        
        // Horizontal drift
        this.speedX = (Math.random() - 0.5) * 0.5;
        
        // Opacity between 0.4 and 0.8
        this.opacity = Math.random() * 0.4 + 0.4;
        
        // Color variations (soft pink and light red)
        const colors = [
            'rgba(255, 182, 193, ',  // Light pink
            'rgba(255, 105, 180, ',  // Hot pink
            'rgba(255, 192, 203, ',  // Pink
            'rgba(220, 100, 140, '   // Romantic red-pink
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        
        this.canvasHeight = canvasHeight;
        this.canvasWidth = canvasWidth;
    }
    
    // Update heart position
    update() {
        // Move upward
        this.y -= this.speedY;
        
        // Horizontal drift
        this.x += this.speedX;
        
        // Fade out as it reaches the top
        if (this.y < this.canvasHeight * 0.3) {
            this.opacity -= 0.005;
        }
        
        // Reset when heart goes off screen
        if (this.y < -50 || this.opacity <= 0) {
            this.y = this.canvasHeight + Math.random() * 100;
            this.x = Math.random() * this.canvasWidth;
            this.opacity = Math.random() * 0.4 + 0.4;
        }
        
        // Keep within horizontal bounds
        if (this.x < -50) this.x = this.canvasWidth + 50;
        if (this.x > this.canvasWidth + 50) this.x = -50;
    }
    
    // Draw heart shape
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color + this.opacity + ')';
        
        // Draw heart shape using path
        ctx.beginPath();
        const x = this.x;
        const y = this.y;
        const size = this.size;
        
        // Draw a simple heart using bezier curves
        ctx.moveTo(x, y + size / 4);
        ctx.bezierCurveTo(x, y, x - size / 2, y - size / 2, x - size / 2, y + size / 4);
        ctx.bezierCurveTo(x - size / 2, y + size / 2, x, y + size, x, y + size);
        ctx.bezierCurveTo(x, y + size, x + size / 2, y + size / 2, x + size / 2, y + size / 4);
        ctx.bezierCurveTo(x + size / 2, y - size / 2, x, y, x, y + size / 4);
        
        ctx.fill();
        ctx.restore();
    }
}

// Animation variables
let hearts = [];
let animationFrameId = null;
let ctx = null;

// ====================================
// CUSTOMIZATION: Heart Density
// ====================================
// Change this number to adjust the
// number of hearts (recommended: 30-40)
const HEART_COUNT = 35;

function startFloatingHearts() {
    if (!heartsCanvas) return;
    
    // Set canvas size to fill window
    heartsCanvas.width = window.innerWidth;
    heartsCanvas.height = window.innerHeight;
    
    // Get canvas context
    ctx = heartsCanvas.getContext('2d');
    
    // Generate heart particles
    hearts = [];
    for (let i = 0; i < HEART_COUNT; i++) {
        // Stagger initial positions for smooth appearance
        const heart = new HeartParticle(heartsCanvas.width, heartsCanvas.height);
        heart.y = heartsCanvas.height + Math.random() * heartsCanvas.height;
        hearts.push(heart);
    }
    
    // Start animation loop
    animateHearts();
    
    // Handle window resize
    window.addEventListener('resize', resizeCanvas);
}

function resizeCanvas() {
    if (!heartsCanvas) return;
    heartsCanvas.width = window.innerWidth;
    heartsCanvas.height = window.innerHeight;
    
    // Update canvas dimensions for existing hearts
    hearts.forEach(heart => {
        heart.canvasWidth = heartsCanvas.width;
        heart.canvasHeight = heartsCanvas.height;
    });
}

// Animation loop using requestAnimationFrame
function animateHearts() {
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, heartsCanvas.width, heartsCanvas.height);
    
    // Update and draw each heart
    hearts.forEach(heart => {
        heart.update();
        heart.draw(ctx);
    });
    
    // Continue animation loop
    animationFrameId = requestAnimationFrame(animateHearts);
}

// Optional: Stop animation (for performance or cleanup)
function stopFloatingHearts() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
}
