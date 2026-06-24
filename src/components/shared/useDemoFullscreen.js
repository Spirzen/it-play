import {useCallback, useEffect, useState} from 'react';

var FALLBACK_PARENT_ORIGINS = [
  'https://spirzen.ru',
  'https://www.spirzen.ru',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

function isEmbedContext() {
  if (typeof window === 'undefined') return false;
  return window.location.pathname.indexOf('/p/embed/') !== -1;
}

function isEmbeddedInParent() {
  if (typeof window === 'undefined') return false;
  try {
    return window.parent && window.parent !== window;
  } catch (e) {
    return true;
  }
}

function resolveParentOrigin() {
  if (!isEmbeddedInParent()) return null;
  try {
    return window.parent.location.origin;
  } catch (e) {
    if (typeof document !== 'undefined' && document.referrer) {
      try {
        return new URL(document.referrer).origin;
      } catch (e2) {
        /* ignore */
      }
    }
  }
  return null;
}

function postToParent(message) {
  if (!isEmbeddedInParent()) return;
  var origin = resolveParentOrigin();
  if (origin) {
    try {
      window.parent.postMessage(message, origin);
    } catch (e) {
      /* ignore */
    }
    return;
  }
  FALLBACK_PARENT_ORIGINS.forEach(function (fallbackOrigin) {
    try {
      window.parent.postMessage(message, fallbackOrigin);
    } catch (e) {
      /* ignore */
    }
  });
}

function notifyParentFullscreen(active) {
  if (!isEmbedContext() || !isEmbeddedInParent()) return;
  postToParent({type: 'it-play-fullscreen', active: active});
}

function syncFullscreenDom(active) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (active) {
    root.setAttribute('data-it-demo-fullscreen', '');
    if (!isEmbeddedInParent()) {
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
      const allowed = resolveParentOrigin() || FALLBACK_PARENT_ORIGINS;
      const origins = Array.isArray(allowed) ? allowed : [allowed];
      if (!origins.includes(event.origin)) return;
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
