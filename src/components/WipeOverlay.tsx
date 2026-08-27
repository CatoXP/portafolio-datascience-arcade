import type { RefObject } from 'react';

interface Props {
  barRef: RefObject<HTMLDivElement | null>;
}

/** Tres elementos, un trabajo cada uno.

    .wipe       fijo y contenido, nunca se mueve
    .wipe__skew inclinacion y dentado ESTATICOS, nunca se animan
    .wipe__bar  lo unico que se anima, y solo con transform

    Separarlos es lo que permite que la animacion sea una traslacion pura:
    si el skew viviera en la barra, habria que descomponer la matriz para
    poder retomar un barrido interrumpido a media pantalla.

    Siempre aria-hidden y pointer-events:none: el barrido no puede aparecer
    en el arbol de accesibilidad ni tragarse un click. */
export function WipeOverlay({ barRef }: Props) {
  return (
    <div className="wipe" aria-hidden="true">
      <div className="wipe__skew u-shape" style={{ ['--clip' as string]: 'var(--clip-wipe)' }}>
        <div className="wipe__bar" ref={barRef} />
      </div>
    </div>
  );
}
