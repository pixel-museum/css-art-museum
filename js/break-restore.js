class BreakRestoreToggle {
    constructor() {
        this.isUnderwater = false;
        this.isAnimating = false;
        this.toggle = null;
        this.bubblesContainer = null;
        this.glitterContainer = null;
        this.isGlitterEnabled = true;
        this.bubbleInterval = null;
        this.lastGlitterTime = 0;
        
        this.init();
    }
    
    init() {
        this.createToggle();
        this.createBubbles();
        this.createGlitterContainer();
        this.bindEvents();
        console.log('🎨 Break-Restore Toggle initialized!');
    }
    
    createToggle() {
        const toggleHTML = `
            <div class="break-restore-toggle">
                <input type="checkbox" id="breakRestoreToggle" class="toggle-checkbox">
                <label for="breakRestoreToggle" class="toggle-label">
                    <span class="toggle-handle"></span>
                    <span class="toggle-text">Activate Magic</span>
                </label>
            </div>
        `;
        
        const header = document.querySelector('header');
        if (header) {
            header.insertAdjacentHTML('afterend', toggleHTML);
        } else {
            document.body.insertAdjacentHTML('afterbegin', toggleHTML);
        }
        
        this.toggle = document.getElementById('breakRestoreToggle');
        this.positionToggle();
    }
    
    createBubbles() {
        this.bubblesContainer = document.createElement('div');
        this.bubblesContainer.className = 'underwater-bubbles';
        this.bubblesContainer.style.display = 'none';
        document.body.appendChild(this.bubblesContainer);
    }
    
    createGlitterContainer() {
        this.glitterContainer = document.createElement('div');
        this.glitterContainer.className = 'glitter-container';
        this.glitterContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
        `;
        document.body.appendChild(this.glitterContainer);
    }
    
    startBubbleGeneration() {
        if (this.bubbleInterval) {
            clearInterval(this.bubbleInterval);
        }
        
        // Generate bubbles more frequently for full coverage
        this.bubbleInterval = setInterval(() => {
            if (this.bubblesContainer.children.length < 100) {
                this.generateBubbles(6);
            }
        }, 600);
    }
    
    stopBubbleGeneration() {
        if (this.bubbleInterval) {
            clearInterval(this.bubbleInterval);
            this.bubbleInterval = null;
        }
        this.fadeOutBubbles();
    }
    
    generateBubbles(count) {
        const viewportHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        for (let i = 0; i < count; i++) {
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            
            // Larger size range for better visibility
            const size = Math.random() * 80 + 20; // 20px to 100px
            const left = Math.random() * 100;
            const delay = Math.random() * 8;
            const duration = Math.random() * 10 + 8; // 8s to 18s for full travel
            
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            bubble.style.left = `${left}%`;
            bubble.style.animationDelay = `${delay}s`;
            bubble.style.animationDuration = `${duration}s`;
            bubble.style.opacity = Math.random() * 0.8 + 0.2;
            bubble.style.setProperty('--bubble-delay', `${delay}s`);
            
            // More dramatic horizontal movement
            bubble.style.setProperty('--bubble-x', `${(Math.random() - 0.5) * 80}px`);
            
            // Random starting position within document height
            const startPosition = Math.random() * documentHeight;
            bubble.style.top = `${startPosition}px`;
            
            // Random z-index for depth
            bubble.style.zIndex = Math.floor(Math.random() * 10) + 9990;
            
            this.bubblesContainer.appendChild(bubble);
            
            // Remove bubble after animation completes
            setTimeout(() => {
                if (bubble.parentNode === this.bubblesContainer) {
                    bubble.remove();
                }
            }, (delay + duration) * 1000);
        }
    }
    
    fadeOutBubbles() {
        const bubbles = this.bubblesContainer.children;
        for (let bubble of bubbles) {
            bubble.style.animation = 'bubbleFadeOut 2s ease-out forwards';
            setTimeout(() => {
                if (bubble.parentNode === this.bubblesContainer) {
                    bubble.remove();
                }
            }, 2000);
        }
    }
    
    clearAllBubbles() {
        if (this.bubblesContainer) {
            this.bubblesContainer.innerHTML = '';
        }
    }
    
    createGlitter(x, y) {
        if (!this.isGlitterEnabled) return;
        
        const glitterCount = Math.floor(Math.random() * 4) + 3;
        
        for (let i = 0; i < glitterCount; i++) {
            const glitter = document.createElement('div');
            glitter.className = 'cursor-glitter';
            
            const size = Math.random() * 5 + 2;
            const glitterX = (Math.random() - 0.5) * 40;
            const glitterY = (Math.random() - 0.5) * 40;
            const rotation = Math.random() * 360;
            
            glitter.style.width = `${size}px`;
            glitter.style.height = `${size}px`;
            glitter.style.left = `${x}px`;
            glitter.style.top = `${y}px`;
            glitter.style.setProperty('--glitter-x', `${glitterX}px`);
            glitter.style.setProperty('--glitter-y', `${glitterY}px`);
            glitter.style.animationDuration = `${Math.random() * 0.8 + 0.4}s`;
            glitter.style.transform = `rotate(${rotation}deg)`;
            
            this.glitterContainer.appendChild(glitter);
            
            setTimeout(() => {
                if (glitter.parentNode === this.glitterContainer) {
                    glitter.remove();
                }
            }, 1200);
        }
    }
    
    bindEvents() {
        this.toggle.addEventListener('change', () => {
            if (!this.isAnimating) {
                this.toggleEffect();
            }
        });
        
        this.toggle.addEventListener('click', (e) => {
            if (this.isAnimating) {
                e.preventDefault();
            }
        });
        
        document.addEventListener('mousemove', (e) => {
            const now = Date.now();
            if (now - this.lastGlitterTime > 35) {
                this.createGlitter(e.clientX, e.clientY);
                this.lastGlitterTime = now;
            }
        });
        
        document.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.createGlitter(touch.clientX, touch.clientY);
        }, { passive: false });
        
        document.addEventListener('click', (e) => {
            this.createGlitterBurst(e.clientX, e.clientY, 10);
        });
        
        window.addEventListener('resize', () => {
            this.positionToggle();
        });
        
        window.addEventListener('scroll', () => {
            this.positionToggle();
        });
    }
    
    createGlitterBurst(x, y, count) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                this.createGlitter(x, y);
            }, i * 40);
        }
    }
    
    toggleEffect() {
        this.isAnimating = true;
        
        if (this.isUnderwater) {
            this.deactivateEffects();
        } else {
            this.activateEffects();
        }
        
        this.isUnderwater = !this.isUnderwater;
        this.updateToggleText();
        
        const toggleRect = this.toggle.getBoundingClientRect();
        const toggleX = toggleRect.left + toggleRect.width / 2;
        const toggleY = toggleRect.top + toggleRect.height / 2;
        this.createGlitterBurst(toggleX, toggleY, 15);
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 1000);
    }
    
    activateEffects() {
        console.log('🌊 Activating magic effects...');
        
        this.bubblesContainer.style.display = 'block';
        this.startBubbleGeneration();
        
        setTimeout(() => {
            document.body.classList.add('underwater-mode');
            // Generate large initial burst
            this.generateBubbles(40);
        }, 200);
    }
    
    deactivateEffects() {
        console.log('🔮 Deactivating magic effects...');
        
        document.body.classList.remove('underwater-mode');
        this.stopBubbleGeneration();
        
        setTimeout(() => {
            this.bubblesContainer.style.display = 'none';
            this.clearAllBubbles();
        }, 2000);
    }
    
    updateToggleText() {
        const toggleText = document.querySelector('.toggle-text');
        if (toggleText) {
            if (this.isUnderwater) {
                toggleText.textContent = 'Normal Mode';
                toggleText.style.background = 'linear-gradient(135deg, #4ecdc4, #6c63ff)';
                toggleText.style.webkitBackgroundClip = 'text';
                toggleText.style.backgroundClip = 'text';
                toggleText.style.webkitTextFillColor = 'transparent';
            } else {
                toggleText.textContent = 'Activate Magic';
                toggleText.style.background = 'linear-gradient(135deg, #333, #6c63ff)';
                toggleText.style.webkitBackgroundClip = 'text';
                toggleText.style.backgroundClip = 'text';
                toggleText.style.webkitTextFillColor = 'transparent';
            }
        }
    }
    
    positionToggle() {
        const toggleElement = document.querySelector('.break-restore-toggle');
        if (toggleElement) {
            const navbar = document.querySelector('header nav');
            if (navbar) {
                const navbarRect = navbar.getBoundingClientRect();
                const navbarBottom = navbarRect.bottom + window.scrollY;
                toggleElement.style.top = (navbarBottom + 10) + 'px';
                toggleElement.style.right = '20px';
            }
        }
    }
    
    enableGlitter() {
        this.isGlitterEnabled = true;
    }
    
    disableGlitter() {
        this.isGlitterEnabled = false;
    }
    
    getState() {
        return {
            isUnderwater: this.isUnderwater,
            isAnimating: this.isAnimating,
            isGlitterEnabled: this.isGlitterEnabled,
            bubbleCount: this.bubblesContainer.children.length
        };
    }
    
    destroy() {
        if (this.toggle) {
            const newToggle = this.toggle.cloneNode(true);
            this.toggle.parentNode.replaceChild(newToggle, this.toggle);
        }
        
        this.stopBubbleGeneration();
        
        if (this.bubblesContainer) {
            this.bubblesContainer.remove();
        }
        if (this.glitterContainer) {
            this.glitterContainer.remove();
        }
        
        const toggleElement = document.querySelector('.break-restore-toggle');
        if (toggleElement) {
            toggleElement.remove();
        }
        
        document.body.classList.remove('underwater-mode');
        
        console.log('🧹 Break-Restore Toggle cleaned up!');
    }
}

// Add the enhanced animations
if (!document.querySelector('#fullWebsiteBubbleAnimation')) {
    const bubbleStyle = document.createElement('style');
    bubbleStyle.id = 'fullWebsiteBubbleAnimation';
    bubbleStyle.textContent = `
        @keyframes bubbleFloat {
            0% {
                transform: translateY(100vh) translateX(0) scale(0.3) rotate(0deg);
                opacity: 0;
            }
            5% {
                opacity: 0.8;
                transform: translateY(95vh) translateX(var(--bubble-x, 0)) scale(0.5) rotate(45deg);
            }
            25% {
                opacity: 0.9;
                transform: translateY(75vh) translateX(calc(var(--bubble-x, 0) * 1.2)) scale(0.7) rotate(90deg);
            }
            50% {
                opacity: 0.8;
                transform: translateY(50vh) translateX(calc(var(--bubble-x, 0) * 1.5)) scale(0.9) rotate(135deg);
            }
            75% {
                opacity: 0.6;
                transform: translateY(25vh) translateX(calc(var(--bubble-x, 0) * 1.8)) scale(1.1) rotate(180deg);
            }
            95% {
                opacity: 0.4;
                transform: translateY(5vh) translateX(calc(var(--bubble-x, 0) * 2)) scale(1.2) rotate(225deg);
            }
            100% {
                transform: translateY(-150px) translateX(calc(var(--bubble-x, 0) * 2.5)) scale(1.3) rotate(270deg);
                opacity: 0;
            }
        }
        
        @keyframes bubbleFadeOut {
            to {
                opacity: 0;
                transform: translateY(-20px) scale(0.8);
            }
        }
    `;
    document.head.appendChild(bubbleStyle);
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        try {
            window.breakRestoreToggle = new BreakRestoreToggle();
            
            window.toggleMagicEffects = () => {
                if (window.breakRestoreToggle && window.breakRestoreToggle.toggle) {
                    window.breakRestoreToggle.toggle.click();
                }
            };
            
            window.enableGlitter = () => {
                if (window.breakRestoreToggle) {
                    window.breakRestoreToggle.enableGlitter();
                }
            };
            
            window.disableGlitter = () => {
                if (window.breakRestoreToggle) {
                    window.breakRestoreToggle.disableGlitter();
                }
            };
            
            console.log('✨ Magic Effects Toggle Ready!');
            
        } catch (error) {
            console.error('❌ Failed to initialize Break-Restore Toggle:', error);
        }
    }, 1000);
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = BreakRestoreToggle;
}