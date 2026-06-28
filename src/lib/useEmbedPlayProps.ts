import {useEffect, useMemo, useState} from 'react';

const TRUSTED_PARENT_ORIGINS = new Set([
  'https://spirzen.ru',
  'https://www.spirzen.ru',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
]);

export function isEmbedPage(): boolean {
  if (typeof window === 'undefined') return false;
  return window.location.pathname.includes('/p/embed/');
}

function parseUrlPlayProps(): Record<string, unknown> {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const out: Record<string, unknown> = {};
  for (const [key, value] of params.entries()) {
    if (key === 'theme') continue;
    if (value === 'true') {
      out[key] = true;
      continue;
    }
    if (value === 'false') {
      out[key] = false;
      continue;
    }
    try {
      out[key] = JSON.parse(value);
    } catch {
      out[key] = value;
    }
  }
  return out;
}

function isTrustedParentOrigin(origin: string): boolean {
  if (TRUSTED_PARENT_ORIGINS.has(origin)) {
    return true;
  }
  try {
    const {hostname} = new URL(origin);
    if (hostname === 'spirzen.ru' || hostname.endsWith('.spirzen.ru')) {
      return true;
    }
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return true;
    }
  } catch {
    /* ignore */
  }
  return false;
}

/**
 * Props for embed pages: URL query params merged with parent postMessage payload.
 * Parent sends `{ type: 'it-play-embed-data', payload: {...} }` after iframe load.
 */
export function useEmbedPlayProps(): Record<string, unknown> {
  const [urlProps, setUrlProps] = useState(parseUrlPlayProps);
  const [messageProps, setMessageProps] = useState<Record<string, unknown>>({});

  useEffect(() => {
    setUrlProps(parseUrlPlayProps());
  }, []);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (!isTrustedParentOrigin(event.origin)) return;
      const data = event.data;
      if (!data || typeof data !== 'object') return;
      if (data.type !== 'it-play-embed-data') return;
      if (!data.payload || typeof data.payload !== 'object') return;
      setMessageProps(data.payload as Record<string, unknown>);
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  return useMemo(() => ({...urlProps, ...messageProps}), [messageProps, urlProps]);
}

/** True once URL params are readable on the client (always true after hydration on embed). */
export function useEmbedPlayPropsReady(): boolean {
  const [ready, setReady] = useState(() => typeof window !== 'undefined');

  useEffect(() => {
    setReady(true);
  }, []);

  return ready;
}
