import type { SkillGroup } from './types';

export const SKILL_GROUPS: readonly SkillGroup[] = [
  {
    name: 'Lenguajes y librerías',
    skills: [
      { name: 'Python', level: 90 },
      { name: 'Pandas / NumPy', level: 88 },
      { name: 'scikit-learn', level: 82 },
      { name: 'TensorFlow / Keras', level: 70 },
      { name: 'SQL', level: 80 },
    ],
  },
  {
    name: 'Datos y visualización',
    skills: [
      { name: 'Power BI', level: 78 },
      { name: 'Tableau', level: 65 },
      { name: 'Procesos ETL', level: 75 },
      { name: 'MongoDB (NoSQL)', level: 60 },
      { name: 'Excel avanzado', level: 85 },
    ],
  },
  {
    name: 'Práctica y herramientas',
    skills: [
      { name: 'Machine learning', level: 80 },
      { name: 'Automatización de procesos', level: 85 },
      { name: 'Git / GitHub', level: 78 },
      { name: 'SHAP / explicabilidad', level: 72 },
      { name: 'Azure Machine Learning', level: 55 },
    ],
  },
];
