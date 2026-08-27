import { Fragment } from 'react';
import type { ReactNode } from 'react';

/** Convierte los **tramos** marcados del texto en <strong>.

    Es deliberadamente diminuto en vez de traer una libreria de markdown: el
    contenido lo escribo yo en src/data y solo necesita negritas. Nunca se usa
    dangerouslySetInnerHTML, asi que no hay superficie de inyeccion. */
export function emphasize(text: string): ReactNode {
  return text.split(/\*\*(.+?)\*\*/g).map((chunk, i) =>
    i % 2 === 1 ? <strong key={i}>{chunk}</strong> : <Fragment key={i}>{chunk}</Fragment>,
  );
}
