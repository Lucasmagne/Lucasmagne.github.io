(function () {
  const root = document.documentElement;
  const storageKey = 'lucas-portfolio-theme';

  function getSavedTheme() {
    try {
      return localStorage.getItem(storageKey);
    } catch (error) {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(storageKey, theme);
    } catch (error) {
      // The toggle still works when storage is unavailable, such as some file previews.
    }
  }

  const savedTheme = getSavedTheme();
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  root.dataset.theme = savedTheme || (prefersDark ? 'dark' : 'light');

  function setupThemeToggle() {
    const header = document.querySelector('.site-header-inner');
    if (!header || header.querySelector('.theme-toggle')) return;

    const button = document.createElement('button');
    button.className = 'theme-toggle';
    button.type = 'button';
    button.innerHTML = `
      <svg class="theme-icon theme-icon-moon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.2 15.2A8.6 8.6 0 0 1 8.8 3.8a8.6 8.6 0 1 0 11.4 11.4Z"/>
      </svg>
      <svg class="theme-icon theme-icon-sun" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="4"/>
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>
      </svg>`;

    function updateLabel() {
      const isDark = root.dataset.theme === 'dark';
      const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
      button.setAttribute('aria-label', label);
      button.title = label;
    }

    button.addEventListener('click', function () {
      const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = nextTheme;
      saveTheme(nextTheme);
      updateLabel();
    });

    updateLabel();
    header.appendChild(button);
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.setAttribute('readonly', '');
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    const copied = document.execCommand('copy');
    textArea.remove();

    if (!copied) throw new Error('Unable to copy email address');
  }

  function setupEmailCopy() {
    const button = document.querySelector('.social-email');
    const status = document.querySelector('.email-copy-status');
    if (!button) return;

    let resetTimer;
    button.addEventListener('click', async function () {
      const email = button.dataset.email;

      try {
        await copyText(email);
        button.classList.add('copied');
        button.setAttribute('aria-label', 'Email copied');
        button.title = 'Copied!';
        if (status) status.textContent = `${email} copied to clipboard`;

        clearTimeout(resetTimer);
        resetTimer = setTimeout(function () {
          button.classList.remove('copied');
          button.setAttribute('aria-label', 'Copy email address');
          button.title = 'Copy email address';
          if (status) status.textContent = '';
        }, 1800);
      } catch (error) {
        button.title = email;
        if (status) status.textContent = `Copy failed. Email address: ${email}`;
      }
    });
  }

  function setupPageInteractions() {
    setupThemeToggle();
    setupEmailCopy();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupPageInteractions);
  } else {
    setupPageInteractions();
  }
})();
