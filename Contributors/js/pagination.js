/**
 * Pagination Module for CSS Art Museum
 * 
 * This module handles pagination functionality for the art gallery,
 * displaying 24 artworks per page with navigation controls.
 * Integrates with the existing sort by likes feature.
 * 
 * @author mathurojus
 * @version 1.0.0
 */

/**
 * Pagination class to manage artwork pagination
 */
class Pagination {
  /**
   * Initialize pagination with configuration
   * @param {Object} config - Configuration object
   * @param {number} config.itemsPerPage - Number of items per page (default: 24)
   * @param {string} config.containerId - ID of the gallery container
   * @param {string} config.paginationId - ID of the pagination controls container
   */
  constructor(config = {}) {
    this.itemsPerPage = config.itemsPerPage || 24;
    this.currentPage = 1;
    this.totalPages = 1;
    this.allItems = [];
    this.filteredItems = [];
    this.containerElement = document.getElementById(config.containerId || 'gallery-container');
    this.paginationContainer = this.createPaginationContainer(config.paginationId || 'pagination-controls');
  }

  /**
   * Create and insert pagination controls container
   * @param {string} id - ID for pagination container
   * @returns {HTMLElement} - Created pagination container
   */
  createPaginationContainer(id) {
    let container = document.getElementById(id);
    if (!container) {
      container = document.createElement('div');
      container.id = id;
      container.className = 'pagination-controls';
      
      // Insert pagination after gallery container
      if (this.containerElement && this.containerElement.parentNode) {
        this.containerElement.parentNode.insertBefore(
          container,
          this.containerElement.nextSibling
        );
      }
    }
    return container;
  }

  /**
   * Set items to paginate
   * @param {Array} items - Array of items to paginate
   */
  setItems(items) {
    this.allItems = items;
    this.filteredItems = items;
    this.currentPage = 1;
    this.calculateTotalPages();
  }

  /**
   * Set filtered items (for search/sort functionality)
   * @param {Array} items - Filtered items array
   */
  setFilteredItems(items) {
    this.filteredItems = items;
    this.currentPage = 1;
    this.calculateTotalPages();
  }

  /**
   * Calculate total number of pages
   */
  calculateTotalPages() {
    this.totalPages = Math.ceil(this.filteredItems.length / this.itemsPerPage);
    if (this.totalPages < 1) this.totalPages = 1;
  }

