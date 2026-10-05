import type { Project } from './types';

/* AML y churn no tienen repositorio propio todavia: apuntan al portafolio
   general, que es donde vive el trabajo. Credit scoring y Home Credit viven en
   su propia carpeta dentro del portafolio. Cuando cada uno tenga su repo
   dedicado basta cambiar la URL aqui.

   Un `repo` en null se pinta sin enlace y con la etiqueta "repo pendiente",
   en vez de fingir un link roto. */
const PORTAFOLIO = 'https://github.com/CatoXP/portfolio-data-science';
const PROYECTO = (slug: string) => `${PORTAFOLIO}/tree/main/proyectos/${slug}`;

export const PROJECTS: readonly Project[] = [
  {
    title: 'Home Credit · GCI World 2026',
    desc: 'Competencia de machine learning de la Universidad de Tokio (Matsuo-Iwasawa Lab): predecir el impago de 61,500 clientes. Recuperé el plazo y la tasa de interés ocultos despejando la fórmula de anualidades, identifiqué solicitudes de la misma persona y armé un ensamble de cuatro modelos validado sin fuga de datos.',
    metric: 'Top 16 · AUC 0.774',
    stack: ['Python', 'LightGBM', 'XGBoost', 'CatBoost'],
    repo: PROYECTO('home-credit-default-risk-gci-utokyo'),
  },
  {
    title: 'Credit scoring',
    desc: 'Modelo end-to-end de riesgo de incumplimiento sobre el dataset "Give Me Some Credit": limpieza, feature engineering y explicabilidad con SHAP para identificar los factores de riesgo dominantes.',
    metric: 'AUC-ROC 0.861',
    stack: ['Python', 'Pandas', 'scikit-learn', 'SHAP'],
    repo: PROYECTO('credit-scoring-predicting'),
  },
  {
    title: 'Detección de lavado de dinero',
    desc: 'Monitoreo de transacciones sobre el dataset SAML-D. Detección de patrones anómalos y generación de alertas para revisión, con el desbalance de clases como problema central.',
    stack: ['Python', 'scikit-learn', 'Detección de anomalías'],
    repo: PORTAFOLIO,
  },
  {
    title: 'Retención de clientes en banca',
    desc: 'Proyecto de churn completo: desde los requerimientos de negocio hasta el despliegue y la validación del modelo en producción, pasando por la definición de la ventana de observación.',
    stack: ['Python', 'scikit-learn', 'Despliegue'],
    repo: PORTAFOLIO,
  },
  {
    title: 'Deserción escolar en la UNRC',
    desc: 'Investigación formal sobre los factores asociados al abandono escolar, con análisis exploratorio y un tablero en Power BI para que el área académica pueda explorar los cortes por su cuenta.',
    stack: ['Python', 'Power BI', 'Estadística'],
    repo: 'https://github.com/CatoXP/desercion-escolar-eda',
  },
  {
    title: 'Detección temprana de patologías bovinas',
    desc: 'Visión por computadora y sensores para detectar enfermedades en ganado. El dataset se construyó desde cero: recolección, limpieza y etiquetado manual de las imágenes.',
    metric: '391 imágenes etiquetadas',
    stack: ['Python', 'OpenCV', 'YOLOv8', 'Random Forest'],
    repo: 'https://github.com/CatoXP/deteccion-bovinos-cnn',
  },
  {
    title: 'Torre del Caribe',
    desc: 'Proyecto en equipo de la UNRC, como responsable técnico: una campaña de turismo hecha con datos para el sur de Quintana Roo. Radar de ocupación, pronóstico a 12 meses y optimización del presupuesto con 8.1 millones de registros de 15 fuentes oficiales.',
    metric: '8.1M registros',
    stack: ['Python', 'Spark', 'Pronóstico', 'Optimización'],
    repo: 'https://github.com/CatoXP/torre-del-caribe-unrc-2026',
  },
];
