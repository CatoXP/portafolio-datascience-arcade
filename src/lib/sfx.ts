/* Efectos de menu sintetizados con la Web Audio API.

   No hay ningun archivo de audio en el proyecto: cada sonido se genera con
   osciladores y ruido en el momento de reproducirlo. Cero bytes de descarga,
   cero dependencias y nada tomado de ningun sitio.

   El AudioContext se crea de forma perezosa en la primera reproduccion, que
   siempre ocurre dentro de un gesto del usuario (click o tecla). Asi no se
   pelea con la politica de autoplay de los navegadores ni se abre un contexto
   de audio para quien nunca interactua. */

const STORAGE_KEY = 'pff:sound';

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let enabled = readPreference();

function readPreference(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    // Por defecto encendido: los sonidos solo suenan tras un gesto explicito
    // y hay un boton de silencio visible en el riel superior.
    return window.localStorage.getItem(STORAGE_KEY) !== 'off';
  } catch {
    return true;
  }
}

function ensureContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as {
      webkitAudioContext?: typeof AudioContext;
    }).webkitAudioContext;
    if (!Ctor) return null;

    ctx = new Ctor();
    master = ctx.createGain();
    // Bajo a proposito: las parciales agudas cansan mucho antes que las graves.
    master.gain.value = 0.38;
    master.connect(ctx.destination);
  }

  // Safari e iOS suspenden el contexto hasta que hay interaccion.
  if (ctx.state === 'suspended') void ctx.resume();

  return ctx;
}

function noiseBuffer(c: AudioContext, seconds: number): AudioBuffer {
  const length = Math.max(1, Math.floor(c.sampleRate * seconds));
  const buffer = c.createBuffer(1, length, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

interface Partial {
  hz: number;
  gain: number;
  decay: number;
}

/** Golpe metalico: parciales INARMONICAS con decaimientos distintos.

   Un solo oscilador suena a pitido de sintetizador. Lo que da el caracter de
   metal o cristal es que las frecuencias no sean multiplos enteras entre si y
   que las agudas se apaguen antes que las graves, igual que en una campana. */
function metallicHit(
  c: AudioContext,
  bus: GainNode,
  partials: readonly Partial[],
  noiseLevel: number,
  noiseHz: number,
): void {
  const t = c.currentTime;

  // Transitorio de ataque: el "chk" que hace que suene golpeado y no soplado.
  if (noiseLevel > 0) {
    const noise = c.createBufferSource();
    noise.buffer = noiseBuffer(c, 0.03);

    const band = c.createBiquadFilter();
    band.type = 'bandpass';
    band.frequency.value = noiseHz;
    band.Q.value = 0.8;

    const ng = c.createGain();
    ng.gain.setValueAtTime(noiseLevel, t);
    ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);

    noise.connect(band).connect(ng).connect(bus);
    noise.onended = () => ng.disconnect();
    noise.start(t);
    noise.stop(t + 0.04);
  }

  for (const p of partials) {
    const osc = c.createOscillator();
    const g = c.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(p.hz, t);
    // Caida de tono minima durante el decaimiento: sin esto suena demasiado
    // limpio y sintetico.
    osc.frequency.exponentialRampToValueAtTime(p.hz * 0.985, t + p.decay);

    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(p.gain, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + p.decay);

    osc.connect(g).connect(bus);
    osc.onended = () => g.disconnect();
    osc.start(t);
    osc.stop(t + p.decay + 0.02);
  }
}

/* Confirmacion.

   Las ganancias reproducen la DISTRIBUCION DE ENERGIA POR BANDAS de un
   chasquido de menu de referencia, no solo sus picos. La diferencia importa:
   buscando picos estrechos solo aparecen los agudos, porque la energia grave
   es de banda ancha y no hace pico. Sintetizar solo los picos daba un sonido
   correcto de tono pero sin cuerpo, y un agudo sin cuerpo se percibe todavia
   mas agudo y mas seco de lo que es.

   Reparto objetivo: ~75% en 5.5-8 kHz, ~9% en 8-12 kHz, ~8% en 3.5-5.5 kHz
   y el ~8% restante repartido por debajo de 3.5 kHz. Amplitud proporcional a
   la raiz de la fraccion de energia.

   Las razones entre parciales no son enteras: eso es lo que se percibe como
   metal golpeado y no como una nota. Las agudas se apagan antes que las
   graves, como en cualquier cuerpo resonante real. */
const K = 0.13;

const CONFIRM_PARTIALS: readonly Partial[] = [
  // Nucleo: donde vive tres cuartas partes de la energia.
  { hz: 6562, gain: 1.0 * K, decay: 0.36 },
  { hz: 7205, gain: 0.5 * K, decay: 0.34 },
  // Brillo.
  { hz: 11190, gain: 0.3 * K, decay: 0.3 },
  { hz: 10700, gain: 0.18 * K, decay: 0.28 },
  { hz: 11580, gain: 0.14 * K, decay: 0.28 },
  { hz: 4116, gain: 0.38 * K, decay: 0.38 },
  // Cuerpo: poca energia, pero es lo que evita que suene a pitido pelado.
  { hz: 2790, gain: 0.22 * K, decay: 0.4 },
  { hz: 1662, gain: 0.21 * K, decay: 0.42 },
  { hz: 905, gain: 0.14 * K, decay: 0.44 },
  { hz: 118, gain: 0.11 * K, decay: 0.4 },
];

/* Movimiento de cursor: mismo timbre, recortado. Suena muchas veces seguidas,
   asi que va mas corto y mas bajo para no cansar. */
const MOVE_PARTIALS: readonly Partial[] = [
  { hz: 6562, gain: 0.55 * K, decay: 0.11 },
  { hz: 7205, gain: 0.27 * K, decay: 0.1 },
  { hz: 11190, gain: 0.16 * K, decay: 0.09 },
  { hz: 4116, gain: 0.2 * K, decay: 0.12 },
  { hz: 1662, gain: 0.11 * K, decay: 0.13 },
];

function playMove(): void {
  const c = ensureContext();
  if (!c || !master) return;
  metallicHit(c, master, MOVE_PARTIALS, 0.045, 6500);
}

function playConfirm(): void {
  const c = ensureContext();
  if (!c || !master) return;
  metallicHit(c, master, CONFIRM_PARTIALS, 0.13, 6400);
}

export const sfx = {
  move(): void {
    if (enabled) playMove();
  },
  confirm(): void {
    if (enabled) playConfirm();
  },
  isEnabled(): boolean {
    return enabled;
  },
  setEnabled(next: boolean): void {
    enabled = next;
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? 'on' : 'off');
    } catch {
      /* modo privado o almacenamiento bloqueado: la preferencia dura la sesion */
    }
    // Un toque audible al reactivar, para confirmar que quedo encendido.
    if (next) playMove();
  },
};
