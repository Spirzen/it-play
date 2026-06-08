import React from 'react';
import BrowserOnly from '@/components/shared/BrowserOnly';
import DemoShell from './DemoShell';
import {demoLoadingFallback} from './demoFallback';

/**
 * Оборачивает клиентский демо-компонент в BrowserOnly + DemoShell.
 */
export function withBrowserOnly(Component, {loadingMessage, wrapDemo = true} = {}) {
  const Wrapped = (props) => (
    <BrowserOnly fallback={demoLoadingFallback(loadingMessage)}>
      {() =>
        wrapDemo ? (
          <DemoShell>
            <Component {...props} />
          </DemoShell>
        ) : (
          <Component {...props} />
        )
      }
    </BrowserOnly>
  );
  Wrapped.displayName = `BrowserOnly(${Component.displayName || Component.name || 'Demo'})`;
  return Wrapped;
}

export default withBrowserOnly;
