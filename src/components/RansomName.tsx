/** El elemento firma: el nombre como letras recortadas.

    Cada letra lleva rotacion, familia tipografica, escala, relleno y forma de
    papel propios. La configuracion es FIJA, no aleatoria en runtime: asi es
    estable entre renders, se puede afinar a mano y no cambia sola al navegar.

    Accesibilidad: las letras van con aria-hidden y el nombre real vive en el
    aria-label del <h1>. Hacerlas focusables meteria cinco paradas de
    tabulacion decorativas antes del contenido de verdad. */

interface Scrap {
  variant: 'a' | 'b' | 'c' | 'd';
  sans: boolean;
  rot: string;
  scale: number;
  clip: string;
  /** Direccion de entrada en el eje X, en unidades de --letter-rise. */
  dir: number;
}

const SCRAPS: readonly Scrap[] = [
  { variant: 'a', sans: false, rot: '-6deg', scale: 1.02, clip: 'var(--clip-scrap-2)', dir: -1 },
  { variant: 'b', sans: true, rot: '4.5deg', scale: 0.9, clip: 'var(--clip-scrap-4)', dir: 1 },
  { variant: 'c', sans: false, rot: '-2.5deg', scale: 1.12, clip: 'var(--clip-scrap-1)', dir: -1 },
  { variant: 'd', sans: true, rot: '7deg', scale: 0.86, clip: 'var(--clip-scrap-5)', dir: 1 },
  { variant: 'a', sans: false, rot: '-4deg', scale: 1.06, clip: 'var(--clip-scrap-3)', dir: -1 },
  { variant: 'b', sans: false, rot: '3deg', scale: 0.96, clip: 'var(--clip-scrap-2)', dir: 1 },
];

interface Props {
  name: string;
}

export function RansomName({ name }: Props) {
  const letters = [...name];

  return (
    <h1 className="ransom" aria-label={name}>
      {letters.map((char, i) => {
        const scrap = SCRAPS[i % SCRAPS.length] as Scrap;
        return (
          <span
            key={`${char}-${i}`}
            aria-hidden="true"
            className={`ransom__letter ransom__letter--${scrap.variant}${
              scrap.sans ? ' ransom__letter--sans' : ''
            }`}
            style={
              {
                '--i': i,
                '--rot': scrap.rot,
                '--scale': scrap.scale,
                '--clip': scrap.clip,
                '--dir': scrap.dir,
              } as React.CSSProperties
            }
          >
            {char}
          </span>
        );
      })}
    </h1>
  );
}
