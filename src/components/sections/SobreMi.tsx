import { PROFILE } from '../../data/profile';
import { emphasize } from '../../lib/emphasis';
import retrato from '../../assets/retrato.jpg';

export function SobreMi() {
  return (
    <div className="section">
      <span className="section__kicker u-label" data-stagger style={{ ['--i' as string]: 0 }}>
        01 / Quién soy
      </span>
      <h2 className="section__title" data-stagger style={{ ['--i' as string]: 1 }}>
        Sobre <em>mí</em>
      </h2>

      <div className="about">
        <div className="about__aside" data-stagger style={{ ['--i' as string]: 2 }}>
          <figure className="portrait">
            <img
              className="portrait__img"
              src={retrato}
              width={600}
              height={849}
              alt={`Retrato de ${PROFILE.fullName}`}
            />
            <span className="portrait__grain u-halftone" aria-hidden="true" />
          </figure>

          <dl className="facts">
            {PROFILE.facts.map((fact) => (
              <div className="facts__row" key={fact.key}>
                <dt className="facts__key u-label">{fact.key}</dt>
                <dd className="facts__val">{fact.val}</dd>
              </div>
            ))}
          </dl>

          <section className="certs">
            <h3 className="skillgroup__name u-label">Certificaciones</h3>
            <ul className="certs__list">
              {PROFILE.certs.map((cert) => (
                <li className="certs__item" key={cert}>
                  {cert}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="prose" data-stagger style={{ ['--i' as string]: 3 }}>
          {PROFILE.bio.map((paragraph, i) => (
            <p key={i}>{emphasize(paragraph)}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
