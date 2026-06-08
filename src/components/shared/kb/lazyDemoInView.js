import React, {lazy, Suspense, useEffect, useRef, useState} from 'react';
import {demoSkeletonFallback} from './demoFallback';

const DEFAULT_ROOT_MARGIN = '120px 0px';

/**
 * Ленивая загрузка демо только когда блок попадает в viewport (или близко к нему).
 * Для витрин с десятками демо на одной странице — не грузить все chunks сразу.
 */
export default function lazyDemoInView(importFn, options = {}) {
  const rootMargin = options.rootMargin ?? DEFAULT_ROOT_MARGIN;
  const LazyComponent = lazy(importFn);

  function LazyDemoInView(props) {
    const hostRef = useRef(null);
    const [shouldLoad, setShouldLoad] = useState(false);

    useEffect(() => {
      if (shouldLoad) {
        return undefined;
      }

      const host = hostRef.current;
      if (!host) {
        return undefined;
      }

      if (typeof IntersectionObserver === 'undefined') {
        setShouldLoad(true);
        return undefined;
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        },
        {rootMargin},
      );

      observer.observe(host);
      return () => observer.disconnect();
    }, [shouldLoad]);

    return (
      <div ref={hostRef} className="it-demo-lazy-host">
        {shouldLoad ? (
          <Suspense fallback={demoSkeletonFallback()}>
            <LazyComponent {...props} />
          </Suspense>
        ) : (
          demoSkeletonFallback()
        )}
      </div>
    );
  }

  LazyDemoInView.displayName = 'LazyDemoInView';
  return LazyDemoInView;
}
