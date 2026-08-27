import type { ContactLink } from './types';

export const CONTACT_LINKS: readonly ContactLink[] = [
  {
    label: 'GitHub',
    value: '@CatoXP',
    href: 'https://github.com/CatoXP',
  },
  {
    label: 'LinkedIn',
    value: 'brandon-uriel-garcia-sanchez',
    href: 'https://www.linkedin.com/in/brandon-uriel-garcia-sanchez',
  },
  {
    label: 'Correo',
    value: 'garciasanchezbrandonu@gmail.com',
    href: 'mailto:garciasanchezbrandonu@gmail.com',
  },
];

/** Vive en public/. Se resuelve con asset() para respetar el base de Pages. */
export const CV_FILE = 'cv.pdf';
