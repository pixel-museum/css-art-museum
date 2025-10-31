/**
 * Share utilities for CSS Art Museum
 * Handles sharing, copying links, and exporting artwork
 */

class ShareUtils {
  constructor() {
    this.shareData = null;
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Use event delegation for share options
    document.addEventListener('click', (e) => {
      const shareOption = e.target.closest('.share-option');
      if (!shareOption) return;

      const action = shareOption.dataset.action;
      const card = shareOption.closest('.art-card');

      if (!card) return;

      const iframe = card.querySelector('iframe');
      const title = card.querySelector('.art-title')?.textContent || 'CSS Artwork';
      const author = card.querySelector('.art-author')?.textContent || 'Unknown';
      const url = window.location.origin + window.location.pathname + '#' + card.id;

      switch (action) {
        case 'share-native':
          this.shareNative(title, url, author);
          break;
        case 'copy-link':
          this.copyToClipboard(url);
          break;
        case 'download-source':
          this.downloadSource(iframe.src, title);
          break;
        case 'export-png':
          this.exportAsImage(card, title, 'png');
          break;
        case 'export-gif':
          this.exportAsImage(card, title, 'gif');
          break;
      }
    });
  }

  async shareNative(title, url, author) {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${title} by ${author}`,
          text: `Check out this CSS artwork: ${title} by ${author}`,
          url: url,
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        await this.copyToClipboard(url);
        this.showToast('Link copied to clipboard!');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error sharing:', err);
        this.showToast('Failed to share. Please try again.');
      }
    }
  }

  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      this.showToast('Link copied to clipboard!');
      return true;
    } catch (err) {
      console.error('Failed to copy:', err);
      this.showToast('Failed to copy. Please try again.');
      return false;
    }
  }

  async downloadSource(url, title) {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);

      this.showToast('Source file downloaded!');
    } catch (err) {
      console.error('Error downloading source:', err);
      this.showToast('Failed to download source.');
    }
  }

  async exportAsImage(card, title, format = 'png') {
    try {
      const iframe = card.querySelector('iframe');
      if (!iframe) throw new Error('No iframe found');

      const canvas = await html2canvas(iframe.contentDocument.documentElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
      });

      const dataUrl = canvas.toDataURL(`image/${format}`);
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      this.showToast(`Exported as ${format.toUpperCase()}!`);
    } catch (err) {
      console.error(`Error exporting as ${format}:`, err);
      this.showToast(`Failed to export as ${format}.`);
    }
  }

  showToast(message) {
    // Create toast if it doesn't exist
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);

      // Add toast styles
      const style = document.createElement('style');
      style.textContent = `
        .toast {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%) translateY(100px);
          background: var(--accent-color);
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          z-index: 9999;
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          pointer-events: none;
        }
        .toast.show {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      `;
      document.head.appendChild(style);
    }

    // Update and show toast
    toast.textContent = message;
    toast.classList.add('show');

    // Hide after delay
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
}

// Initialize share utils when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.shareUtils = new ShareUtils();
});