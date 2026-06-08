import {useEffect} from 'react';

/**
 * Прокрутка вывода терминала внутри overflow-контейнера.
 * scrollIntoView на маркере внизу тянет за собой всю страницу (витрина /about/interactive).
 */
export function useTerminalBodyScroll(bodyRef, deps) {
  useEffect(() => {
    const body = bodyRef.current;
    if (!body) {
      return;
    }

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      body.scrollTop = body.scrollHeight;
      return;
    }

    body.scrollTo({top: body.scrollHeight, behavior: 'smooth'});
  }, deps);
}
