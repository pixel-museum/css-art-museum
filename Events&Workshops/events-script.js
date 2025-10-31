// Lightweight JS for Events & Workshops page:
// - fetches GitHub star count
// - theme toggle (persisted)
// - simple register button mailto handler

(() => {
  const GITHUB_REPO = "pixel-museum/css-art-museum";
  const STAR_API = `https://api.github.com/repos/${GITHUB_REPO}`;
  const STAR_SELECTORS = ["#star-count-nav", "#star-count-nav-mobile"];

  // --- GitHub stars ---
  async function fetchStarCount() {
    try {
      const res = await fetch(STAR_API, { headers: { Accept: "application/vnd.github.v3+json" } });
      if (!res.ok) throw new Error("GitHub API error");
      const data = await res.json();
      const count = typeof data.stargazers_count === "number" ? data.stargazers_count : "...";
      STAR_SELECTORS.forEach(sel => {
        const el = document.querySelector(sel);
        if (el) el.textContent = count.toLocaleString();
      });
    } catch (e) {
      // degrade silently — show ellipsis
      STAR_SELECTORS.forEach(sel => {
        const el = document.querySelector(sel);
        if (el) el.textContent = "...";
      });
      // console.info can be helpful during dev
      // console.info("Could not fetch GitHub stars:", e);
    }
  }

  // --- Theme toggle (persists to localStorage) ---
  const THEME_KEY = "css-art-museum:theme"; // "dark" | "light"
  function applyTheme(theme) {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark-theme");
    else root.classList.remove("dark-theme");

    // update toggle buttons
    document.querySelectorAll(".theme-toggle").forEach(btn => {
      if (theme === "dark") btn.textContent = "☀️ Light";
      else btn.textContent = "🌙 Dark";
    });
  }

  function initThemeToggle() {
    const saved = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = saved || (prefersDark ? "dark" : "light");
    applyTheme(initial);

    document.querySelectorAll(".theme-toggle").forEach(btn => {
      btn.addEventListener("click", () => {
        const isDark = document.documentElement.classList.toggle("dark-theme");
        const newTheme = isDark ? "dark" : "light";
        localStorage.setItem(THEME_KEY, newTheme);
        applyTheme(newTheme);
      });
    });
  }

  // --- Register / action buttons: open mailto with event info ---
  function initRegisterButtons() {
    const buttons = Array.from(document.querySelectorAll(".register-btn"));
    if (!buttons.length) return;

    buttons.forEach(btn => {
      btn.addEventListener("click", e => {
        // If link points elsewhere, let it behave normally
        const href = btn.getAttribute("href");
        if (href && href.trim() && href.trim() !== "#") return;

        e.preventDefault();
        const card = btn.closest(".event-card");
        const titleEl = card ? card.querySelector("h3") : null;
        const timeEl = card ? card.querySelector("time, .date") : null;
        const title = titleEl ? titleEl.textContent.trim() : "Event";
        const time = timeEl ? timeEl.textContent.trim() : "";

        const to = "events@example.com";
        const subject = `Registration: ${title}`;
        const body = `Hello,\n\nI would like to register / get more info about the following event:\n\n${title}\n${time}\n\nPlease let me know the next steps.\n\nThanks.`;
        const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        // open mail client
        window.location.href = mailto;
      });
    });
  }

  // --- Init ---
  function init() {
    fetchStarCount();
    initThemeToggle();
    initRegisterButtons();
  }

  // Run once DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

// Lightweight handlers for Events page buttons: Register / Set Reminder / Get Notified / View Rules
(() => {
  // Utility: safe filename
  const safe = s => s.replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '-');

  // Build and download a simple .ics file (all-day or timed)
  function downloadICS({ title, description = '', start, end, allDay = false }) {
    const uid = `${Date.now()}@css-art-museum`;
    const dtstamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    let dtStart = start;
    let dtEnd = end;

    // ICS expects YYYYMMDD or YYYYMMDDTHHMMSSZ
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CSS Art Museum//EN',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${dtstamp}`,
    ];

    if (allDay) {
      // all-day uses VALUE=DATE
      lines.push(`DTSTART;VALUE=DATE:${dtStart}`);
      lines.push(`DTEND;VALUE=DATE:${dtEnd}`);
    } else {
      lines.push(`DTSTART:${dtStart}`);
      lines.push(`DTEND:${dtEnd}`);
    }

    lines.push(`SUMMARY:${title}`);
    if (description) lines.push(`DESCRIPTION:${description.replace(/\n/g, '\\n')}`);
    lines.push('END:VEVENT', 'END:VCALENDAR');

    const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${safe(title)}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // Parse card date/time into ICS-friendly strings
  function parseCardDate(timeEl) {
    if (!timeEl) return null;
    const datetime = timeEl.getAttribute('datetime') || '';
    const text = timeEl.textContent || '';

    // If datetime contains time (ISO-like), try to normalize to UTC timestamp for ICS
    if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(datetime)) {
      // assume ISO -> convert to YYYYMMDDTHHMMSSZ
      const d = new Date(datetime);
      const iso = d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      // default event length 1 hour
      const end = new Date(d.getTime() + 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      return { allDay: false, start: iso, end };
    }

    // Look for time in displayed text like "• 10:00 AM UTC" or "14:00 UTC"
    const timeMatch = text.match(/(\d{1,2}:\d{2})\s*(AM|PM)?\s*(UTC)?/i);
    const dateMatch = datetime.match(/^(\d{4})-(\d{2})-(\d{2})/);

    if (dateMatch) {
      const [, y, m, d] = dateMatch;
      if (timeMatch) {
        // parse time
        let [, hm, ampm] = timeMatch;
        let [hour, minute] = hm.split(':').map(Number);
        if (ampm) {
          ampm = ampm.toUpperCase();
          if (ampm === 'PM' && hour < 12) hour += 12;
          if (ampm === 'AM' && hour === 12) hour = 0;
        }
        // assume UTC (if no timezone info)
        const hh = String(hour).padStart(2, '0');
        const mm = String(minute).padStart(2, '0');
        const start = `${y}${m}${d}T${hh}${mm}00Z`;
        // default 1 hour event
        const dt = Date.UTC(Number(y), Number(m) - 1, Number(d), hour, minute);
        const endDt = new Date(dt + 60 * 60 * 1000);
        const end = endDt.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        return { allDay: false, start, end };
      } else {
        // all-day event: DTEND must be next day
        const startDate = `${y}${m}${d}`;
        const dt = new Date(Number(y), Number(m) - 1, Number(d));
        const next = new Date(dt.getTime() + 24 * 60 * 60 * 1000);
        const ny = next.getFullYear();
        const nm = String(next.getMonth() + 1).padStart(2, '0');
        const nd = String(next.getDate()).padStart(2, '0');
        const endDate = `${ny}${nm}${nd}`;
        return { allDay: true, start: startDate, end: endDate };
      }
    }

    return null;
  }

  // Create a mailto and open mail client
  function openMailTo({ to = 'events@example.com', subject = '', body = '' }) {
    const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  }

  // Initialize button handlers
  function initEventButtons() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.register-btn');
      if (!btn) return;
      // if real link, let it be
      const href = btn.getAttribute('href') || '';
      if (href && href.trim() && href.trim() !== '#') return;

      e.preventDefault();
      const card = btn.closest('.event-card');
      const title = card ? (card.querySelector('h3')?.textContent?.trim() || 'Event') : 'Event';
      const timeEl = card ? card.querySelector('time, .date') : null;
      const timeText = timeEl ? timeEl.textContent.trim() : '';

      const label = (btn.textContent || '').toLowerCase();

      if (label.includes('register') || label.includes('get notified') || label.includes('view rules')) {
        const subj = label.includes('register') ? `Registration: ${title}` : `Info: ${title}`;
        const body = `Hello,\n\nI would like more information / to register for:\n\n${title}\n${timeText}\n\nThanks.`;
        openMailTo({ subject: subj, body });
        return;
      }

      if (label.includes('set reminder') || label.includes('reminder')) {
        const parsed = parseCardDate(timeEl);
        let desc = card ? Array.from(card.querySelectorAll('p')).map(p => p.textContent.trim()).join('\n\n') : '';
        if (parsed) {
          downloadICS({ title, description: desc, start: parsed.start, end: parsed.end, allDay: parsed.allDay });
        } else {
          // fallback: open mailto asking to be reminded
          const subj = `Reminder request: ${title}`;
          const body = `Hi,\n\nPlease add me to reminders for:\n\n${title}\n${timeText}\n\nThanks.`;
          openMailTo({ subject: subj, body });
        }
        return;
      }

      // default fallback: mail
      openMailTo({
        subject: `Inquiry: ${title}`,
        body: `Hello,\n\nI have a question about ${title}.\n\nThanks.`
      });
    });
  }

  // Init on DOM ready
  function init() {
    initEventButtons();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();