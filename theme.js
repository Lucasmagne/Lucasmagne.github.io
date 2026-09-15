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

  function setupFooterContacts() {
    const contacts = document.querySelector('.footer-contacts');
    if (!contacts || contacts.children.length) return;

    contacts.innerHTML = `
      <a class="social-link social-instagram" href="https://www.instagram.com/lucas.magne_/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5"/>
          <circle cx="12" cy="12" r="4"/>
          <circle class="social-icon-dot" cx="17.5" cy="6.5" r="1"/>
        </svg>
      </a>
      <a class="social-link social-linkedin" href="https://www.linkedin.com/in/lucas-su-93b928275/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6.5 8.2H3.4V21h3.1V8.2ZM5 3A2 2 0 1 0 5 7a2 2 0 0 0 0-4ZM21 13.7c0-3.9-2.1-5.7-4.9-5.7-2.3 0-3.3 1.3-3.9 2.2v-2H9.1V21h3.1v-6.3c0-1.7.3-3.3 2.4-3.3 2 0 2.1 1.9 2.1 3.4V21H21v-7.3Z"/>
        </svg>
      </a>
      <a class="social-link social-github" href="https://github.com/lucasmagne" target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.87c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 6.82a9.6 9.6 0 0 1 2.5.34c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/>
        </svg>
      </a>
      <button class="social-link social-email" type="button" data-email="lucas.su29@gmail.com" aria-label="Copy email address" title="Copy email address">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="2"/>
          <path d="m4 7 8 6 8-6"/>
        </svg>
      </button>
      <span class="sr-only email-copy-status" aria-live="polite"></span>`;
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
    setupFooterContacts();
    setupEmailCopy();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupPageInteractions);
  } else {
    setupPageInteractions();
  }
})();
