// Wait until the DOM is fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {
  const galleryContainer = document.getElementById('gallery-container');
  
  // --- Function to Load Art from JSON ---
  async function loadArts() {
    try {
      const response = await fetch('arts.json');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const arts = await response.json();
      
      galleryContainer.innerHTML = ''; // Clear any loading message
      
      // Loop through each art object and create a complete art card for it
      arts.forEach(art => {
        const artCard = document.createElement('div');
        artCard.className = 'art-card';
        
        const filePath = `arts/${art.file}`;

        // 1. Create the preview iframe and the title paragraph
        artCard.innerHTML = `
          <iframe src="${filePath}" title="${art.title}" loading="lazy" seamless></iframe>
          <p>${art.title} by ${art.author}</p>
        `;

        // 2. Create the "View Code" button and its link
        const viewerButtonAnchor = document.createElement("a");
        viewerButtonAnchor.classList.add("view-code"); // This class is styled by your CSS
        viewerButtonAnchor.href = `art-viewer.html?file=${art.file}`; // Fallback href

        const button = document.createElement("button");
        button.textContent = "View Code";

        // 3. Add a click listener to pass the current theme to the viewer page
        viewerButtonAnchor.addEventListener("click", (e) => {
          e.preventDefault(); // Stop the default link behavior
          const isDark = document.body.classList.contains("dark-theme");
          // Construct the final URL with the theme parameter
          const url = `art-viewer.html?file=${encodeURIComponent(art.file)}&dark=${isDark}`;
          window.location.href = url; // Navigate to the new page
        });
        
        viewerButtonAnchor.appendChild(button);
        artCard.appendChild(viewerButtonAnchor); // Add the button to the card
        
        galleryContainer.appendChild(artCard); // Add the fully formed card to the gallery
      });

      // After adding all cards, initialize the animations for them
      initializeCardAnimations();

    } catch (error) {
      console.error('Could not load arts:', error);
      galleryContainer.innerHTML = '<p class="error-message">Could not load the art gallery. Please try again later.</p>';
    }
  }

  // --- Theme Toggling and UI Animations ---
  
  const toggleBtn = document.getElementById("themeToggle");
  const body = document.body;

  // Load saved theme
  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-theme");
    toggleBtn.textContent = "☀️ Light";
  }

  // Theme toggle
  toggleBtn.addEventListener("click", () => {
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute; border-radius: 50%; background: rgba(108, 99, 255, 0.3);
      transform: scale(0); animation: ripple 0.6s linear;
      left: 50%; top: 50%; width: 20px; height: 20px; margin: -10px 0 0 -10px;
    `;
    toggleBtn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
    
    body.classList.toggle("dark-theme");
    if (body.classList.contains("dark-theme")) {
      toggleBtn.textContent = "☀️ Light";
      localStorage.setItem("theme", "dark");
    } else {
      toggleBtn.textContent = "🌙 Dark";
      localStorage.setItem("theme", "light");
    }
  });

  // Function to set up card animations (Intersection Observer, hover effects, etc.)
  function initializeCardAnimations() {
    const artCards = document.querySelectorAll(".art-card");
    if (artCards.length === 0) return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.animation = 'cardEntrance 0.8s ease-out both';
          }, index * 100); // Stagger the animation
        }
      });
    }, observerOptions);

    artCards.forEach(card => {
      cardObserver.observe(card);
      
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const rotateX = (e.clientY - centerY) / 20;
        const rotateY = (centerX - e.clientX) / 20;
        card.style.transform = `translateY(-12px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // Parallax effect for background
  let ticking = false;
  function updateParallax() {
    const scrolled = window.pageYOffset;
    requestAnimationFrame(() => {
      document.body.style.backgroundPositionY = `${scrolled * 0.2}px`;
      ticking = false;
    });
  }
  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      updateParallax();
    }
  });

  // Add CSS for ripple animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple { to { transform: scale(4); opacity: 0; } }
    .theme-toggle { position: relative; overflow: hidden; }
    .error-message { text-align: center; color: #ff4d4d; grid-column: 1 / -1; }
  `;
  document.head.appendChild(style);
  
  // --- Initial Call to load the gallery ---
  loadArts();
});