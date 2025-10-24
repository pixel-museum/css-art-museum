document.addEventListener("DOMContentLoaded", () => {
  const galleryContainer = document.getElementById("gallery-container");
  const recentlyReviewedContainer = document.getElementById("recently-reviewed-gallery");
  const searchBar = document.getElementById("search-bar");
  // Sorting dropdown
  const sortingDropdown = document.getElementById("sorting-dropdown");
  let allArts = []; // This will store the merged data (art info + likes)
  let currentFilteredArts = [];  //Initialize currentFilteredArts with all arts
  let pagination = null; // Pagination instance
  
  
  const RecentlyReviewed = {
    get: () => {
      try {
        const data = JSON.parse(localStorage.getItem("recentlyReviewed") || "[]");
        return Array.isArray(data) ? data : [];
      } catch (e) {
        return [];
      }
    },
    add: (art) => {
      if (!art || !art.file) return;
      const list = RecentlyReviewed.get().filter((a) => a.file !== art.file);
      list.push({ file: art.file, title: art.title, author: art.author });
      while (list.length > 5) list.shift();
      localStorage.setItem("recentlyReviewed", JSON.stringify(list));
    },
  };

  async function renderRecentlyReviewed() {
  const recentlyReviewedContainer = document.getElementById("recently-reviewed-gallery");
  if (!recentlyReviewedContainer) return;

  let items = RecentlyReviewed.get();

  // 🔍 Check if files exist (remove deleted ones)
  items = await Promise.all(items.map(async (item) => {
    const filePath = `arts/${item.file}`;
    try {
      const res = await fetch(filePath, { method: "HEAD" });
      return res.ok ? item : null;
    } catch {
      return null;
    }
  }));

  // 🧹 Remove invalid (deleted) entries
  items = items.filter(Boolean);
  localStorage.setItem("recentlyReviewed", JSON.stringify(items));

  // 🧱 Clear container before re-rendering
  recentlyReviewedContainer.innerHTML = "";

  // ♻️ Render only valid existing artworks
  items.reverse().forEach((item) => {
    const filePath = `arts/${item.file}`;
    const card = document.createElement("div");
    card.className = "art-card";
    card.innerHTML = `
      <iframe src="${filePath}" frameborder="0" loading="lazy"></iframe>
      <div class="art-info">
        <p class="art-title">${item.title || "Untitled"}</p>
        <p class="art-author">${item.author || "Unknown"}</p>
      </div>
    `;
    recentlyReviewedContainer.appendChild(card);
  });

  // 🌀 Reinitialize animations if you use them
  if (typeof initializeCardAnimations === "function") {
    initializeCardAnimations();
  }
}


  // Like handler for Recently Reviewed section
  function handleRecentLikeClick(event) {
    const likeContainer = event.target && event.target.closest ? event.target.closest('.like-container') : null;
    if (!likeContainer) return;

    const artId = likeContainer.dataset.id;
    const heartIcon = likeContainer.querySelector('.heart-icon');
    const countSpan = likeContainer.querySelector('span');
    let currentLikes = parseInt(countSpan.textContent, 10);
    if (Number.isNaN(currentLikes)) currentLikes = 0;

    // LocalStorage 
    const LocalLiked = {
      get: () => {
        try {
          const liked = localStorage.getItem('likedArtworks');
          return liked ? new Set(JSON.parse(liked)) : new Set();
        } catch (e) {
          return new Set();
        }
      },
      add: (id) => {
        const s = LocalLiked.get();
        s.add(id);
        localStorage.setItem('likedArtworks', JSON.stringify([...s]));
      },
      remove: (id) => {
        const s = LocalLiked.get();
        s.delete(id);
        localStorage.setItem('likedArtworks', JSON.stringify([...s]));
      },
      has: (id) => LocalLiked.get().has(id)
    };

    (async () => {
      try {
        if (LocalLiked.has(artId)) {
          // Unlike
          countSpan.textContent = Math.max(0, currentLikes - 1);
          heartIcon.classList.remove('liked');
          LocalLiked.remove(artId);
          const res = await unlikeArtworkApi(artId);
          if (res && typeof res.likes === 'number') {
            countSpan.textContent = res.likes;
            const art = Array.isArray(allArts) ? allArts.find(a => a.file === artId) : null;
            if (art) art.likes = res.likes;
          }
        } else {
          // Like
          countSpan.textContent = currentLikes + 1;
          heartIcon.classList.add('liked');
          LocalLiked.add(artId);
          const res = await likeArtworkApi(artId);
          if (res && typeof res.likes === 'number') {
            countSpan.textContent = res.likes;
            const art = Array.isArray(allArts) ? allArts.find(a => a.file === artId) : null;
            if (art) art.likes = res.likes;
          }
        }
      } catch (e) {
        renderRecentlyReviewed();
      }
    })();
  }

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

      // Initialize currentFilteredArts with all arts
      currentFilteredArts = [...allArts];

      // Initialize pagination after data is loaded
      initializePagination();
      renderArts(allArts);
      renderRecentlyReviewed();
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
      artCard.dataset.file = art.file;
      artCard.dataset.title = art.title;
      artCard.dataset.author = art.author;
      const filePath = `arts/${art.file}`;
      const isLiked = LikedArtworks.isLiked(art.file);

      artCard.innerHTML = `
        <h3>${art.title}</h3>
        <iframe loading="lazy" seamless src="${filePath}" title="${art.title}"></iframe>
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
     artCard.addEventListener("click", (e) => {
        if (e.target && e.target.closest && e.target.closest('.like-container')) return;
        RecentlyReviewed.add({ file: art.file, title: art.title, author: art.author });
        renderRecentlyReviewed();
      });
      galleryContainer.appendChild(artCard);
    });
    
    initializeCardAnimations();
  }

  /**
   * Wrapper function to maintain compatibility with existing code
   */
  function renderArts(arts) {

    // Update currentFilteredArts whenever renderArts is called
    currentFilteredArts = arts;
    if (pagination) {
      pagination.setFilteredItems(arts);
      pagination.render();
    } else {
      renderArtCards(arts);
    }
  }
    

  // --- Sorting integration ---
  // FIXED: Now sorts currentFilteredArts instead of allArts
  window.sortAndRenderArts = function() {
    if (!currentFilteredArts || currentFilteredArts.length === 0) return;
    const sorted = window.sortArts ? window.sortArts(currentFilteredArts) : currentFilteredArts;
    renderArts(sorted);
  };

  if (sortingDropdown) {
    sortingDropdown.addEventListener('change', () => {
      window.sortAndRenderArts();
    });
  }

  // --- Search Filter with Recently Reviewed Hide/Show (Fix for Issue #184) ---
const recentlyReviewedSection = document.querySelector('.recently-reviewed-container');

searchBar.addEventListener("input", () => {
  const query = searchBar.value.toLowerCase().trim();
  
  // Hide or show recently reviewed section based on search query
  if (recentlyReviewedSection) {
    if (query.length > 0) {
      // Hide recently reviewed when searching
      recentlyReviewedSection.classList.add('hidden');
    } else {
      // Show recently reviewed when search is empty
      recentlyReviewedSection.classList.remove('hidden');
    }
  }
  
  // Existing filter logic
  const filteredArts = allArts.filter(
    (art) =>
      art.title.toLowerCase().includes(query) ||
      art.author.toLowerCase().includes(query)
  );
  
  // Check if no results found
  if (filteredArts.length === 0 && query !== "") {
    galleryContainer.innerHTML = `<p class="error-message">No art for '${query}' found</p>`;
    // Hide pagination controls if they exist
    const paginationControls = document.getElementById('pagination-controls');
    if (paginationControls) paginationControls.style.display = 'none';
  } else {
    // Show pagination controls again
    const paginationControls = document.getElementById('pagination-controls');
    if (paginationControls) paginationControls.style.display = '';
    renderArts(filteredArts);
  }
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
        "https://api.github.com/repos/pixel-museum/css-art-museum"
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


  loadArts();
  // Initial sort and render after arts are loaded
  window.sortAndRenderArts();
  getGitHubStars();

  renderRecentlyReviewed();

  if (recentlyReviewedContainer) {
    recentlyReviewedContainer.addEventListener('click', handleRecentLikeClick);
  }
  window.addEventListener('keydown', (e) => {
    const activeElement = document.activeElement;
    if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') return;
    if (e.key === '/') {
      e.preventDefault();
      searchBar.focus();
      searchBar.select();
    }
  });
});


// 🎨 Random Artwork of the Day — uses arts.json
// 🎨 Random Artwork of the Day — uses arts.json
function loadRandomArtwork() {
  fetch("./arts.json")
    .then(response => response.json())
    .then(artworks => {
      if (!Array.isArray(artworks) || artworks.length === 0) return;

      const randomIndex = Math.floor(Math.random() * artworks.length);
      const art = artworks[randomIndex];

      const container = document.getElementById("random-artwork-container");
      
      // Create art card similar to your gallery
      const artCard = document.createElement("div");
      artCard.className = "art-card";
      artCard.setAttribute("data-file", art.file);
      artCard.setAttribute("data-title", art.title);
      artCard.setAttribute("data-author", art.author);
      artCard.style.animation = "0.8s ease-out 0s 1 normal both running cardEntrance";

      artCard.innerHTML = `
        <h3>${art.title || "Untitled Artwork"}</h3>
        <iframe 
          loading="lazy" 
          seamless="" 
          src="arts/${art.file}" 
          title="${art.title || "Artwork"}"
        ></iframe>
        <p>by ${art.author || "Unknown Artist"}</p>
        <div class="card-actions">
          <a class="view-code" href="art-viewer.html?art=${art.file}">
            View Code
          </a>
          <div class="like-container" data-id="${art.file}">
            <svg class="heart-icon" fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span class="like-count">0</span>
          </div>
        </div>
      `;

      // Clear previous artwork and add new one
      container.innerHTML = '';
      container.appendChild(artCard);

      // Initialize like functionality for this card
      initializeLikeButton(artCard);

      // Optional: Change artwork every 24 hours
      setTimeout(() => loadRandomArtwork(), 86400000);
    })
    .catch(err => {
      console.error("Error loading random artwork:", err);
    });
}

// Initialize like button functionality
function initializeLikeButton(card) {
  const likeContainer = card.querySelector('.like-container');
  const heartIcon = card.querySelector('.heart-icon');
  const likeCount = card.querySelector('.like-count');
  
  const artworkId = likeContainer.getAttribute('data-id');
  
  // Load existing likes from localStorage
  let likes = JSON.parse(localStorage.getItem('artwork-likes')) || {};
  let isLiked = JSON.parse(localStorage.getItem('artwork-liked')) || {};
  
  // Set initial like count and state
  likeCount.textContent = likes[artworkId] || 0;
  
  if (isLiked[artworkId]) {
    heartIcon.classList.add('liked');
    heartIcon.style.fill = 'currentColor';
  }
  
  // Add click event listener
  likeContainer.addEventListener('click', function() {
    if (!isLiked[artworkId]) {
      // Like the artwork
      likes[artworkId] = (likes[artworkId] || 0) + 1;
      isLiked[artworkId] = true;
      heartIcon.classList.add('liked');
      heartIcon.style.fill = 'currentColor';
    } else {
      // Unlike the artwork
      likes[artworkId] = Math.max(0, (likes[artworkId] || 1) - 1);
      isLiked[artworkId] = false;
      heartIcon.classList.remove('liked');
      heartIcon.style.fill = 'none';
    }
    
    // Update display and storage
    likeCount.textContent = likes[artworkId];
    localStorage.setItem('artwork-likes', JSON.stringify(likes));
    localStorage.setItem('artwork-liked', JSON.stringify(isLiked));
  });
}

// Run on load
document.addEventListener("DOMContentLoaded", loadRandomArtwork);