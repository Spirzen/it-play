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

/** Полноэкранный режим для интерактивных демо (Escape — выход). */
export default function useDemoFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!isFullscreen) {
      notifyParentFullscreen(false);
      return undefined;
    }
    notifyParentFullscreen(true);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      notifyParentFullscreen(false);
    };
  }, [isFullscreen]);

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
