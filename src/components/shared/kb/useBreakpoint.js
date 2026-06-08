import {useEffect, useState} from 'react';

const QUERIES = {
  mobile: '(max-width: 768px)',
  tablet: '(max-width: 1024px)',
};

/**
 * Адаптивность для демо-компонентов (SSR-safe после mount).
 */
export default function useBreakpoint() {
  const [state, setState] = useState({
    isMobile: false,
    isTablet: false,
    width: 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const mobileMq = window.matchMedia(QUERIES.mobile);
    const tabletMq = window.matchMedia(QUERIES.tablet);

    const update = () => {
      const width = window.innerWidth;
      setState({
        width,
        isMobile: mobileMq.matches,
        isTablet: tabletMq.matches && !mobileMq.matches,
      });
    };

    update();
    mobileMq.addEventListener('change', update);
    tabletMq.addEventListener('change', update);
    window.addEventListener('resize', update);

    return () => {
      mobileMq.removeEventListener('change', update);
      tabletMq.removeEventListener('change', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return state;
}
