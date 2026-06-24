import {useCallback, useEffect, useState} from 'react';

var EMBED_PARENT_ORIGINS = [
  'https://spirzen.ru',
  'https://www.spirzen.ru',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

function isEmbedContext() {
  if (typeof window === 'undefined') return false;
  return window.location.pathname.indexOf('/p/embed/') !== -1;
}

function notifyParentFullscreen(active) {
  if (!isEmbedContext() || !window.parent || window.parent === window) return;
  EMBED_PARENT_ORIGINS.forEach(function (origin) {
    try {
      window.parent.postMessage({type: 'it-play-fullscreen', active: active}, origin);
    } catch (e) {
      /* ignore */
    }
  });
}

function syncFullscreenDom(active) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (active) {
    root.setAttribute('data-it-demo-fullscreen', '');
    if (isEmbedContext()) {
      const main = document.querySelector('.embed-main');
      if (main) {
        main.style.minHeight = `${Math.ceil(main.offsetHeight)}px`;
      }
    } else {
      root.classList.add('it-demo-fullscreen-lock');
    }
  } else {
    root.removeAttribute('data-it-demo-fullscreen');
    root.classList.remove('it-demo-fullscreen-lock');
  }
  window.dispatchEvent(new CustomEvent('it-demo-fullscreen-change', {detail: {active}}));
}

/** Полноэкранный режим для интерактивных демо (Escape — выход). */
export default function useDemoFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    syncFullscreenDom(isFullscreen);
    notifyParentFullscreen(isFullscreen);

    if (!isFullscreen) {
      return undefined;
    }

    const onKey = (e) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
    };
  }, [isFullscreen]);

  useEffect(() => {
    return () => {
      syncFullscreenDom(false);
      notifyParentFullscreen(false);
    };
  }, []);

  useEffect(() => {
    if (!isEmbedContext()) return undefined;
    const onMessage = (event) => {
      if (!EMBED_PARENT_ORIGINS.includes(event.origin)) return;
      const data = event.data;
      if (!data || typeof data !== 'object') return;
      if (data.type === 'it-play-fullscreen-close') {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((v) => !v);
  }, []);

  return {
    isFullscreen,
    setIsFullscreen,
    toggleFullscreen,
    fullscreenClass: isFullscreen ? 'it-demo--fullscreen' : undefined,
  };
}
