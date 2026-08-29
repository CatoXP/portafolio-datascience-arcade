import { useImperativeHandle, useLayoutEffect, useState } from 'react';
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
    cursor y Enter confirma.

    Roving tabindex en vez de aria-activedescendant: el foco se mueve de
    verdad, asi :focus-visible funciona solo y Enter es comportamiento nativo
    de <button>.

    El <button> NO lleva clip-path (recortaria el anillo de foco) ni transform
    animado. La geometria vive en .menu__shape.

    Cada item recibe su distancia AL CURSOR en --d con signo y --ad absoluta,
    y el CSS las usa para abrir la lista en abanico. */
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

  /* El bloque rojo es UN solo elemento que se desplaza, no un fondo por item.
     Asi se desliza de una seccion a otra en vez de aparecer de golpe en el
     destino, que es lo que hace que el menu se sienta fisico.

     Hay que medirlo en JS porque su alto depende del item, y el item depende
     de la tipografia: Anton cambia los altos al terminar de cargar, de ahi el
     remedido en document.fonts.ready. */
  const [slab, setSlab] = useState({ y: 0, h: 0, ready: false });

  useLayoutEffect(() => {
    const measure = () => {
      const node = itemsRef.current[activeIndex];
      if (!node) return;
      setSlab({ y: node.offsetTop, h: node.offsetHeight, ready: true });
    };

    measure();
    void document.fonts?.ready.then(measure);

    const node = itemsRef.current[activeIndex];
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    if (ro && node) {
      ro.observe(node);
      if (node.parentElement) ro.observe(node.parentElement);
    }
    window.addEventListener('resize', measure);

    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [activeIndex, itemsRef]);

  const blurb = SECTIONS[focusedIndex]?.blurb ?? FALLBACK_BLURB;

  return (
    <div className="rail-nav">
      <div
        className="menu"
        role="tablist"
        aria-label="Secciones del portafolio"
        aria-orientation={vertical ? 'vertical' : 'horizontal'}
      >
        {slab.ready ? (
          <span
            className="menu__slab"
            aria-hidden="true"
            style={
              {
                '--slab-y': `${slab.y}px`,
                '--slab-h': `${slab.h}px`,
              } as React.CSSProperties
            }
          >
            {/* El desplazamiento vive en el padre y el sesgo mas el tic en
                reposo en el hijo: si compartieran transform, uno pisaria al
                otro. */}
            <span className="menu__slabInner" />
          </span>
        ) : null}

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
              <span className="u-visually-hidden">. {section.blurb}</span>
            </button>
          );
        })}
      </div>

      <p className="menu__blurb" aria-hidden="true">
        <span className="menu__blurbBar" />
        <span key={focusedIndex} className="menu__blurbText">
          {blurb}
        </span>
      </p>
    </div>
  );
}
