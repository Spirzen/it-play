import React, {useEffect, useState} from 'react';

/** Client-only gate (замена @docusaurus/BrowserOnly для Astro/Vite). */
export default function BrowserOnly({children, fallback = null}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return fallback;
  }

  return typeof children === 'function' ? children() : children;
}
