/** Fondo decorativo: formas diagonales en deriva lenta, rayas, halftone y un
    estallido dentado. Toda la geometria se genera aqui: no hay imagenes. */

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

export function Backdrop() {
  return (
    <div className="bg" aria-hidden="true">
      <div className="bg__shape bg__shape--a" />
      <div className="bg__shape bg__shape--b" />
      <div className="bg__stripes u-stripes" />
      <div className="bg__dots u-halftone" />
      <svg className="bg__burst" viewBox="0 0 100 100" focusable="false">
        <polygon points={BURST} fill="currentColor" />
      </svg>
    </div>
  );
}
