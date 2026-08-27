import { CONTACT_LINKS, CV_FILE } from '../../data/contact';
import { asset } from '../../lib/asset';

export function Contacto() {
  return (
    <div className="section">
      <span className="section__kicker u-label" data-stagger style={{ ['--i' as string]: 0 }}>
        04 / Hablemos
      </span>
      <h2 className="section__title" data-stagger style={{ ['--i' as string]: 1 }}>
        Con<em>tac</em>to
      </h2>

      <div className="contact">
        <p className="prose" data-stagger style={{ ['--i' as string]: 2 }}>
          Estoy abierto a prácticas, proyectos de ciencia de datos y colaboraciones.
          El camino más rápido es el correo.
        </p>

        <div className="contact__links" data-stagger style={{ ['--i' as string]: 3 }}>
          {CONTACT_LINKS.map((link) => (
            <a
              className="contact__link"
              key={link.label}
              href={link.href}
              {...(link.href.startsWith('http')
                ? { target: '_blank', rel: 'noreferrer' }
                : {})}
            >
              <span>
                <span className="u-label">{link.label}</span>
                <br />
                {link.value}
              </span>
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>

        {/* asset() resuelve contra el base de Vite: un "/cv.pdf" a pelo daria
            404 en GitHub Pages, que sirve el sitio desde un subdirectorio. */}
        <a
          className="contact__cv u-label"
          href={asset(CV_FILE)}
          download="CV-Brandon-Uriel-Garcia-Sanchez.pdf"
          data-stagger
          style={{ ['--i' as string]: 4 }}
        >
          Descargar CV (PDF) ↓
        </a>

        <p className="contact__note" data-stagger style={{ ['--i' as string]: 5 }}>
          Ciudad de México · Disponible para trabajo remoto e híbrido.
        </p>
      </div>
    </div>
  );
}
