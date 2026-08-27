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
    master.gain.value = 0.5;
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

/** Blip corto y brillante: el cursor moviendose por la lista. */
function playMove(): void {
  const c = ensureContext();
  if (!c || !master) return;

  const t = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();

  osc.type = 'square';
  osc.frequency.setValueAtTime(1180, t);
  osc.frequency.exponentialRampToValueAtTime(720, t + 0.05);

  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.13, t + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);

  osc.connect(gain).connect(master);
  osc.onended = () => gain.disconnect();
  osc.start(t);
  osc.stop(t + 0.08);
}

/** Golpe de confirmacion: ruido filtrado sobre un barrido grave. */
function playConfirm(): void {
  const c = ensureContext();
  if (!c || !master) return;

  const t = c.currentTime;

  // Capa 1: chasquido de ruido pasado por un pasabanda.
  const noise = c.createBufferSource();
  noise.buffer = noiseBuffer(c, 0.09);

  const band = c.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.setValueAtTime(2600, t);
  band.frequency.exponentialRampToValueAtTime(900, t + 0.09);
  band.Q.value = 1.4;

  const noiseGain = c.createGain();
  noiseGain.gain.setValueAtTime(0.22, t);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);

  noise.connect(band).connect(noiseGain).connect(master);
  noise.onended = () => noiseGain.disconnect();
  noise.start(t);
  noise.stop(t + 0.1);

  // Capa 2: cuerpo grave que le da el peso.
  const osc = c.createOscillator();
  const oscGain = c.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(420, t);
  osc.frequency.exponentialRampToValueAtTime(150, t + 0.14);

  oscGain.gain.setValueAtTime(0.0001, t);
  oscGain.gain.exponentialRampToValueAtTime(0.2, t + 0.008);
  oscGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);

  osc.connect(oscGain).connect(master);
  osc.onended = () => oscGain.disconnect();
  osc.start(t);
  osc.stop(t + 0.17);
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
