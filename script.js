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
const openQuestionFlowBtn = document.getElementById('openQuestionFlow');
const choiceLayer = document.getElementById('choiceLayer');
const choiceQuestionText = document.getElementById('choiceQuestionText');
const yesChoiceBtn = document.getElementById('yesChoice');
const noChoiceBtn = document.getElementById('noChoice');
const finalThanks = document.getElementById('finalThanks');

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
    
    // Play page flip sound if available
    const pageFlipSound = document.getElementById('pageFlipSound');
    if (pageFlipSound) {
        pageFlipSound.currentTime = 0;
        pageFlipSound.volume = 0.3;
        pageFlipSound.play().catch(err => console.log('Sound play failed:', err));
    }

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

// Detect if device is mobile
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

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
            // Silently handle autoplay restrictions
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
let isMorphingLightbox = false;

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
    document.body.classList.add('lightbox-open');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.classList.remove('lightbox-open');
    document.body.style.overflow = '';
}

function navigateLightbox(direction) {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (isMorphingLightbox) return;

    const nextIndex = getWrappedIndex(currentLightboxIndex + direction);
    morphToLightboxImage(nextIndex);
}

function getWrappedIndex(index) {
    if (index < 0) {
        return totalImages - 1;
    }
    if (index >= totalImages) {
        return 0;
    }
    return index;
}

function morphToLightboxImage(nextIndex) {
    if (!lightboxImage) {
        currentLightboxIndex = nextIndex;
        updateLightboxImage();
        return;
    }

    isMorphingLightbox = true;
    lightboxImage.classList.remove('morph-in', 'morph-out');
    lightboxImage.classList.add('morph-out');

    setTimeout(() => {
        currentLightboxIndex = nextIndex;
        updateLightboxImage();

        lightboxImage.classList.remove('morph-out');
        lightboxImage.classList.add('morph-in');

        setTimeout(() => {
            lightboxImage.classList.remove('morph-in');
            isMorphingLightbox = false;
        }, 340);
    }, 220);
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
        const nextIndex = getWrappedIndex(currentLightboxIndex + 1);
        morphToLightboxImage(nextIndex);
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
   FINAL INTERACTION FLOW
   ======================================== */
const interactionQuestions = [
    'So, how do you feel about this present?',
    'Do you love me?'
];

const interactionAnswers = [
    { yes: 'Like it!!', no: 'Sucks!' },
    { yes: 'Yessss', no: 'Not at all' }
];

let currentQuestionStep = 0;
let noClicksForCurrentStep = 0;
let noButtonOffsetX = 0;
let noButtonOffsetY = 0;
let lastNoEvadeTs = 0;

function getChoicePanelElement() {
    if (!choiceLayer) return null;
    return choiceLayer.querySelector('.choice-panel');
}

function evadeNoButton() {
    if (!noChoiceBtn || noClicksForCurrentStep >= 5 || noChoiceBtn.classList.contains('hidden')) {
        return;
    }

    const now = Date.now();
    if (now - lastNoEvadeTs < 120) {
        return;
    }
    lastNoEvadeTs = now;

    const panel = getChoicePanelElement();
    const panelRect = panel ? panel.getBoundingClientRect() : null;
    const btnRect = noChoiceBtn.getBoundingClientRect();

    const maxX = panelRect
        ? Math.max((panelRect.width - btnRect.width) / 2 - 18, 26)
        : 120;
    const maxY = panelRect
        ? Math.max((panelRect.height - btnRect.height) / 3 - 14, 18)
        : 50;

    noButtonOffsetX = (Math.random() * 2 - 1) * maxX;
    noButtonOffsetY = (Math.random() * 2 - 1) * maxY;

    applyChoiceButtonScale();
}

function applyChoiceButtonScale() {
    if (!yesChoiceBtn || !noChoiceBtn) return;

    const yesScale = Math.min(1 + noClicksForCurrentStep * 0.14, 1.85);
    const noScale = Math.max(1 - noClicksForCurrentStep * 0.16, 0.3);

    yesChoiceBtn.style.transform = `translate(0px, 0px) scale(${yesScale})`;
    noChoiceBtn.style.transform = `translate(${noButtonOffsetX}px, ${noButtonOffsetY}px) scale(${noScale})`;
    noChoiceBtn.style.opacity = String(Math.max(1 - noClicksForCurrentStep * 0.18, 0.05));

    if (noClicksForCurrentStep >= 5) {
        noChoiceBtn.style.transform = '';
        noChoiceBtn.classList.add('hidden');
    }
}

function resetChoiceButtons() {
    if (!yesChoiceBtn || !noChoiceBtn) return;

    noClicksForCurrentStep = 0;
    noButtonOffsetX = 0;
    noButtonOffsetY = 0;
    yesChoiceBtn.style.transform = 'translate(0px, 0px) scale(1)';
    noChoiceBtn.style.transform = 'translate(0px, 0px) scale(1)';
    noChoiceBtn.style.opacity = '1';
    noChoiceBtn.classList.remove('hidden');
}

function openChoiceLayer() {
    if (!choiceLayer || !choiceQuestionText) return;
    choiceQuestionText.textContent = interactionQuestions[currentQuestionStep];
    
    // Update button text based on current question
    const answers = interactionAnswers[currentQuestionStep];
    if (yesChoiceBtn) yesChoiceBtn.textContent = answers.yes;
    if (noChoiceBtn) noChoiceBtn.textContent = answers.no;
    
    choiceLayer.classList.add('active');
    choiceLayer.setAttribute('aria-hidden', 'false');
    resetChoiceButtons();
}

function closeChoiceLayer() {
    if (!choiceLayer) return;
    choiceLayer.classList.remove('active');
    choiceLayer.setAttribute('aria-hidden', 'true');
}

function createChoiceSparkles(button) {
    createSparkles(button);
    const extra = 4;
    for (let i = 0; i < extra; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle sparkle-choice';
            const size = Math.random() * 4 + 4;
            sparkle.style.width = `${size}px`;
            sparkle.style.height = `${size}px`;
            sparkle.style.left = `${Math.random() * button.offsetWidth}px`;
            sparkle.style.top = `${Math.random() * button.offsetHeight}px`;
            sparkle.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            sparkle.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.9)';
            button.appendChild(sparkle);
            setTimeout(() => sparkle.remove(), SPARKLE_DURATION);
        }, i * 60);
    }
}

