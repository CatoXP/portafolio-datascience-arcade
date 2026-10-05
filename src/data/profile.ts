export const PROFILE = {
  /** La palabra que recibe el tratamiento de letras recortadas. */
  heroName: 'URIEL',
  fullName: 'Brandon Uriel García Sánchez',
  aliases: ['CatoXP', 'BUGS'],

  /** Posicionamiento principal. Es lo primero que se lee bajo el nombre. */
  headline: 'Científico de datos para negocios',
  /** Los tres ejes en los que quiero que me lean. */
  roles: ['Finanzas', 'Inteligencia artificial', 'Big data'],
  place: 'Ciudad de México',

  bio: [
    'Soy **científico de datos para negocios**, con foco en finanzas e inteligencia artificial. Estudio la licenciatura en Ciencias de Datos para Negocios en la Universidad Nacional Rosario Castellanos (UNRC), en Ciudad de México, con finalización prevista para diciembre de 2028. Antes hice la carrera técnica en Programación en el CETIS 3.',
    'Lo que me mueve es la **analítica aplicada a decisiones de negocio**: modelos de riesgo crediticio, detección de lavado de dinero y retención de clientes. Me interesa tanto que el modelo prediga bien como que se pueda explicar por qué predice lo que predice, que en banca es lo que decide si algo llega a producción o se queda en el notebook.',
    'Desde mayo de 2026 soy **becario de desarrollo y automatización en HSBC Global Service Centre México**, en el área de reportería regulatoria. Ahí llevo proyectos de punta a punta y el trabajo se parece bastante al de ingeniería de software: construyo herramientas en Python para generar y consolidar reportes, desarrollo **aplicaciones con interfaz gráfica** que usa a diario personal no técnico, y automatizo flujos de procesamiento y compresión de archivos que antes se hacían a mano. También lidero una iniciativa para impulsar la adopción de IA dentro del área.',
    'Antes fui **administrador de base de datos y BI** en Maxi durante poco más de dos años: optimicé la estructura y las consultas SQL reduciendo un 30% los tiempos de procesamiento, gestioné un ERP a medida para control de inventario y analicé datos históricos de venta para decisiones de reabastecimiento y rotación de producto.',
    'Formo parte del programa de formación y mentoría **Inroads México**.',
    'Estoy cursando **GCI World 2026**, el programa de ciencia de datos e IA del Matsuo-Iwasawa Lab de la Universidad de Tokio. En su competencia de machine learning (riesgo de impago, Home Credit) participé con un modelo que obtuvo un **AUC de 0.774** en el leaderboard público.',
  ],

  facts: [
    { key: 'Enfoque', val: 'Ciencia de datos · Finanzas · IA' },
    { key: 'Ubicación', val: 'Ciudad de México' },
    { key: 'Universidad', val: 'UNRC · 2024–2028' },
    { key: 'Actualmente', val: 'HSBC GSC México' },
    { key: 'Programa', val: 'Inroads México' },
    { key: 'Competencia', val: 'GCI World 2026 · UTokyo' },
    { key: 'Idiomas', val: 'Español nativo · Inglés A2' },
  ],

  /** Certificaciones. Refuerzan el perfil de datos, no el de automatizacion. */
  certs: [
    'Google Data Analytics (en curso)',
    'Microsoft Azure AI Essentials',
    'IBM SkillsBuild · AI Fundamentals',
    'IBM · Big Data / Hadoop Foundations',
    'Cisco · Data Analytics Essentials',
    'Cisco / Python Institute · Python Essentials I & II',
    'Accenture · SQL Intermedio',
  ],
} as const;
