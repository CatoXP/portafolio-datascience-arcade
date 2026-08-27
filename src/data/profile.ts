export const PROFILE = {
  /** La palabra que recibe el tratamiento de letras recortadas. */
  heroName: 'URIEL',
  fullName: 'Brandon Uriel García Sánchez',
  aliases: ['CatoXP', 'BUGS'],
  roles: ['Ciencia de datos', 'Automatización', 'Python'],
  place: 'Ciudad de México',

  bio: [
    'Estudiante de la licenciatura en **Ciencias de Datos para Negocios** en la Universidad Nacional Rosario Castellanos (UNRC), en Ciudad de México, con finalización prevista para diciembre de 2028. Antes de eso hice la carrera técnica en Programación en el CETIS 3.',
    'Desde mayo de 2026 soy **becario de desarrollo y automatización** en HSBC Global Service Centre México, en el área de reportería regulatoria: construyo herramientas en Python para generar y consolidar reportes, y automatizo flujos de procesamiento y compresión de archivos que antes se hacían a mano.',
    'Antes fui **Database Manager** en MAXI durante dos años, optimizando consultas SQL y analizando datos de venta para decisiones de reabastecimiento.',
    'Formo parte del programa de formación y mentoría **Inroads**. Me mueve la analítica aplicada a negocio y el aprendizaje profundo, y me gusta que lo que construyo lo acabe usando alguien que no es técnico.',
  ],

  facts: [
    { key: 'Ubicación', val: 'Ciudad de México' },
    { key: 'Universidad', val: 'UNRC · 2024–2028' },
    { key: 'Actualmente', val: 'HSBC GSC México' },
    { key: 'Programa', val: 'Inroads' },
    { key: 'Idiomas', val: 'Español nativo · Inglés A2' },
  ],
} as const;
