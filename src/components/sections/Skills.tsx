import { SKILL_GROUPS } from '../../data/skills';
import { SkillMeter } from '../SkillMeter';

export function Skills() {
  return (
    <div className="section">
      <span className="section__kicker u-label" data-stagger style={{ ['--i' as string]: 0 }}>
        03 / Herramientas
      </span>
      <h2 className="section__title" data-stagger style={{ ['--i' as string]: 1 }}>
        Ski<em>lls</em>
      </h2>

      <div className="skills">
        {SKILL_GROUPS.map((group, gi) => (
          <section
            className="skillgroup"
            key={group.name}
            data-stagger
            style={{ ['--i' as string]: gi + 2 }}
          >
            <h3 className="skillgroup__name u-label">{group.name}</h3>
            <ul className="skillgroup__list">
              {group.skills.map((skill, si) => (
                <SkillMeter key={skill.name} skill={skill} index={si} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
