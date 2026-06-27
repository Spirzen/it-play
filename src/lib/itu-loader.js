const BOOK_COVER = `<svg class="itu-loader__book-cover" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 126 75" aria-hidden="true">
  <rect x="2.5" y="2.5" width="121" height="70" rx="7.5" fill="#fff" stroke="var(--itu-loader-accent, #7b68ee)" stroke-width="5"></rect>
  <line x1="63.5" x2="63.5" y2="75" stroke="var(--itu-loader-accent, #7b68ee)" stroke-width="5"></line>
  <path stroke-linecap="round" stroke-width="4" stroke="#9370db" d="M25 20H50"></path>
  <path stroke-linecap="round" stroke-width="4" stroke="#9370db" d="M101 20H76"></path>
  <path stroke-linecap="round" stroke-width="4" stroke="#b19cd9" d="M16 30L50 30"></path>
  <path stroke-linecap="round" stroke-width="4" stroke="#b19cd9" d="M110 30L76 30"></path>
</svg>`;

const BOOK_PAGE = `<svg class="itu-loader__book-page" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 65 75" aria-hidden="true">
  <path fill="#ffffffb8" stroke="var(--itu-loader-accent, #7b68ee)" stroke-width="5" d="M2.5 2.5H55C59.1421 2.5 62.5 5.85786 62.5 10V65C62.5 69.1421 59.1421 72.5 55 72.5H2.5V2.5Z"></path>
  <path stroke-linecap="round" stroke-width="4" stroke="#9370db" d="M40 20H15"></path>
  <path stroke-linecap="round" stroke-width="4" stroke="#b19cd9" d="M49 30L15 30"></path>
</svg>`;

/**
 * @param {{ label?: string, title?: string, compact?: boolean }} [options]
 */
export function loaderMarkup(options = {}) {
  const title = options.title ?? 'Вселенная IT';
  const label = options.label ?? 'Загрузка…';
  const labelHtml = options.compact
    ? `<p class="itu-loader__label">${escapeHtml(label)}</p>`
    : `<p class="itu-loader__label"><strong>${escapeHtml(title)}</strong>${escapeHtml(label)}</p>`;

  return `<div class="itu-loader">
  <div class="itu-loader__stage">
    <div class="itu-loader__orbs" aria-hidden="true"><span></span><span></span><span></span></div>
    <div class="itu-loader__book">${BOOK_COVER}${BOOK_PAGE}</div>
  </div>
  ${labelHtml}
</div>`;
}

/**
 * @param {HTMLElement} container
 * @param {{ label?: string, title?: string, compact?: boolean, variant?: 'overlay'|'page'|'inline' }} [options]
 */
export function mountLoader(container, options = {}) {
  container.innerHTML = loaderMarkup(options);
  container.classList.add('itu-loader-host');
  if (options.variant === 'overlay') {
    container.classList.add('itu-loader-host--overlay');
  }
  if (options.variant === 'page') {
    container.classList.add('itu-loader-host--page');
  }
  container.setAttribute('role', 'status');
  container.setAttribute('aria-live', 'polite');
  return container;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
