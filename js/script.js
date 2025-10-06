document.addEventListener("DOMContentLoaded", () => {
  const galleryContainer = document.getElementById("gallery-container");
  const searchBar = document.getElementById("search-bar");
  const sortByLikesBtn = document.getElementById("sort-by-likes-btn"); // Get the sort button
  let allArts = []; // This will store the merged data (art info + likes)
  let pagination = null; // Pagination instance

  async function loadArts() {
    try {
      // Step 1: Fetch local art data from arts.json
      const response = await fetch("arts.json");
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const localArts = await response.json();

      // Step 2: Fetch like counts from the backend API
      const artworksWithLikes = await getAllArtworksApi(); // This function is from api-service.js
      const artLikesMap = new Map(artworksWithLikes.map(art => [art.id, art.likes]));

      // Step 3: Merge local data with like counts
      allArts = localArts.map(art => ({
        ...art,
        likes: artLikesMap.get(art.file) || 0, // Add likes property, default to 0
      }));

      // Initialize pagination after data is loaded
      initializePagination();
      renderArts(allArts);
    } catch (error) {
      console.error("Could not load arts:", error);
      galleryContainer.innerHTML =
        '<p class="error-message">Could not load the art gallery. Please try again later.</p>';
    }
  }

  /**
   * Initialize pagination instance
   */
  function initializePagination() {
    pagination = new Pagination({
      itemsPerPage: 24,
      containerId: 'gallery-container',
      paginationId: 'pagination-controls'
    });

    // Set items to paginate
    pagination.setItems(allArts);

    // Override the render method to use our custom rendering
    pagination.render = function() {
      const currentItems = this.getCurrentPageItems();
      renderArtCards(currentItems);
      this.renderControls();
    };

    // Initial render
    pagination.render();
  }

  /**
   * Render art cards (extracted from renderArts for reusability)
   */
  function renderArtCards(arts) {
    galleryContainer.innerHTML = "";
    
    // We need the LikedArtworks helper to check the liked status
    const LikedArtworks = {
        get: () => {
            try {
                const liked = localStorage.getItem('likedArtworks');
                return liked ? new Set(JSON.parse(liked)) : new Set();
            } catch (e) {
                return new Set();
            }
        },
        isLiked: (id) => LikedArtworks.get().has(id),
    };
      
    arts.forEach((art) => {
      const artCard = document.createElement("div");
      artCard.className = "art-card";
      const filePath = `arts/${art.file}`;
      const isLiked = LikedArtworks.isLiked(art.file);

      artCard.innerHTML = `
        <iframe loading="lazy" seamless src="${filePath}" title="${art.title}"></iframe>
        <h3>${art.title}</h3>
        <p>by ${art.author}</p>
        <div class="card-actions">
            <a class="view-code" href="art-viewer.html?art=${encodeURIComponent(art.file)}">
                View Code
            </a>
            <div class="like-container" data-id="${art.file}">
                <svg class="heart-icon ${isLiked ? 'liked' : ''}" fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <span class="like-count">${art.likes}</span>
            </div>
        </div>
      `;
      galleryContainer.appendChild(artCard);
    });
    
    initializeCardAnimations();
  }

  /**
   * Wrapper function to maintain compatibility with existing code
   */
  function renderArts(arts) {
    if (pagination) {
      pagination.setFilteredItems(arts);
      pagination.render();
    } else {
      renderArtCards(arts);
    }
  }
    
  // --- Sort by Likes functionality ---
  function sortByLikes() {
    // Create a copy of the array before sorting to avoid modifying the original
    const sortedArts = [...allArts].sort((a, b) => b.likes - a.likes);
    renderArts(sortedArts);
  }

  // --- Search Filter ---
  searchBar.addEventListener("input", () => {
    const query = searchBar.value.toLowerCase().trim();
    const filteredArts = allArts.filter(
      (art) =>
        art.title.toLowerCase().includes(query) ||
        art.author.toLowerCase().includes(query)
    );
    renderArts(filteredArts);
  });

  // --- Theme toggle and other existing functions ---
  const toggleBtn = document.getElementById("themeToggle");
  const body = document.body;

  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-theme");
    toggleBtn.textContent = "☀️ Light";
  }

  toggleBtn.addEventListener("click", () => {
    const ripple = document.createElement("span");
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

  function initializeCardAnimations() {
    const artCards = document.querySelectorAll(".art-card");
    if (artCards.length === 0) return;

    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.animation = "cardEntrance 0.8s ease-out both";
          }, index * 100);
        }
      });
    }, observerOptions);

    artCards.forEach((card) => {
      cardObserver.observe(card);
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const rotateX = (e.clientY - centerY) / 20;
        const rotateY = (centerX - e.clientX) / 20;
        card.style.transform = `translateY(-12px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  // Parallax
  let ticking = false;
  function updateParallax() {
    const scrolled = window.pageYOffset;
    requestAnimationFrame(() => {
      document.body.style.backgroundPositionY = `${scrolled * 0.2}px`;
      ticking = false;
    });
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      ticking = true;
      updateParallax();
    }
  });

  const style = document.createElement("style");
  style.textContent = `
    @keyframes ripple { to { transform: scale(4); opacity: 0; } }
    .theme-toggle { position: relative; overflow: hidden; }
    .error-message { text-align: center; color: #ff4d4d; grid-column: 1 / -1; }
  `;
  document.head.appendChild(style);

  // Scroll to Top Button Functionality
  const scrollToTopBtn = document.getElementById("scrollToTop");
  const scrollThreshold = 300; // Show button after scrolling 300px

  function toggleScrollToTopButton() {
    if (window.pageYOffset > scrollThreshold) {
      scrollToTopBtn.classList.add("visible");
    } else {
      scrollToTopBtn.classList.remove("visible");
    }
  }

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // --- GitHub Star Count Fetcher ---
  async function getGitHubStars() {
    const starCountElement = document.getElementById("star-count");
    const starCountNavElement = document.getElementById("star-count-nav");
    if (!starCountElement) return;

    try {
      const response = await fetch(
        "https://api.github.com/repos/Shamli-Singh-Yadav/css-art-museum"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const starCount = data.stargazers_count;
      starCountElement.textContent = starCount.toLocaleString();
      starCountNavElement.textContent = starCount.toLocaleString();
    } catch (error) {
      console.error("Failed to fetch GitHub stars:", error);
      starCountElement.textContent = "N/A";
    }
  }

  // --- Event Listeners and Initial Function Calls ---
  window.addEventListener("scroll", toggleScrollToTopButton);
  scrollToTopBtn.addEventListener("click", scrollToTop);
  sortByLikesBtn.addEventListener("click", sortByLikes); // Add listener for the sort button

  loadArts();
  getGitHubStars();
});
