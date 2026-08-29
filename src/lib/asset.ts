/** Resuelve rutas de public/ contra el base de Vite.

   En GitHub Pages el sitio vive en /portafolio-datascience-arcade/, asi que un href
   escrito a mano como "/cv.pdf" apuntaria a la raiz del dominio y daria 404.
   Todo lo que salga de public/ tiene que pasar por aqui. */
export function asset(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
}
