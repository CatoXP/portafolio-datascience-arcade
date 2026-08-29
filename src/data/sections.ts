import type { SectionDef } from './types';

/** Orden del menu. El indice que se pinta sale de la posicion en este array. */
export const SECTIONS: readonly SectionDef[] = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'sobre-mi', label: 'Sobre mí' },
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'skills', label: 'Skills' },
  { id: 'contacto', label: 'Contacto' },
] as const;

export const FIRST_SECTION = 'inicio';
