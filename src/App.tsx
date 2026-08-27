import { useCallback, useMemo, useReducer, useRef } from 'react';
import { SECTIONS } from './data/sections';
import type { SectionDef, SectionId } from './data/types';

import { useGlobalMenuKeys } from './hooks/useGlobalMenuKeys';
import { useHashSection, readHash } from './hooks/useHashSection';
import { useMediaQuery } from './hooks/useMediaQuery';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';
import { useWipeTransition } from './hooks/useWipeTransition';

import { Announcer } from './components/Announcer';
import { Backdrop } from './components/Backdrop';
import { SectionMenu } from './components/SectionMenu';
import type { MenuHandle } from './components/SectionMenu';
import { WipeOverlay } from './components/WipeOverlay';

import { Inicio } from './components/sections/Inicio';
import { SobreMi } from './components/sections/SobreMi';
import { Proyectos } from './components/sections/Proyectos';
import { Skills } from './components/sections/Skills';
import { Contacto } from './components/sections/Contacto';

import { sfx } from './lib/sfx';

const FALLBACK: SectionDef = { id: 'inicio', label: 'Inicio' };
const sectionAt = (i: number): SectionDef => SECTIONS[i] ?? FALLBACK;
const indexOf = (id: SectionId): number => {
  const i = SECTIONS.findIndex((s) => s.id === id);
  return i === -1 ? 0 : i;
};

/* Dos indices, no uno. Esa separacion es lo que permite la activacion
   manual: las flechas mueven `focused`, y solo `activate` toca `active`
   (y por tanto solo Enter/click dispara el barrido). */
interface NavState {
  activeIndex: number;
  focusedIndex: number;
}

type NavAction =
  | { type: 'move'; delta: number }
  | { type: 'moveTo'; index: number }
  | { type: 'activate'; index: number };

function navReducer(state: NavState, action: NavAction): NavState {
  const n = SECTIONS.length;
  switch (action.type) {
    case 'move': {
      // Se envuelve por los extremos: en un menu de consola es lo esperado.
      const next = (state.focusedIndex + action.delta + n) % n;
      return { ...state, focusedIndex: next };
    }
    case 'moveTo':
      return { ...state, focusedIndex: Math.max(0, Math.min(n - 1, action.index)) };
    case 'activate':
      return { activeIndex: action.index, focusedIndex: action.index };
    default:
      return state;
  }
}

