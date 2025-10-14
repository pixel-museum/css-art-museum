// sorting.js - manages sorting dropdown and logic

document.addEventListener('DOMContentLoaded', () => {
  const sortingDropdown = document.getElementById('sorting-dropdown');
  window.currentSort = 'newest'; // default sort

  if (sortingDropdown) {
    sortingDropdown.addEventListener('change', (e) => {
      window.currentSort = e.target.value;
      if (window.sortAndRenderArts) {
        window.sortAndRenderArts();
      }
    });
  }
});

// Sorting function
window.sortArts = function(arts) {
  switch (window.currentSort) {
    case 'oldest':
      return [...arts].sort((a, b) => (a.date || 0) - (b.date || 0));
    case 'newest':
      return [...arts].sort((a, b) => (b.date || 0) - (a.date || 0));
    case 'most-liked':
      return [...arts].sort((a, b) => (b.likes || 0) - (a.likes || 0));
    case 'least-liked':
      return [...arts].sort((a, b) => (a.likes || 0) - (b.likes || 0));
    default:
      return arts;
  }
};
