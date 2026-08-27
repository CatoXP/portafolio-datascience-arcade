/** Une nombres de clase ignorando false, null y undefined. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
