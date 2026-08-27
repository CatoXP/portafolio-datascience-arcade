import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/** El CSS ya se apaga solo bajando tokens; esto es para la parte en JS
    (la maquina de estados del barrido, que usa la Web Animations API). */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(QUERY).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
