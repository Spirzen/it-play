import type {ReactNode} from 'react';

/** Заглушка вместо Docusaurus BrowserOnly fallback. */
export function demoLoadingFallback(message = 'Компонент загружается…'): ReactNode {
  return (
    <div className="it-demo it-demo--loading" role="status" aria-live="polite">
      {message}
    </div>
  );
}

export function demoSkeletonFallback(message = 'Компонент загружается…'): ReactNode {
  return (
    <div className="it-demo">
      <div className="it-demo__skeleton" aria-hidden="true" />
      <div className="it-demo it-demo--loading" role="status" aria-live="polite" style={{marginTop: '0.75rem'}}>
        {message}
      </div>
    </div>
  );
}
