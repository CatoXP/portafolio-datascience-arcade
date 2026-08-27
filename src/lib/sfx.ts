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

/* Confirmacion: brillante y con cola, centrada en la region de 7 kHz, que es
   donde vive el caracter de este tipo de sonido de menu. Grave = golpe sordo;
   agudo = chasquido de cristal, que es el que encaja con la estetica. */
const CONFIRM_PARTIALS: readonly Partial[] = [
  { hz: 7180, gain: 0.15, decay: 0.29 },
  { hz: 4790, gain: 0.09, decay: 0.24 },
  { hz: 9930, gain: 0.06, decay: 0.16 },
  { hz: 3110, gain: 0.05, decay: 0.26 },
];

/* Movimiento de cursor: la misma familia timbrica pero mas corta y discreta,
   porque suena muchas veces seguidas. */
const MOVE_PARTIALS: readonly Partial[] = [
  { hz: 7210, gain: 0.085, decay: 0.075 },
  { hz: 4810, gain: 0.045, decay: 0.06 },
];

function playMove(): void {
  const c = ensureContext();
  if (!c || !master) return;
  metallicHit(c, master, MOVE_PARTIALS, 0.05, 5200);
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
