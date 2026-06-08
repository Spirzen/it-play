import React from 'react';

export function demoLoadingFallback(message = 'Загрузка интерактивного демо…') {
  return <div className="it-demo it-demo--loading">{message}</div>;
}

export function demoSkeletonFallback() {
  return (
    <div className="it-demo">
      <div className="it-demo__skeleton" aria-hidden="true" />
    </div>
  );
}