export default function App() {
  const initial = indexOf(readHash() ?? 'inicio');
  const [nav, dispatch] = useReducer(navReducer, {
    activeIndex: initial,
    focusedIndex: initial,
  });

  const menuRef = useRef<MenuHandle>(null);
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const panelsRef = useRef<Record<string, HTMLDivElement | null>>({});

  const reducedMotion = usePrefersReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [soundOn, toggleSound] = useReducer((on: boolean) => {
    sfx.setEnabled(!on);
    return !on;
  }, sfx.isEnabled());

  const activeSection = sectionAt(nav.activeIndex);

  /** Cambio de DOM propiamente dicho. Corre tapado por la barra del barrido. */
  const commit = useCallback((id: SectionId) => {
    const index = indexOf(id);
    dispatch({ type: 'activate', index });
    // El panel entrante empieza arriba. Se hace aqui, en el mismo bloque
    // sincrono que el cambio de seccion, mientras la pantalla esta cubierta.
    const panel = panelsRef.current[id];
    if (panel) panel.scrollTop = 0;
  }, []);

  const { barRef, phase, play } = useWipeTransition(commit, reducedMotion);

  const activate = useCallback(
    (index: number) => {
      const section = sectionAt(index);
      // Reactivar la seccion actual no dispara nada.
      if (section.id === activeSection.id && phase === 'idle') {
        dispatch({ type: 'moveTo', index });
        return;
      }
      sfx.confirm();
      void play(section.id);
    },
    [activeSection.id, phase, play],
  );

  /* Las flechas mueven el foco REAL al boton correspondiente. Por eso el
     handler global no necesita tocar Enter: un <button> nativo ya lo maneja. */
  const moveFocus = useCallback((delta: number) => {
    dispatch({ type: 'move', delta });
    sfx.move();
  }, []);

  const jumpTo = useCallback((index: number) => {
    dispatch({ type: 'moveTo', index });
    sfx.move();
  }, []);

  useGlobalMenuKeys(
    useMemo(
      () => ({
        onPrev: () => moveFocus(-1),
        onNext: () => moveFocus(1),
        onFirst: () => jumpTo(0),
        onLast: () => jumpTo(SECTIONS.length - 1),
      }),
      [moveFocus, jumpTo],
    ),
  );

  // Mover el foco del DOM tras cada cambio de `focusedIndex`.
  const focusedIndex = nav.focusedIndex;
  const lastFocused = useRef(focusedIndex);
  if (lastFocused.current !== focusedIndex) {
    lastFocused.current = focusedIndex;
    queueMicrotask(() => menuRef.current?.focusItem(focusedIndex));
  }

  useHashSection(activeSection.id, commit);

  const announcement = `Sección ${activeSection.label}. ${nav.activeIndex + 1} de ${SECTIONS.length}.`;

  return (
    <>
      <Backdrop />

      <div className="app">
        <a className="u-skip" href={`#panel-${activeSection.id}`}>
          Saltar al contenido
        </a>

        <header className="rail rail--top">
          <span className="rail__brand">
            CATOXP <em>//</em> BUGS
          </span>
          <span className="rail__meta u-label">CDMX · Ciencia de datos · Finanzas · IA</span>
          <button
            type="button"
            className="rail__sound u-label"
            aria-pressed={soundOn}
            onClick={toggleSound}
          >
            <span aria-hidden="true">{soundOn ? '♪' : '×'}</span>
            Sonido
          </button>
        </header>

        <div className="app__body">
          <SectionMenu
            activeIndex={nav.activeIndex}
            focusedIndex={nav.focusedIndex}
            vertical={isDesktop}
            onActivate={activate}
            handleRef={menuRef}
            itemsRef={itemsRef}
          />

          <main className="stage" aria-busy={phase !== 'idle'}>
            {SECTIONS.map((section) => {
              const isActive = section.id === activeSection.id;
              return (
                <div
                  key={section.id}
                  id={`panel-${section.id}`}
                  role="tabpanel"
                  aria-labelledby={`tab-${section.id}`}
                  tabIndex={0}
                  hidden={!isActive}
                  className="panel"
                  ref={(el) => {
                    panelsRef.current[section.id] = el;
                  }}
                >
                  {/* El contenido solo se monta cuando la seccion esta activa:
                      asi la entrada escalonada vuelve a correr en cada visita,
                      y el <div> del panel sigue existiendo para que el
                      aria-controls de su tab nunca apunte al vacio. */}
                  {isActive && <SectionBody id={section.id} />}
                </div>
              );
            })}
          </main>
        </div>

        <footer className="rail rail--bottom">
          <span className="rail__hints u-label">
            <span className="rail__hint">
              <b>↑↓</b>Seleccionar
            </span>
            <span className="rail__hint">
              <b>⏎</b>Confirmar
            </span>
            <span className="rail__hint">
              <b>Tab</b>Recorrer
            </span>
          </span>
          <span className="rail__meta u-label">Diseño original · Sin assets de terceros</span>
        </footer>
      </div>

      <WipeOverlay barRef={barRef} />
      <Announcer message={announcement} />
    </>
  );
}

function SectionBody({ id }: { id: SectionId }) {
  switch (id) {
    case 'inicio':
      return <Inicio />;
    case 'sobre-mi':
      return <SobreMi />;
    case 'proyectos':
      return <Proyectos />;
    case 'skills':
      return <Skills />;
    case 'contacto':
      return <Contacto />;
    default:
      return null;
  }
}
