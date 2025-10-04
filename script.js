document.querySelectorAll(".art-card").forEach((card) => {
  const iframe = card.querySelector("iframe");
  if (!iframe) return;

  const artSrc = iframe.getAttribute("src");

  const anchor = document.createElement("a");
  anchor.classList.add("view-code");

  const button = document.createElement("button");
  button.textContent = "Art Viewer";

  button.addEventListener("click", (e) => {
    e.preventDefault();
    const isDark = document.body.classList.contains("dark-theme");
    const url = `art-viewer.html?file=${encodeURIComponent(artSrc)}&dark=${isDark}`;
    window.location.href = url;
  });

  anchor.appendChild(button);
  card.appendChild(anchor);
});
