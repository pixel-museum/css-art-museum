document.addEventListener("DOMContentLoaded", () => {
  const galleryContainer = document.getElementById("gallery-container");
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
    add: (id) => {
      const liked = LikedArtworks.get();
      liked.add(id);
      localStorage.setItem('likedArtworks', JSON.stringify([...liked]));
    },
    remove: (id) => {
      const liked = LikedArtworks.get();
      liked.delete(id);
      localStorage.setItem('likedArtworks', JSON.stringify([...liked]));
    },
  };

  async function initializeLikes() {
    const artworksWithLikes = await getAllArtworksApi();
    const artLikesMap = new Map(artworksWithLikes.map(art => [art.id, art.likes]));

    const artCards = document.querySelectorAll('.art-card');

    artCards.forEach(card => {
      const likeContainer = card.querySelector('.like-container');
      const viewerButtonAnchor = card.querySelector('.view-code');
      
      if (likeContainer && viewerButtonAnchor) {
        const actionsWrapper = document.createElement('div');
        actionsWrapper.className = 'card-actions';

        actionsWrapper.appendChild(viewerButtonAnchor);
        actionsWrapper.appendChild(likeContainer);
        
        card.appendChild(actionsWrapper);
      }

      const artId = likeContainer?.dataset.id;
      if (!artId) return;

      const likeCount = artLikesMap.get(artId) || 0;
      const heartIcon = likeContainer.querySelector('.heart-icon');
      const countSpan = likeContainer.querySelector('span');

      countSpan.textContent = likeCount;

      if (LikedArtworks.isLiked(artId)) {
        heartIcon.classList.add('liked');
      }
    });
  }


  async function handleLikeClick(event) {
    const likeContainer = event.target.closest('.like-container');
    if (!likeContainer) return;

    const artId = likeContainer.dataset.id;
    const heartIcon = likeContainer.querySelector('.heart-icon');
    const countSpan = likeContainer.querySelector('span');
    let currentLikes = parseInt(countSpan.textContent, 10);

    // Optimistically update the UI
    if (LikedArtworks.isLiked(artId)) {
      countSpan.textContent = currentLikes - 1;
      heartIcon.classList.remove('liked');
      LikedArtworks.remove(artId);
      // Call the API function from apiService.js
      await unlikeArtworkApi(artId);
    } else {
      countSpan.textContent = currentLikes + 1;
      heartIcon.classList.add('liked');
      LikedArtworks.add(artId);
      // Call the API function from apiService.js
      await likeArtworkApi(artId);
    }
  }

  setTimeout(initializeLikes, 500);

  galleryContainer.addEventListener('click', handleLikeClick);
});

