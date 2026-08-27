interface Props {
  message: string;
}

/** Region viva para lectores de pantalla.

    Hace falta porque una seccion puede activarse con el foco fuera del menu
    (click de raton, o las flechas globales), y en ese caso nada se anuncia
    por si solo. El mensaje incluye "N de M" para que dos activaciones
    seguidas de la misma seccion no se queden mudas por texto identico. */
export function Announcer({ message }: Props) {
  return (
    <div role="status" aria-live="polite" aria-atomic="true" className="u-visually-hidden">
      {message}
    </div>
  );
}
