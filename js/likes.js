document.addEventListener("DOMContentLoaded", () => {
  const galleryContainer = document.getElementById("gallery-container");

  // This helper object is still needed for updating likes in local storage
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

  async function handleLikeClick(event) {
    const likeContainer = event.target.closest('.like-container');
    if (!likeContainer) return;

    const artId = likeContainer.dataset.id;
    const heartIcon = likeContainer.querySelector('.heart-icon');
    const countSpan = likeContainer.querySelector('span');
    let currentLikes = parseInt(countSpan.textContent, 10);

    // Optimistically update the UI
    if (LikedArtworks.isLiked(artId)) {
      // Unlike action
      countSpan.textContent = currentLikes - 1;
      heartIcon.classList.remove('liked');
      LikedArtworks.remove(artId);
      await unlikeArtworkApi(artId);
    } else {
      // Like action
      countSpan.textContent = currentLikes + 1;
      heartIcon.classList.add('liked');
      LikedArtworks.add(artId);
      await likeArtworkApi(artId);
    }
  }

  // The main responsibility is now just to listen for clicks on the gallery.
  galleryContainer.addEventListener('click', handleLikeClick);
});