import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import type { SectionId } from '../data/types';

export type WipePhase = 'idle' | 'covering' | 'revealing';

const COVER = 260;
const REVEAL = 300;
const EASE_IN = 'cubic-bezier(0.7, 0, 0.84, 0)';
const EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)';
const OFF_LEFT = 'translate3d(-140%, 0, 0)';
const CENTER = 'translate3d(0, 0, 0)';
const OFF_RIGHT = 'translate3d(140%, 0, 0)';

/** Barrido diagonal entre secciones.

   Se usa la Web Animations API y no clases CSS porque hace falta cambiar el
   DOM en un instante exacto a mitad de la animacion, y porque da promesas
   `finished` y `cancel()` para sobrevivir a pulsaciones rapidas. */
export function useWipeTransition(
  commit: (id: SectionId) => void,
  reducedMotion: boolean,
) {
  const barRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<Animation | null>(null);
  const runRef = useRef(0);
  const [phase, setPhase] = useState<WipePhase>('idle');

  useEffect(() => () => animRef.current?.cancel(), []);

  const play = useCallback(
    async (next: SectionId) => {
      const bar = barRef.current;

      // Con movimiento reducido no hay barrido: se cambia y ya.
      if (!bar || reducedMotion || typeof bar.animate !== 'function') {
        commit(next);
        return;
      }

      // Token de generacion: cada llamada invalida a las anteriores.
      const run = runRef.current + 1;
      runRef.current = run;

      // Si ya hay un barrido en pantalla, se recoge la barra donde este en
      // vez de teletransportarla fuera. La lectura va ANTES del cancel:
      // cancelar una animacion con fill:forwards devuelve el elemento a su
      // transform base y se perderia la posicion.
      const from = animRef.current ? getComputedStyle(bar).transform : OFF_LEFT;
      animRef.current?.cancel();

      setPhase('covering');
      const cover = bar.animate(
        [{ transform: from === 'none' ? OFF_LEFT : from }, { transform: CENTER }],
        { duration: COVER, easing: EASE_IN, fill: 'forwards' },
      );
      animRef.current = cover;

      try {
        await cover.finished;
      } catch {
        // cancel() rechaza la promesa. Una ejecucion mas nueva manda ahora.
        return;
      }
      if (runRef.current !== run) return;

      // flushSync es imprescindible: garantiza que el DOM ya cambio antes de
      // arrancar el destape. Sin esto se ve un fotograma del panel viejo
      // asomando por el borde de salida de la barra.
      flushSync(() => commit(next));

      setPhase('revealing');
      const reveal = bar.animate([{ transform: CENTER }, { transform: OFF_RIGHT }], {
        duration: REVEAL,
        easing: EASE_OUT,
        fill: 'forwards',
      });
      animRef.current = reveal;

      try {
        await reveal.finished;
      } catch {
        return;
      }
      if (runRef.current !== run) return;

      animRef.current = null;
      setPhase('idle');
    },
    [commit, reducedMotion],
  );

  return { barRef, phase, play };
}
