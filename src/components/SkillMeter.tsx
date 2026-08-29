import type { Skill } from '../data/types';

interface Props {
  skill: Skill;
  index: number;
}

/** Celdas discretas, no una barra continua.

    Una barra que barre de izquierda a derecha se lee como grafico de
    progreso: es el gesto por defecto y no dice nada. Celdas que se encienden
    una tras otra se leen como medidor de consola. Es el mismo dato con otra
    voz, y la voz es justo lo que se esta diseñando aqui.

    La cifra va SIEMPRE como texto. Si el nivel dependiera solo de cuantas
    celdas se ven encendidas, la informacion se perderia para quien no
    distingue el color (WCAG 1.4.1). Las celdas son decorativas. */
const CELLS = 14;

export function SkillMeter({ skill, index }: Props) {
  const lit = Math.round((skill.level / 100) * CELLS);

  return (
    <li className="skill">
      <span className="skill__rank" aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </span>

      <span className="skill__name">{skill.name}</span>

      <span className="skill__meter" aria-hidden="true">
        {Array.from({ length: CELLS }, (_, c) => (
          <span
            key={c}
            className="skill__cell"
            data-on={c < lit ? '' : undefined}
            style={{ ['--c' as string]: c, ['--row' as string]: index }}
          />
        ))}
      </span>

      <span className="skill__value">{skill.level}</span>
    </li>
  );
}
