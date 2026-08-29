import type { SectionId } from '../data/types';

/** Fondo decorativo: formas diagonales en deriva lenta, rayas, halftone y un
    estallido dentado. Toda la geometria se genera aqui: no hay imagenes.

    El atributo data-section deja que cada seccion module las cinco capas
    desde CSS. No cambia la paleta —eso rompería la unidad del sitio— sino el
    PESO de cada trama: cuanta rejilla, cuanta raya, cuanto rojo y donde cae
    el estallido. Asi cada area tiene identidad propia sin parecer otro sitio. */

/** Estrella dentada de radio alternado. Geometria original, calculada. */
function burstPoints(spikes: number, outer: number, inner: number): string {
  const pts: string[] = [];
  for (let i = 0; i < spikes * 2; i += 1) {
    const r = i % 2 === 0 ? outer : inner;
    const angle = (Math.PI * i) / spikes - Math.PI / 2;
    const x = 50 + r * Math.cos(angle);
    const y = 50 + r * Math.sin(angle);
    pts.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return pts.join(' ');
}

const BURST = burstPoints(22, 49, 31);

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
      {/* Envoltorio y svg separados: el envoltorio coloca y escala, el svg
          gira. Si compartieran transform, el giro pisaria la posicion. */}
      <div className="bg__burstWrap">
        <svg className="bg__burst" viewBox="0 0 100 100" focusable="false">
          <polygon points={BURST} fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}
