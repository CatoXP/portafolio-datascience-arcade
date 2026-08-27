import { useImperativeHandle } from 'react';
import type { Ref } from 'react';
import { SECTIONS } from '../data/sections';
import { cx } from '../lib/cx';

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

/** Menu de consola con semantica de tabs.

    Patron tablist/tab/tabpanel con activacion MANUAL: las flechas mueven el
    cursor y Enter confirma. Es exactamente "un panel visible de N, las
    flechas mueven entre encabezados", que es lo que un lector de pantalla ya
    espera aqui.

    Roving tabindex en vez de aria-activedescendant: el foco se mueve de
    verdad, asi :focus-visible funciona solo, el navegador desplaza la tira
    horizontal por su cuenta y Enter es comportamiento nativo de <button>.

    El <button> NO lleva clip-path (recortaria el anillo de foco) ni
    transform animado. La geometria vive en .menu__shape. */
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

  return (
    <div
      className="menu"
      role="tablist"
      aria-label="Secciones del portafolio"
      aria-orientation={vertical ? 'vertical' : 'horizontal'}
    >
      {SECTIONS.map((section, i) => (
        <button
          key={section.id}
          id={`tab-${section.id}`}
          type="button"
          role="tab"
          className={cx('menu__item')}
          aria-selected={i === activeIndex}
          aria-controls={`panel-${section.id}`}
          tabIndex={i === focusedIndex ? 0 : -1}
          ref={(el) => {
            itemsRef.current[i] = el;
          }}
          onClick={() => onActivate(i)}
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
        </button>
      ))}
    </div>
  );
}
