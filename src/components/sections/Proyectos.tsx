import { PROJECTS } from '../../data/projects';
import { ProjectCard } from '../ProjectCard';

export function Proyectos() {
  return (
    <div className="section">
      <span className="section__kicker u-label" data-stagger style={{ ['--i' as string]: 0 }}>
        02 / Trabajo
      </span>
      <h2 className="section__title" data-stagger style={{ ['--i' as string]: 1 }}>
        Pro<em>yec</em>tos
      </h2>

      <ul className="projects">
        {PROJECTS.map((project, i) => (
          <ProjectCard key={project.title} project={project} index={i} />
        ))}
      </ul>
    </div>
  );
}
