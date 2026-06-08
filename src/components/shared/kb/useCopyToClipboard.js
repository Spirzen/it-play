import {useCallback, useState} from 'react';

export default function useCopyToClipboard(resetMs = 2000) {
  const [copiedKey, setCopiedKey] = useState(null);

  const copy = useCallback(
    async (text, key = 'default') => {
      if (!text) {
        return false;
      }
      try {
        await navigator.clipboard.writeText(text);
        setCopiedKey(key);
        window.setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), resetMs);
        return true;
      } catch {
        return false;
      }
    },
    [resetMs],
  );

  return {copy, copiedKey, isCopied: (key = 'default') => copiedKey === key};
}
