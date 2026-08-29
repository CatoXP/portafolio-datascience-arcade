import type { Project } from './types';

/* Los `repo` en null se pintan sin enlace y con la etiqueta "repo pendiente"
   en vez de fingir un link roto. Quedan tres por confirmar: dos no tienen
   repositorio publico todavia y el de credit scoring vive dentro de un
   portafolio que agrupa varios proyectos. */

export const PROJECTS: readonly Project[] = [
  {
    title: 'Credit scoring',
    desc: 'Modelo end-to-end de riesgo de incumplimiento sobre el dataset "Give Me Some Credit": limpieza, feature engineering y explicabilidad con SHAP para identificar los factores de riesgo dominantes.',
    metric: 'AUC-ROC 0.861',
    stack: ['Python', 'Pandas', 'scikit-learn', 'SHAP'],
    repo: null,
  },
  {
    title: 'Detección de lavado de dinero',
    desc: 'Monitoreo de transacciones sobre el dataset SAML-D. Detección de patrones anómalos y generación de alertas para revisión, con el desbalance de clases como problema central.',
    stack: ['Python', 'scikit-learn', 'Detección de anomalías'],
    repo: null,
  },
  {
    title: 'Retención de clientes en banca',
    desc: 'Proyecto de churn completo: desde los requerimientos de negocio hasta el despliegue y la validación del modelo en producción, pasando por la definición de la ventana de observación.',
    stack: ['Python', 'scikit-learn', 'Despliegue'],
    repo: null,
  },
  {
    title: 'Deserción escolar en la UNRC',
    desc: 'Investigación formal sobre los factores asociados al abandono escolar, con análisis exploratorio y un tablero en Power BI para que el área académica pueda explorar los cortes por su cuenta.',
    stack: ['Python', 'Power BI', 'Estadística'],
    repo: 'https://github.com/CatoXP/Deserci-n-Escolar-EDA-DB',
  },
  {
    title: 'Detección temprana de patologías bovinas',
    desc: 'Visión por computadora y sensores para detectar enfermedades en ganado. El dataset se construyó desde cero: recolección, limpieza y etiquetado manual de las imágenes.',
    metric: '391 imágenes etiquetadas',
    stack: ['Python', 'OpenCV', 'YOLOv8', 'Random Forest'],
    repo: 'https://github.com/CatoXP/Detecci-n-de-bovinos-con-redes-neuronales-convolucionales',
  },
];
