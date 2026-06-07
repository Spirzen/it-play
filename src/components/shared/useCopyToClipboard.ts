import {useCallback, useState} from 'react';

export default function useCopyToClipboard() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copy = useCallback(async (text: string, key = 'default') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 2000);
    } catch {
      /* ignore */
    }
  }, []);

  const isCopied = useCallback((key = 'default') => copiedKey === key, [copiedKey]);

  return {copy, isCopied};
}
