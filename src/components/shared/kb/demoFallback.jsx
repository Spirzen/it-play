import React from 'react';
import ItuLoader from '../shared/ItuLoader.jsx';

export function demoLoadingFallback(message = 'Загрузка интерактивного демо…') {
  return <ItuLoader title="Play IT" label={message} className="it-demo it-demo--loading" />;
}

export function demoSkeletonFallback() {
  return (
    <div className="it-demo">
      <ItuLoader title="Play IT" label="Загрузка интерактивного демо…" />
    </div>
  );
}
