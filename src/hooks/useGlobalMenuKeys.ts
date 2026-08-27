import { useEffect, useRef } from 'react';

interface Handlers {
  onPrev: () => void;
  onNext: () => void;
  onFirst: () => void;
  onLast: () => void;
}

const EDITABLE = 'input, textarea, select, [contenteditable]';

/* Widgets que legitimamente se quedan con las flechas. Si algun dia se
   agrega uno, basta con marcarlo con data-arrow-nav="off". */
const ARROW_OWNERS = [
  '[data-arrow-nav="off"]',
  '[role="listbox"]',
  '[role="combobox"]',
  '[role="menu"]',
  '[role="slider"]',
  '[role="spinbutton"]',
  'video',
  'audio',
].join(', ');

function shouldIgnore(e: KeyboardEvent): boolean {
  // Alguien mas ya reclamo esta tecla.
  if (e.defaultPrevented) return true;
  // Alt+Flecha es el historial del navegador; Ctrl/Meta son atajos del sistema.
  if (e.altKey || e.ctrlKey || e.metaKey) return true;
  // Con un IME abierto, las flechas eligen candidato.
  if (e.isComposing) return true;

  const target = e.target;
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  if (target.closest(EDITABLE)) return true;
  if (target.closest(ARROW_OWNERS)) return true;

  return false;
}

/** Un unico listener de teclado en window para el cursor del menu.

   Deliberadamente NO intercepta Enter. Las flechas mueven el foco real del
   DOM al <button role="tab"> correspondiente, y un boton nativo ya dispara
   click con Enter y con Espacio. Asi "flechas + Enter" sale gratis y es
   imposible romper el Enter de un formulario o de un enlace.

   Tab y Shift+Tab tampoco se tocan: siguen siendo la navegacion normal. */
export function useGlobalMenuKeys(handlers: Handlers): void {
  // El listener se registra una sola vez, pero siempre llama a los closures
  // actuales. Sin esto habria que quitar y poner el listener en cada render.
  const latest = useRef(handlers);
  useEffect(() => {
    latest.current = handlers;
  });

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (shouldIgnore(e)) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'ArrowLeft':
          e.preventDefault();
          latest.current.onPrev();
          break;
        case 'ArrowDown':
        case 'ArrowRight':
          e.preventDefault();
          latest.current.onNext();
          break;
        case 'Home':
          e.preventDefault();
          latest.current.onFirst();
          break;
        case 'End':
          e.preventDefault();
          latest.current.onLast();
          break;
        default:
          return;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // Deps vacias: correcto solo gracias al latest ref de arriba.
  }, []);
}