  /**
   * Get items for current page
   * @returns {Array} - Items for current page
   */
  getCurrentPageItems() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredItems.slice(startIndex, endIndex);
  }

  /**
   * Navigate to specific page
   * @param {number} pageNumber - Target page number
   */
  goToPage(pageNumber) {
    if (pageNumber < 1 || pageNumber > this.totalPages) return;
    this.currentPage = pageNumber;
    this.render();
    this.scrollToTop();
  }

  /**
   * Navigate to next page
   */
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  /**
   * Navigate to previous page
   */
  previousPage() {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  /**
   * Scroll to top of page smoothly
   */
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  /**
   * Render pagination controls
   */
  renderControls() {
    if (this.totalPages <= 1) {
      this.paginationContainer.innerHTML = '';
      this.paginationContainer.style.display = 'none';
      return;
    }

    this.paginationContainer.style.display = 'flex';
    
    const controls = [];
    
    // Previous button
    controls.push(
      `<button 
        class="pagination-btn pagination-prev ${this.currentPage === 1 ? 'disabled' : ''}" 
        data-action="prev"
        ${this.currentPage === 1 ? 'disabled' : ''}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M10 12l-4-4 4-4"/>
        </svg>
        Previous
      </button>`
    );

    // Page numbers with ellipsis logic
    const pageNumbers = this.getPageNumbersToDisplay();
    pageNumbers.forEach(page => {
      if (page === '...') {
        controls.push(`<span class="pagination-ellipsis">...</span>`);
      } else {
        controls.push(
          `<button 
            class="pagination-btn pagination-page ${page === this.currentPage ? 'active' : ''}" 
            data-page="${page}">
            ${page}
          </button>`
        );
      }
    });

    // Next button
    controls.push(
      `<button 
        class="pagination-btn pagination-next ${this.currentPage === this.totalPages ? 'disabled' : ''}" 
        data-action="next"
        ${this.currentPage === this.totalPages ? 'disabled' : ''}>
        Next
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M6 4l4 4-4 4"/>
        </svg>
      </button>`
    );

    // Page info
    const pageInfo = `
      <div class="pagination-info">
        Page ${this.currentPage} of ${this.totalPages} 
        (${this.filteredItems.length} artworks)
      </div>
    `;

    this.paginationContainer.innerHTML = controls.join('') + pageInfo;
    this.attachEventListeners();
  }

  /**
   * Get page numbers to display with ellipsis logic
   * @returns {Array} - Array of page numbers and ellipsis
   */
  getPageNumbersToDisplay() {
    const pages = [];
    const maxButtons = 7; // Maximum number of page buttons to show
    
    if (this.totalPages <= maxButtons) {
      // Show all pages if total is small
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate range around current page
      const leftBound = Math.max(2, this.currentPage - 1);
      const rightBound = Math.min(this.totalPages - 1, this.currentPage + 1);
      
      // Add ellipsis if needed before current range
      if (leftBound > 2) {
        pages.push('...');
      }
      
      // Add pages around current page
      for (let i = leftBound; i <= rightBound; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if needed after current range
      if (rightBound < this.totalPages - 1) {
        pages.push('...');
      }
      
      // Always show last page
      pages.push(this.totalPages);
    }
    
    return pages;
  }

  /**
   * Attach event listeners to pagination controls
   */
  attachEventListeners() {
    const buttons = this.paginationContainer.querySelectorAll('.pagination-btn');
    
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        const action = button.dataset.action;
        const page = button.dataset.page;
        
        if (action === 'prev') {
          this.previousPage();
        } else if (action === 'next') {
          this.nextPage();
        } else if (page) {
          this.goToPage(parseInt(page));
        }
      });
    });
  }

  /**
   * Main render method (to be overridden or extended)
   * This should be called after items are set
   */
  render() {
    // This method should be overridden in implementation
    // It should call getCurrentPageItems() and render them
    console.warn('Pagination.render() should be overridden in implementation');
  }

  /**
   * Update pagination (recalculate and re-render controls)
   */
  update() {
    this.calculateTotalPages();
    this.renderControls();
  }
}

/**
 * Add pagination styles dynamically
 */
function injectPaginationStyles() {
  const styleId = 'pagination-styles';
  
  // Check if styles already exist
  if (document.getElementById(styleId)) {
    return;
  }
  
  const styles = `
    .pagination-controls {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      margin: 2rem auto;
      padding: 1rem;
      flex-wrap: wrap;
    }

    .pagination-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.5rem 1rem;
      border: 2px solid var(--accent-color, #6c63ff);
      background: transparent;
      color: var(--text-color, #333);
      border-radius: 8px;
      cursor: pointer;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.3s ease;
      min-width: 40px;
      justify-content: center;
    }

    .pagination-btn:hover:not(.disabled) {
      background: var(--accent-color, #6c63ff);
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(108, 99, 255, 0.3);
    }

    .pagination-btn.active {
      background: var(--accent-color, #6c63ff);
      color: white;
      font-weight: 600;
    }

    .pagination-btn.disabled {
      opacity: 0.4;
      cursor: not-allowed;
      border-color: #ccc;
    }

    .pagination-btn svg {
      stroke: currentColor;
      fill: none;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .pagination-ellipsis {
      padding: 0.5rem 0.75rem;
      color: var(--text-color, #333);
      font-weight: 500;
    }

    .pagination-info {
      width: 100%;
      text-align: center;
      margin-top: 0.5rem;
      color: var(--text-color-muted, #666);
      font-size: 0.85rem;
      font-weight: 500;
    }

    /* Dark theme support */
    .dark-theme .pagination-btn {
      color: #fff;
      border-color: var(--accent-color, #6c63ff);
    }

    .dark-theme .pagination-ellipsis,
    .dark-theme .pagination-info {
      color: #ccc;
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .pagination-controls {
        gap: 0.25rem;
        padding: 0.75rem;
      }

      .pagination-btn {
        padding: 0.4rem 0.75rem;
        font-size: 0.85rem;
      }

      .pagination-prev span,
      .pagination-next span {
        display: none;
      }
    }
  `;
  
  const styleElement = document.createElement('style');
  styleElement.id = styleId;
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}

// Inject styles when module loads
injectPaginationStyles();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Pagination;
}
