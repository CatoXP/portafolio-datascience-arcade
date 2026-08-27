import { PROFILE } from '../../data/profile';
import { RansomName } from '../RansomName';

export function Inicio() {
  return (
    <div className="section hero">
      <span className="section__kicker u-label" data-stagger style={{ ['--i' as string]: 0 }}>
        Portafolio · {PROFILE.aliases.join(' / ')}
      </span>

      <RansomName name={PROFILE.heroName} />

      <p className="hero__role u-label" data-stagger style={{ ['--i' as string]: 6 }}>
        {PROFILE.roles.map((role) => (
          <span key={role}>{role}</span>
        ))}
      </p>

      <p className="hero__place" data-stagger style={{ ['--i' as string]: 7 }}>
        {PROFILE.place}
      </p>

      <span className="hero__alias u-label" data-stagger style={{ ['--i' as string]: 8 }}>
        <span>{PROFILE.fullName}</span>
      </span>
    </div>
  );
}
