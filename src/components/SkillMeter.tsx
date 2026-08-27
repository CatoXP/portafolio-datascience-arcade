import type { Skill } from '../data/types';

interface Props {
  skill: Skill;
  index: number;
}

export function SkillMeter({ skill, index }: Props) {
  return (
    <li className="skill">
      <span className="skill__head">
        <span className="skill__name">{skill.name}</span>
        {/* El nivel va SIEMPRE como texto. Si dependiera solo del largo de la
            barra, la informacion se perderia para quien no ve el color o la
            forma (WCAG 1.4.1). La barra en si es decorativa. */}
        <span className="skill__value">{skill.level}</span>
      </span>
      <span className="skill__track" aria-hidden="true">
        <span
          className="skill__fill"
          style={
            {
              '--level': skill.level / 100,
              '--i': index,
            } as React.CSSProperties
          }
        />
      </span>
    </li>
  );
}
