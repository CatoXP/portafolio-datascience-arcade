# portafolio-datascience-arcade

Portafolio personal de **Brandon Uriel García Sánchez** (CatoXP / BUGS), con una
dirección visual de menú de consola: rojo, negro y crema, paneles inclinados,
tipografía condensada enorme tipo recorte de revista y transiciones agresivas.

Es un proyecto "for fun", separado del portafolio profesional. El diseño es el
gancho, pero el contenido es real.

---

## Nota sobre originalidad

**Todo el diseño y todos los assets de este repositorio son originales.**

El estilo evoca la interfaz de los JRPG de menú agresivo, pero no se ha tomado
prestado ningún asset de nadie:

- No hay logos, personajes, sprites, capturas ni arte de ningún videojuego.
- No hay música ni efectos de sonido extraídos de ningún sitio. Los sonidos del
  menú se **sintetizan en el navegador** con la Web Audio API: no existe un solo
  archivo de audio en el repositorio.
- Las formas (estallido dentado, recortes de papel, halftone, rayas diagonales,
  el barrido de transición) son geometría escrita a mano en CSS y SVG.
- Las únicas dependencias visuales externas son dos tipografías libres, **Anton**
  e **Inter**, ambas bajo licencia SIL Open Font License 1.1, autoalojadas vía
  npm y acreditadas abajo.

Un estilo visual se puede evocar; los assets no se toman prestados.

---

## Stack

- Vite 6 + React 19 + TypeScript en modo estricto
- CSS escrito a mano, sin framework. Hace falta control fino de `clip-path`,
  `transform` y `@keyframes`.
- Sin librería de animación. Todo sale con keyframes CSS y la Web Animations API.
- Sin router, sin backend, sin base de datos.

Peso: ~68 kB de JS y ~5 kB de CSS, ambos comprimidos con gzip.

### Por qué no hay router

Son cinco secciones en una sola página. `react-router` pesaría casi la mitad de
lo que pesa React entero a cambio de nada: no hay rutas anidadas, ni parámetros,
ni loaders. Los enlaces compartibles y el botón Atrás se resuelven con
`src/hooks/useHashSection.ts`, unas veinte líneas y cero dependencias.

Consecuencia práctica: como la navegación es por hash, GitHub Pages nunca recibe
una petición a una ruta que no existe, así que **no hace falta un `404.html`**.

---

## Correr en local

```bash
npm install
npm run dev
```

El servidor de desarrollo abre en `http://localhost:5173/portafolio-datascience-arcade/`.
El subdirectorio está a propósito: es el mismo que en producción, así que
cualquier error de rutas se ve en local y no después de desplegar.

```bash
npm run build      # typecheck + build a dist/
npm run preview    # sirve dist/ en el puerto 4173
npm run typecheck  # solo tsc
```

Requiere Node 20 o superior.

---

## Desplegar en GitHub Pages

El workflow `.github/workflows/deploy.yml` construye y publica en cada push a
`main`.

**Hay un paso manual que solo se hace una vez**, y es la causa más común de que
falle el primer despliegue:

> En GitHub: **Settings → Pages → Build and deployment → Source: `GitHub Actions`**

Sin cambiar eso desde el valor por defecto ("Deploy from a branch"),
`actions/deploy-pages` falla con un error de permisos que parece un problema de
token pero no lo es.

Si el repositorio cambia de nombre, hay que actualizar `base` en
`vite.config.ts` para que coincida. Si no, los assets dan 404 en producción
aunque el build local funcione.

---

## Estructura

```
src/
├─ data/          Contenido tipado (perfil, proyectos, skills, contacto)
├─ hooks/         Navegación por teclado, sync con el hash, barrido, reduced-motion
├─ components/    Menú, secciones, overlay del barrido, fondo
├─ lib/           Sonido sintetizado, rutas de assets, utilidades
└─ styles/        Tokens, reset, geometría, movimiento, layout
```

El contenido vive en `src/data/*.ts`, separado de la presentación. Para añadir
un proyecto o cambiar un enlace no hace falta tocar ningún componente.

### Pendiente

Los cinco proyectos tienen `repo: null` en `src/data/projects.ts`. Mientras siga
así, la tarjeta se pinta sin enlace y con la etiqueta "repo pendiente" en vez de
fingir un link roto. Al rellenar la URL, la tarjeta pasa a ser un enlace sola.

---

## Dos reglas de la casa

Están escritas en los comentarios del CSS, pero conviene tenerlas a mano porque
se rompen solas:

1. **Nunca pongas un `skew` o `clip-path` estático en un elemento que también
   anima su `transform`.** La animación sobrescribe el transform completo y la
   pieza se endereza a mitad de vuelo. O se separan en dos elementos, o el
   keyframe repite el transform estático en cada paso.

2. **`clip-path` recorta el `outline`.** Nunca lo pongas en un elemento
   focusable o el anillo de foco desaparece. Va en un `::before` o en un `span`
   interior, y el elemento focusable se queda rectangular.

---

## Accesibilidad

No es un añadido: el estilo es agresivo, la accesibilidad no.

- El menú usa el patrón **tablist / tab / tabpanel** con activación manual y
  roving tabindex. Las flechas mueven el cursor, Enter confirma.
- El manejador global de teclado **nunca intercepta Enter**. Las flechas mueven
  el foco real del DOM al botón, y un `<button>` nativo ya dispara click con
  Enter y con Espacio. Así es imposible romper el Enter de un formulario.
- Anillo de foco doble (crema + rojo) para que se vea sobre negro, sobre rojo y
  sobre crema.
- Los cinco tokens de color pasan **WCAG AA para texto normal** en todas las
  combinaciones que se usan; la mayoría pasa AAA.
- Los medidores de skills muestran el número como texto: el nivel nunca depende
  solo del largo de la barra.
- `prefers-reduced-motion` se respeta colapsando los tokens de movimiento en un
  solo bloque. Se apagan el barrido, el escalonado y las animaciones de ambiente;
  se conservan el cambio de sección, el color y el foco.
- El sonido del menú viene encendido pero solo suena tras un gesto explícito, y
  hay un botón de silencio visible en el riel superior que recuerda la elección.

---

## Créditos tipográficos

- [Anton](https://fonts.google.com/specimen/Anton) — SIL Open Font License 1.1
- [Inter](https://fonts.google.com/specimen/Inter) — SIL Open Font License 1.1

Ambas se instalan vía [Fontsource](https://fontsource.org/) y se empaquetan en el
build, sin petición al CDN de Google en tiempo de ejecución.
