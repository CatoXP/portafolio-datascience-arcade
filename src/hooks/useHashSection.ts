import { useEffect } from 'react';
import { SECTIONS } from '../data/sections';
import type { SectionId } from '../data/types';

function isSectionId(value: string): value is SectionId {
  return SECTIONS.some((s) => s.id === value);
}

/** Lee '#/proyectos' -> 'proyectos'.

   El prefijo '/' es deliberado: sin el, el navegador trata el hash como un
   fragmento y salta al elemento con ese id, peleandose con el scroll de los
   paneles. Con '/' nunca coincide con un id real. */
export function readHash(): SectionId | null {
  if (typeof window === 'undefined') return null;
  const raw = window.location.hash.replace(/^#\/?/, '');
  return isSectionId(raw) ? raw : null;
}

/** Sincroniza la seccion activa con la URL en ambos sentidos, sin router.
    Da enlaces compartibles y boton Atras funcional por ~20 lineas. */
export function useHashSection(
  active: SectionId,
  onExternalChange: (id: SectionId) => void,
): void {
  useEffect(() => {
    const next = `#/${active}`;
    if (window.location.hash !== next) {
      // replaceState y no pushState: cambiar de seccion rapido no debe
      // llenar el historial de entradas.
      window.history.replaceState(null, '', next);
    }
  }, [active]);

  useEffect(() => {
    const onHashChange = () => {
      const id = readHash();
      if (id && id !== active) onExternalChange(id);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [active, onExternalChange]);
}