function createHeartBurst(container, count = 18) {
    if (!container) return;

    for (let i = 0; i < count; i++) {
        const heart = document.createElement('span');
        heart.className = 'heart-particle';
        heart.textContent = Math.random() > 0.35 ? '❤' : '✨';

        const angle = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * 100;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance - 40;
        const rot = `${(Math.random() - 0.5) * 90}deg`;

        heart.style.setProperty('--tx', `${tx}px`);
        heart.style.setProperty('--ty', `${ty}px`);
        heart.style.setProperty('--rot', rot);
        heart.style.color = Math.random() > 0.5 ? '#ff9fc2' : '#ffffff';
        heart.style.left = `${45 + Math.random() * 10}%`;
        heart.style.top = `${40 + Math.random() * 20}%`;

        container.appendChild(heart);
        setTimeout(() => heart.remove(), 1300);
    }
}

function createConfetti(count = 100) {
    const colors = ['#ff6b9d', '#c44569', '#ffa502', '#ffdd59', '#48dbfb', '#0abde3', '#ee5a6f', '#ff9ff3'];
    
    // Reduce confetti on mobile for better performance
    const adjustedCount = isMobile ? Math.floor(count * 0.6) : count;
    
    for (let i = 0; i < adjustedCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            // Random position across the width
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10vh';
            
            // Random color
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            // Random size
            const size = Math.random() * 8 + 5;
            confetti.style.width = size + 'px';
            confetti.style.height = size + 'px';
            
            // Random shape (circle or square)
            if (Math.random() > 0.5) {
                confetti.style.borderRadius = '50%';
            }
            
            // Random animation properties
            const duration = Math.random() * 2 + 2; // 2-4 seconds
            const drift = (Math.random() - 0.5) * 200; // -100px to 100px horizontal drift
            const rotation = Math.random() * 720 - 360; // -360deg to 360deg
            
            confetti.style.setProperty('--duration', `${duration}s`);
            confetti.style.setProperty('--drift', `${drift}px`);
            confetti.style.setProperty('--rotation', `${rotation}deg`);
            
            document.body.appendChild(confetti);
            
            // Remove after animation
            setTimeout(() => confetti.remove(), duration * 1000);
        }, i * 20); // Stagger creation
    }
}

