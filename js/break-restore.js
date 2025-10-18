class BreakRestoreToggle {
    constructor() {
        this.isUnderwater = false;
        this.isAnimating = false;
        this.toggle = null;
        this.bubblesContainer = null;
        
        this.init();
    }
    
    init() {
        this.createToggle();
        this.createBubbles();
        this.bindEvents();
        console.log('🎨 Break-Restore Toggle initialized!');
    }
    
    createToggle() {
        // Create toggle HTML - positioned after the nav
        const toggleHTML = `
            <div class="break-restore-toggle">
                <input type="checkbox" id="breakRestoreToggle" class="toggle-checkbox">
                <label for="breakRestoreToggle" class="toggle-label">
                    <span class="toggle-handle"></span>
                    <span class="toggle-text">Magic Effects</span>
                </label>
            </div>
        `;
        
        // Insert toggle AFTER the header (not at body beginning)
        const header = document.querySelector('header');
        if (header) {
            header.insertAdjacentHTML('afterend', toggleHTML);
        } else {
            // Fallback: insert after body start
            document.body.insertAdjacentHTML('afterbegin', toggleHTML);
        }
        
        this.toggle = document.getElementById('breakRestoreToggle');
        
        // Ensure proper positioning
        this.positionToggle();
    }
    
    positionToggle() {
        const toggleElement = document.querySelector('.break-restore-toggle');
        if (toggleElement) {
            // Get navbar height for proper positioning
            const navbar = document.querySelector('header nav');
            if (navbar) {
                const navbarRect = navbar.getBoundingClientRect();
                const navbarBottom = navbarRect.bottom + window.scrollY;
                
                // Position toggle 10px below navbar
                toggleElement.style.top = (navbarBottom + 10) + 'px';
                toggleElement.style.right = '20px';
            }
        }
    }
    
    createBubbles() {
        this.bubblesContainer = document.createElement('div');
        this.bubblesContainer.className = 'underwater-bubbles';
        document.body.appendChild(this.bubblesContainer);
        
        // Create initial bubbles
        this.generateBubbles(20);
    }
    
    generateBubbles(count) {
        for (let i = 0; i < count; i++) {
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            
            const size = Math.random() * 40 + 15;
            const left = Math.random() * 100;
            const delay = Math.random() * 8;
            const duration = Math.random() * 4 + 6;
            
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            bubble.style.left = `${left}%`;
            bubble.style.animationDelay = `${delay}s`;
            bubble.style.animationDuration = `${duration}s`;
            bubble.style.opacity = Math.random() * 0.6 + 0.2;
            
            this.bubblesContainer.appendChild(bubble);
        }
    }
    
    bindEvents() {
        this.toggle.addEventListener('change', () => {
            if (!this.isAnimating) {
                this.toggleEffect();
            }
        });
        
        // Prevent rapid clicking
        this.toggle.addEventListener('click', (e) => {
            if (this.isAnimating) {
                e.preventDefault();
            }
        });
        
        // Reposition on resize
        window.addEventListener('resize', () => {
            this.positionToggle();
        });
        
        // Reposition on scroll (for fixed navbars)
        window.addEventListener('scroll', () => {
            this.positionToggle();
        });
    }
    
    toggleEffect() {
        this.isAnimating = true;
        
        if (this.isUnderwater) {
            this.applyBreakingEffect();
        } else {
            this.applyUnderwaterEffect();
        }
        
        this.isUnderwater = !this.isUnderwater;
        this.updateToggleText();
        
        // Re-enable toggle after animation
        setTimeout(() => {
            this.isAnimating = false;
        }, 1200);
    }
    
    applyUnderwaterEffect() {
        // Clear any existing effects
        this.clearEffects();
        
        // Add underwater classes
        setTimeout(() => {
            document.body.classList.add('underwater-mode');
            this.bubblesContainer.style.display = 'block';
            
            // Generate more bubbles for underwater effect
            this.generateBubbles(30);
        }, 100);
        
        console.log('🌊 Underwater mode activated!');
    }
    
    applyBreakingEffect() {
        // Clear underwater effects first
        this.clearEffects();
        
        // Add breaking classes
        document.body.classList.add('breaking-mode');
        this.bubblesContainer.style.display = 'none';
        
        console.log('💥 Breaking effect activated!');
        
        // Remove breaking effect after animation completes
        setTimeout(() => {
            this.clearEffects();
        }, 1200);
    }
    
    clearEffects() {
        document.body.classList.remove('underwater-mode', 'breaking-mode');
        // Clear all bubbles
        this.bubblesContainer.innerHTML = '';
    }
    
    updateToggleText() {
        const toggleText = document.querySelector('.toggle-text');
        if (toggleText) {
            if (this.isUnderwater) {
                toggleText.textContent = 'Normal Mode';
            } else {
                toggleText.textContent = 'Magic Effects';
            }
        }
    }
    
    // Cleanup method (optional)
    destroy() {
        if (this.toggle) {
            this.toggle.removeEventListener('change', this.toggleEffect);
        }
        if (this.bubblesContainer) {
            this.bubblesContainer.remove();
        }
        
        const toggleElement = document.querySelector('.break-restore-toggle');
        if (toggleElement) {
            toggleElement.remove();
        }
        
        this.clearEffects();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for other scripts to load and DOM to be ready
    setTimeout(() => {
        window.breakRestoreToggle = new BreakRestoreToggle();
    }, 1500);
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BreakRestoreToggle;
}