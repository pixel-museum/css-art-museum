;(() => {
  const toggle = document.getElementById("mobileToggle")
  const menu = document.getElementById("mobileMenu")
  const themeDesktop = document.getElementById("themeToggle")
  const themeMobile = document.getElementById("themeToggleMobile")

  if (!toggle || !menu) return

  function setExpanded(isOpen) {
    toggle.setAttribute("aria-expanded", String(isOpen))
    if (isOpen) {
      menu.removeAttribute("hidden")
    } else {
      menu.setAttribute("hidden", "")
    }
  }

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true"
    setExpanded(!isOpen)
  })

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true"
    if (!isOpen) return
    const withinToggle = toggle.contains(e.target)
    const withinMenu = menu.contains(e.target)
    if (!withinToggle && !withinMenu) setExpanded(false)
  })

  // Optional: sync theme toggle between desktop and mobile buttons if both exist
  function syncThemeButtons(from, to) {
    if (!from || !to) return
    to.addEventListener("click", () => from.click())
  }
  syncThemeButtons(themeDesktop, themeMobile)
})()
