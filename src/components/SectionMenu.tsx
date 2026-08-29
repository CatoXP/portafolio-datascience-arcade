import { useImperativeHandle } from 'react';
import type { Ref } from 'react';
import { SECTIONS } from '../data/sections';

export interface MenuHandle {
  focusItem: (index: number) => void;
}

interface Props {
  activeIndex: number;
  focusedIndex: number;
  vertical: boolean;
  onActivate: (index: number) => void;
  handleRef: Ref<MenuHandle>;
  itemsRef: React.RefObject<Array<HTMLButtonElement | null>>;
}

const FALLBACK_BLURB = '';

/** Menu de consola con semantica de tabs.

    Patron tablist/tab/tabpanel con activacion MANUAL: las flechas mueven el
    cursor y Enter confirma. Es exactamente "un panel visible de N, las
    flechas mueven entre encabezados", que es lo que un lector de pantalla ya
    espera aqui.

    Roving tabindex en vez de aria-activedescendant: el foco se mueve de
    verdad, asi :focus-visible funciona solo, el navegador desplaza la tira
    horizontal por su cuenta y Enter es comportamiento nativo de <button>.

    El <button> NO lleva clip-path (recortaria el anillo de foco) ni
    transform animado. La geometria vive en .menu__shape.

    Cada item recibe su distancia AL CURSOR (no al activo) en --d con signo y
    --ad en valor absoluto. El CSS los usa para abrir la lista en abanico: los
    de arriba se inclinan hacia un lado, los de abajo hacia el otro, y todos
    se apagan segun se alejan. Asi la lista comunica posicion, no solo cual
    esta elegido. */
export function SectionMenu({
  activeIndex,
  focusedIndex,
  vertical,
  onActivate,
  handleRef,
  itemsRef,
}: Props) {
  useImperativeHandle(
    handleRef,
    () => ({
      focusItem(index: number) {
        itemsRef.current[index]?.focus();
      },
    }),
    [itemsRef],
  );

  const blurb = SECTIONS[focusedIndex]?.blurb ?? FALLBACK_BLURB;

  return (
    <div className="rail-nav">
      <div
        className="menu"
        role="tablist"
        aria-label="Secciones del portafolio"
        aria-orientation={vertical ? 'vertical' : 'horizontal'}
      >
        {SECTIONS.map((section, i) => {
          const d = i - focusedIndex;
          return (
            <button
              key={section.id}
              id={`tab-${section.id}`}
              type="button"
              role="tab"
              className="menu__item"
              aria-selected={i === activeIndex}
              aria-controls={`panel-${section.id}`}
              tabIndex={i === focusedIndex ? 0 : -1}
              ref={(el) => {
                itemsRef.current[i] = el;
              }}
              onClick={() => onActivate(i)}
              style={
                {
                  '--d': d,
                  '--ad': Math.abs(d),
                } as React.CSSProperties
              }
            >
              <span className="menu__shape" aria-hidden="true" />
              <span className="menu__body">
                <span className="menu__index" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="menu__label">{section.label}</span>
                <span className="menu__cursor" aria-hidden="true">
                  &#9654;
                </span>
              </span>
              {/* La descripcion tambien va aqui, oculta: quien navega con
                  lector de pantalla la oye al enfocar la pestaña, sin
                  depender del panel visual de abajo. */}
              <span className="u-visually-hidden">. {section.blurb}</span>
            </button>
          );
        })}
      </div>

      {/* Panel de descripcion del item bajo el cursor. Decorativo para
          tecnologia asistiva: el texto ya viaja dentro de cada tab. */}
      <p className="menu__blurb" aria-hidden="true">
        <span className="menu__blurbBar" />
        <span key={focusedIndex} className="menu__blurbText">
          {blurb}
        </span>
      </p>
    </div>
  );
}
