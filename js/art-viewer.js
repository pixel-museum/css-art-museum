const preview = document.getElementById("artPreview");
const codeBlock = document.getElementById("codeBlock");
const fileNameEl = document.getElementById("fileName");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");
const themeToggle = document.getElementById("themeToggle");

// Apply theme from localStorage
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") document.body.classList.add("dark");

themeToggle.textContent = document.body.classList.contains("dark")
  ? "Light Mode"
  : "Dark Mode";

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark")
    ? "Light Mode"
    : "Dark Mode";
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
});

// File loading
function sanitizeFilename(raw) {
  if (!raw) return null;
  if (raw.includes("..") || raw.includes("/") || raw.includes("\\"))
    return null;
  return raw;
}

const params = new URLSearchParams(location.search);
const file = sanitizeFilename(params.get("file"));

if (!file) {
  fileNameEl.textContent = "Error";
  codeBlock.textContent =
    "No file specified or the filename is invalid. Please go back to the gallery and try again.";
} else {
  const filePath = `arts/${file}`;

  fileNameEl.textContent = file;
  preview.src = filePath;
  downloadBtn.href = filePath;
  downloadBtn.setAttribute("download", file);

  fetch(filePath, { cache: "no-store" })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.text();
    })
    .then((txt) => (codeBlock.textContent = txt))
    .catch(
      (err) => (codeBlock.textContent = `Error loading code: ${err.message}`)
    );
}

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(codeBlock.textContent);
    copyBtn.textContent = "Copied ✓";
    setTimeout(() => (copyBtn.textContent = "Copy"), 1500);
  } catch (e) {
    copyBtn.textContent = "Copy failed";
    setTimeout(() => (copyBtn.textContent = "Copy"), 1500);
  }
});

const likeContainer = document.querySelector(".like-container");
const heartIcon = likeContainer.querySelector(".heart-icon");
const likeCountEl = likeContainer.querySelector("span");

// --- LocalStorage helper for liked artworks ---
const LikedArtworks = {
  get: () => {
    try {
      const liked = localStorage.getItem("likedArtworks");
      return liked ? new Set(JSON.parse(liked)) : new Set();
    } catch (e) {
      return new Set();
    }
  },
  isLiked: (id) => LikedArtworks.get().has(id),
  add: (id) => {
    const liked = LikedArtworks.get();
    liked.add(id);
    localStorage.setItem("likedArtworks", JSON.stringify([...liked]));
  },
  remove: (id) => {
    const liked = LikedArtworks.get();
    liked.delete(id);
    localStorage.setItem("likedArtworks", JSON.stringify([...liked]));
  },
};

// --- Load artwork likes from backend ---
async function loadArtworkLikes(file) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/artworks/one/${encodeURIComponent(file)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const artwork = await res.json();

    likeCountEl.textContent = artwork.likes || 0;

    // Pre-fill heart from localStorage
    if (LikedArtworks.isLiked(file)) {
      heartIcon.classList.add("liked");
    } else {
      heartIcon.classList.remove("liked");
    }
  } catch (err) {
    console.error("Error fetching artwork likes:", err);
    likeCountEl.textContent = "—";
  }
}

// --- Toggle like/unlike ---
async function toggleLike(file) {
  try {
    const liked = LikedArtworks.isLiked(file);
    let updatedLikes;

    if (liked) {
      // Unlike
      heartIcon.classList.remove("liked");
      LikedArtworks.remove(file);
      const res = await fetch(`${BACKEND_URL}/api/artworks/unlike/${encodeURIComponent(file)}`, {
        method: "PUT",
      });
      const data = await res.json();
      updatedLikes = data.likes;
    } else {
      // Like
      heartIcon.classList.add("liked");
      LikedArtworks.add(file);
      const res = await fetch(`${BACKEND_URL}/api/artworks/like/${encodeURIComponent(file)}`, {
        method: "PUT",
      });
      const data = await res.json();
      updatedLikes = data.likes;
    }

    likeCountEl.textContent = updatedLikes || 0;
  } catch (err) {
    console.error("Error toggling like:", err);
  }
}

// --- Initialize ---
if (file) {
  loadArtworkLikes(file);

  likeContainer.addEventListener("click", () => {
    toggleLike(file);
  });
}