function finishInteractionFlow() {
    closeChoiceLayer();
    if (openQuestionFlowBtn) {
        openQuestionFlowBtn.classList.add('hide');
    }

    if (finalThanks) {
        finalThanks.textContent = 'Thank you for being in my life';
        finalThanks.classList.add('visible');
        
        // Heart bursts
        createHeartBurst(finalThanks, 22);
        setTimeout(() => createHeartBurst(finalThanks, 14), 600);
        setTimeout(() => createHeartBurst(finalThanks, 14), 1250);
        
        // Confetti celebration!
        createConfetti(120);
        setTimeout(() => createConfetti(80), 800);
    }
}

function initFinalInteractionFlow() {
    if (!openQuestionFlowBtn || !choiceLayer || !yesChoiceBtn || !noChoiceBtn) {
        return;
    }

    openQuestionFlowBtn.addEventListener('click', () => {
        currentQuestionStep = 0;
        openChoiceLayer();
    });

    noChoiceBtn.addEventListener('click', () => {
        createChoiceSparkles(noChoiceBtn);
        noClicksForCurrentStep += 1;
        applyChoiceButtonScale();

        if (noClicksForCurrentStep < 5) {
            evadeNoButton();
        }
    });

    noChoiceBtn.addEventListener('mouseenter', () => {
        evadeNoButton();
    });

    yesChoiceBtn.addEventListener('click', () => {
        createChoiceSparkles(yesChoiceBtn);

        if (currentQuestionStep === 0) {
            currentQuestionStep = 1;
            choiceQuestionText.textContent = interactionQuestions[currentQuestionStep];
            
            // Update button text for second question
            const answers = interactionAnswers[currentQuestionStep];
            yesChoiceBtn.textContent = answers.yes;
            noChoiceBtn.textContent = answers.no;
            
            resetChoiceButtons();
            return;
        }

        finishInteractionFlow();
    });

    choiceLayer.addEventListener('click', (event) => {
        if (event.target === choiceLayer) {
            closeChoiceLayer();
        }
    });

    choiceLayer.addEventListener('mousemove', (event) => {
        if (!choiceLayer.classList.contains('active') || noClicksForCurrentStep >= 5) {
            return;
        }

        const rect = noChoiceBtn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY);

        if (distance < 90) {
            evadeNoButton();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && choiceLayer.classList.contains('active')) {
            closeChoiceLayer();
        }
    });
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
const revealElements = document.querySelectorAll('.fade-in, .reveal-text, .reveal-slide-left, .reveal-drop, .reveal-delayed, .reveal-letter-content, .reveal-stage-2, .reveal-stage-3, .reveal-line');
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
    // Initialize light/dark theme based on user preference
    initThemeToggle();

    // Initialize playful yes/no final interaction flow
    initFinalInteractionFlow();
    
    // Initialize scroll progress bar
    updateScrollProgress();
    
    // Disable custom cursor and flower trail on mobile devices
    if (isMobile) {
        document.body.style.cursor = 'auto';
        // Flower trail will be disabled via the event listener check
    }
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

/* ========================================
   FLOWER TRAIL CURSOR EFFECT
   ======================================== */
const flowers = ['🌸', '🌼', '🌺', '🌷', '🌹'];
let lastFlowerTime = 0;
const FLOWER_INTERVAL = 50; // milliseconds between particles
const MAX_FLOWER_PARTICLES = 30; // Limit concurrent particles for performance
let activeFlowerCount = 0;

document.addEventListener('mousemove', (e) => {
    // Skip on mobile devices for better performance
    if (isMobile) return;
    
    const now = Date.now();
    
    // Create flower particle every 50ms and limit max particles
    if (now - lastFlowerTime > FLOWER_INTERVAL && activeFlowerCount < MAX_FLOWER_PARTICLES) {
        createFlowerTrail(e.clientX, e.clientY);
        lastFlowerTime = now;
    }
});

function createFlowerTrail(x, y) {
    const flower = document.createElement('div');
    flower.className = 'flower-trail';
    flower.textContent = flowers[Math.floor(Math.random() * flowers.length)];
    
    // Random horizontal offset for spread effect
    const offsetX = (Math.random() - 0.5) * 20;
    flower.style.left = (x + offsetX) + 'px';
    flower.style.top = y + 'px';
    
    activeFlowerCount++;
    document.body.appendChild(flower);
    
    // Remove element after animation completes
    setTimeout(() => {
        flower.remove();
        activeFlowerCount--;
    }, 1200); // Match animation duration
}
