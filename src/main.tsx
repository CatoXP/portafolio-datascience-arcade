import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Fuentes autoalojadas: se empaquetan en el build, sin peticion al CDN de
// Google en tiempo de ejecucion. Ambas con licencia SIL OFL 1.1.
import '@fontsource/anton/latin-400.css';
import '@fontsource-variable/inter/wght.css';

import './styles/index.css';
import App from './App';

const container = document.getElementById('root');
if (!container) throw new Error('No se encontró #root en index.html');

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
