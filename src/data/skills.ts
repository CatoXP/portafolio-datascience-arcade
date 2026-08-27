import type { SkillGroup } from './types';

/* El orden importa: es el que define como te leen. Primero modelado, luego
   datos, y la automatizacion al final como herramienta de entrega y no como
   titular. */
export const SKILL_GROUPS: readonly SkillGroup[] = [
  {
    name: 'Ciencia de datos y machine learning',
    skills: [
      { name: 'Python', level: 90 },
      { name: 'scikit-learn', level: 82 },
      { name: 'Machine learning', level: 80 },
      { name: 'SHAP / explicabilidad', level: 72 },
      { name: 'TensorFlow / Keras', level: 70 },
      { name: 'Azure Machine Learning', level: 55 },
    ],
  },
  {
    name: 'Datos, SQL y preparación',
    skills: [
      { name: 'Pandas / NumPy', level: 88 },
      { name: 'Limpieza de datos', level: 88 },
      { name: 'SQL', level: 80 },
      { name: 'Procesos ETL', level: 75 },
      { name: 'MongoDB (NoSQL)', level: 60 },
    ],
  },
  {
    name: 'Visualización y entrega',
    skills: [
      { name: 'Excel avanzado', level: 85 },
      { name: 'Automatización con Python', level: 85 },
      { name: 'Power BI', level: 78 },
      { name: 'Git / GitHub', level: 78 },
      { name: 'Tableau', level: 65 },
    ],
  },
];
