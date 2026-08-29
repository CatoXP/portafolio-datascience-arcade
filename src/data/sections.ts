import type { SectionDef } from './types';

/** Orden del menu. El indice que se pinta sale de la posicion en este array. */
export const SECTIONS: readonly SectionDef[] = [
  { id: 'inicio', label: 'Inicio', blurb: 'Quién soy, en una línea.' },
  {
    id: 'sobre-mi',
    label: 'Sobre mí',
    blurb: 'Formación, HSBC y por dónde he pasado.',
  },
  {
    id: 'proyectos',
    label: 'Proyectos',
    blurb: 'Cinco proyectos, de riesgo crediticio a visión por computadora.',
  },
  { id: 'skills', label: 'Skills', blurb: 'Herramientas y nivel en cada una.' },
  {
    id: 'contacto',
    label: 'Contacto',
    blurb: 'GitHub, LinkedIn, correo y CV en PDF.',
  },
] as const;

export const FIRST_SECTION = 'inicio';
