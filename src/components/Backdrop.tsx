import type { ReactNode } from 'react';
import type { SectionId } from '../data/types';

/** Fondo decorativo. Toda la geometria se genera aqui con codigo: no hay
    imagenes ni assets externos.

    Cada seccion tiene su PROPIA figura, no la misma desplazada. Mover un
    unico elemento entre secciones es un cambio de parametro y se nota como
    tal; cinco geometrias distintas es lo que hace que cada area se sienta
    otro sitio. Las cinco comparten paleta y trazo para que el conjunto siga
    leyendose como un solo diseño. */

/* Generador determinista. Math.random daria una figura distinta en cada
   render y el fondo saltaria al repintar; con una secuencia sembrada la
   dispersion se ve casual pero es siempre la misma. */
function seeded(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

/** INICIO — estallido dentado de radio alternado. */
function Burst(): ReactNode {
  const spikes = 22;
  const pts: string[] = [];
  for (let i = 0; i < spikes * 2; i += 1) {
    const r = i % 2 === 0 ? 49 : 31;
    const a = (Math.PI * i) / spikes - Math.PI / 2;
    pts.push(`${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`);
  }
  return <polygon points={pts.join(' ')} fill="currentColor" />;
}

/** SOBRE MI — anillos partidos, como sello de expediente. Sin relleno: la
    seccion de lectura larga pide una figura que no sea una mancha. */
function Rings(): ReactNode {
  return (
    <g fill="none" stroke="currentColor">
      {[47, 38, 29, 20, 11].map((r, i) => (
        <circle
          key={r}
          cx="50"
          cy="50"
          r={r}
          strokeWidth={i % 2 === 0 ? 2.6 : 1.1}
          strokeDasharray={`${9 + i * 4} ${5 + i * 3}`}
        />
      ))}
    </g>
  );
}

/** PROYECTOS — campo de bloques inclinados, en eco de las tarjetas. */
function Blocks(): ReactNode {
  const rnd = seeded(20260829);
  const rects = Array.from({ length: 30 }, () => ({
    x: rnd() * 104 - 6,
    y: rnd() * 104 - 6,
    w: 3 + rnd() * 15,
    h: 1.6 + rnd() * 4.5,
  }));
  return (
    <g transform="skewX(-12)" fill="currentColor">
      {rects.map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} />
      ))}
    </g>
  );
}

/** SKILLS — abanico de rayos de largo desigual, en eco de los medidores. */
function Rays(): ReactNode {
  const n = 40;
  const lines = Array.from({ length: n }, (_, i) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    const r2 = 26 + ((i * 37) % 23);
    return {
      x1: 50 + 13 * Math.cos(a),
      y1: 50 + 13 * Math.sin(a),
      x2: 50 + r2 * Math.cos(a),
      y2: 50 + r2 * Math.sin(a),
      w: i % 3 === 0 ? 2.4 : 1.1,
    };
  });
  return (
    <g stroke="currentColor">
      {lines.map((l, i) => (
        <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} strokeWidth={l.w} />
      ))}
    </g>
  );
}

/** CONTACTO — galones anidados: direccion y cierre. */
function Chevrons(): ReactNode {
  return (
    <g fill="none" stroke="currentColor" strokeLinejoin="miter">
      {Array.from({ length: 7 }, (_, i) => {
        const o = i * 10;
        return (
          <polyline
            key={i}
            points={`4,${8 + o} 50,${34 + o} 96,${8 + o}`}
            strokeWidth={i % 2 === 0 ? 3.2 : 1.4}
          />
        );
      })}
    </g>
  );
}

/* Ritmos de giro distintos por figura para que el conjunto no se lea
   sincronizado. La direccion se decide en CSS con animation-direction. */
const ART: ReadonlyArray<{ id: SectionId; node: ReactNode; spin: string; rev: boolean }> = [
  { id: 'inicio', node: <Burst />, spin: '180s', rev: false },
  { id: 'sobre-mi', node: <Rings />, spin: '260s', rev: true },
  { id: 'proyectos', node: <Blocks />, spin: '320s', rev: false },
  { id: 'skills', node: <Rays />, spin: '150s', rev: true },
  { id: 'contacto', node: <Chevrons />, spin: '240s', rev: false },
];

interface Props {
  section: SectionId;
}

export function Backdrop({ section }: Props) {
  return (
    <div className="bg" data-section={section} aria-hidden="true">
      <div className="bg__shape bg__shape--a" />
      <div className="bg__shape bg__shape--b" />
      <div className="bg__stripes u-stripes" />
      <div className="bg__dots u-halftone" />

      {/* El envoltorio coloca y escala; cada svg se funde y gira por su
          cuenta. Si compartieran transform, el giro pisaria la posicion. */}
      <div className="bg__artWrap">
        {ART.map((art) => (
          <svg
            key={art.id}
            className="bg__art"
            data-on={art.id === section ? '' : undefined}
            data-rev={art.rev ? '' : undefined}
            viewBox="0 0 100 100"
            focusable="false"
            style={{ ['--spin' as string]: art.spin }}
          >
            {art.node}
          </svg>
        ))}
      </div>
    </div>
  );
}
