export type SectionId = 'inicio' | 'sobre-mi' | 'proyectos' | 'skills' | 'contacto';

export interface SectionDef {
  id: SectionId;
  label: string;
  /** Descripcion corta que aparece bajo el menu al mover el cursor. */
  blurb: string;
}

export interface Project {
  title: string;
  desc: string;
  /** Cifra dura del proyecto, si la hay. Se pinta como etiqueta roja. */
  metric?: string;
  stack: string[];
  /** null = todavia sin repo publico. La tarjeta se pinta sin enlace. */
  repo: string | null;
}

export interface Skill {
  name: string;
  /** 0-100. Se muestra siempre como texto, nunca solo como largo de barra. */
  level: number;
}

export interface SkillGroup {
  name: string;
  skills: Skill[];
}

export interface ContactLink {
  label: string;
  value: string;
  href: string;
}
