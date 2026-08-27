import { PROFILE } from '../../data/profile';
import { RansomName } from '../RansomName';

export function Inicio() {
  return (
    <div className="section hero">
      <span className="section__kicker u-label" data-stagger style={{ ['--i' as string]: 0 }}>
        Portafolio · {PROFILE.aliases.join(' / ')}
      </span>

      <RansomName name={PROFILE.heroName} />

      {/* El posicionamiento va inmediatamente debajo del nombre y en grande:
          es lo que decide como te leen antes de bajar a los proyectos. */}
      <p className="hero__headline" data-stagger style={{ ['--i' as string]: 6 }}>
        {PROFILE.headline}
      </p>

      <p className="hero__role u-label" data-stagger style={{ ['--i' as string]: 7 }}>
        {PROFILE.roles.map((role) => (
          <span key={role}>{role}</span>
        ))}
      </p>

      <p className="hero__place" data-stagger style={{ ['--i' as string]: 8 }}>
        {PROFILE.place}
      </p>

      <span className="hero__alias u-label" data-stagger style={{ ['--i' as string]: 9 }}>
        <span>{PROFILE.fullName}</span>
      </span>
    </div>
  );
}
