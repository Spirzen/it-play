import React from 'react';
import ItuLoader from './ItuLoader';

/** Заглушка вместо Docusaurus BrowserOnly fallback. */
export function demoLoadingFallback(message = 'Загрузка интерактивного демо…') {
  return (
    <ItuLoader
      title="Play IT"
      label={message}
      className="it-demo it-demo--loading"
    />
  );
}

export function demoSkeletonFallback(message = 'Загрузка интерактивного демо…') {
  return (
    <div className="it-demo">
      <ItuLoader title="Play IT" label={message} />
    </div>
  );
}
