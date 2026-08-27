import type { Project } from '../data/types';

interface Props {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: Props) {
  const body = (
    <>
      <span className="card__index u-label">
        {String(index + 1).padStart(2, '0')} / Proyecto
      </span>
      <h3 className="card__title">{project.title}</h3>
      {project.metric && <span className="card__metric u-label">{project.metric}</span>}
      <p className="card__desc">{project.desc}</p>
      <span className="card__stack">
        {project.stack.map((tech) => (
          <span className="card__tag" key={tech}>
            {tech}
          </span>
        ))}
      </span>
      <span className="card__cta u-label">
        {project.repo ? 'Ver repositorio ↗' : 'Repo pendiente'}
      </span>
    </>
  );

  return (
    <li className="card" data-stagger style={{ ['--i' as string]: index }}>
      {project.repo ? (
        <a
          className="card__link"
          href={project.repo}
          target="_blank"
          rel="noreferrer"
          aria-label={`${project.title} — abrir repositorio en una pestaña nueva`}
        >
          {body}
        </a>
      ) : (
        // Sin repo todavia: se pinta igual pero sin enlace, en vez de dejar
        // un href roto o un ancla que no lleva a ningun sitio.
        <div className="card__link">{body}</div>
      )}
    </li>
  );
}
